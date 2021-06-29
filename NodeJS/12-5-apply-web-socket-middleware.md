# 웹 소켓 미들웨어 적용

### socket.io에서 세션 사용하기

- app.js 수정 후 Socket.IO 미들웨어로 연결
  - `chat.use`로 익스프레스 미들웨어를 Socket.io에서 사용 가능
- `app.js`

  ```jsx
  // ..
  const sessionMiddleware = session({
    // sessionMiddleware 별도 분리
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  });
  app.use(sessionMiddleware);

  // ..
  webSocket(server, app, sessionMiddleware); // 인자로 sessionMiddleware 내려준다.
  ```

- `socket.js`

  ```jsx
  const SocketIO = require("socket.io");
  const cookieParser = require("cookie-parser");
  const axios = require("axios");
  const cookie = require("cookie-signature");

  module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: "/socket.io" });
    app.set("io", io); // req.app.get('io') 라우터에서 socket.io를 호출해서 사용할 수 있다.
    const room = io.of("/room");
    const chat = io.of("/chat");

    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
    chat.use(wrap(sessionMiddleware));

    //...
  };
  ```

  ### 방 입장, 퇴장 메시지 전송하기

  - 방 제거 시 cookie값 체크할 수 있도록 `cookie-signature`라이브러리 설치

    ```bash
    $ npm i cookie-signature
    ```

  - `socket.js`

    ```jsx
    const SocketIO = require("socket.io");
    const cookieParser = require("cookie-parser");
    const axios = require("axios");
    const cookie = require("cookie-signature");

    module.exports = (server, app, sessionMiddleware) => {
      // ...

      chat.on("connection", (socket) => {
        console.log("chat 네임스페이스에 접속");
        const req = socket.request;
        const {
          headers: { referer }
        } = req;
        const roomId = referer.split("/")[referer.split("/").length - 1].replace(/\?.+/, "");
        socket.join(roomId);
        socket.to(roomId).emit("join", {
          user: "system",
          chat: `${req.session.color}님이 입장하셨습니다.` // 미들웨어 적용으로 req.session.color에 접근가능
        });

        socket.on("disconnect", () => {
          console.log("chat 네임스페이스 접속 해제");
          socket.leave(roomId);
          const currentRoom = socket.adapter.rooms.get(roomId);
          const userCount = currentRoom ? currentRoom.size : 0;
          // 유저가 0명이면 방을 삭제한다.
          if (userCount === 0) {
            const connectSID = cookie.sign(req.signedCookies["connect.sid"], process.env.COOKIE_SECRET);
            axios
              .delete(`http://localhost:8005/room/${roomId}`, {
                headers: {
                  Cookie: `connect.sid=s%3A${connectSID}`
                }
              })
              .then(() => {
                console.log(`${roomId} 방 제거 성공`);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            socket.to(roomId).emit("exit", {
              user: "system",
              chat: `${req.session.color}님이 퇴장하셨습니다.`
            });
          }
        });
      });
    };
    ```

### 라우터 작성하기

- `routes/index.js`

  각 액션에 대한 라우터 생성해준다.

  ```jsx
  const express = require("express");

  const Room = require("../schemas/room");
  const Chat = require("../schemas/chat");

  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const rooms = await Room.find({});
      res.render("main", { rooms, title: "GIF 채팅방" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  router.get("/room", (req, res) => {
    res.render("room", { title: "GIF 채팅방 생성" });
  });

  router.post("/room", async (req, res, next) => {
    try {
      const newRoom = await Room.create({
        title: req.body.title,
        max: req.body.max,
        owner: req.session.color,
        password: req.body.password
      });
      const io = req.app.get("io"); // socket.js app.set("io", io);
      io.of("/room").emit("newRoom", newRoom); // 방 생성
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`); // 방 입장
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  // 비밀번호가 있는 방
  router.get("/room/:id", async (req, res, next) => {
    try {
      const room = await Room.findOne({ _id: req.params.id }); // 방이 있는지 확인
      const io = req.app.get("io");
      if (!room) {
        return res.redirect("/?error=존재하지 않는 방입니다.");
      }
      if (room.password && room.password !== req.query.password) {
        return res.redirect("/?error=비밀번호가 틀렸습니다.");
      }
      const { rooms } = io.of("/chat").adapter; // 인원제한
      if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
        return res.redirect("/?error=허용 인원이 초과하였습니다.");
      }
      return res.render("chat", {
        room,
        title: room.title,
        chats: [],
        user: req.session.color
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

  router.delete("/room/:id", async (req, res, next) => {
    try {
      await Room.remove({ _id: req.params.id });
      await Chat.remove({ room: req.params.id }); // 채팅 내역 삭제
      res.send("ok");
      req.app.get("io").of("/room").emit("removeRoom", req.params.id);
      // 방에서 나간 사람에게도 지워진 방을 삭제하기
      setTimeout(() => {
        req.app.get("io").of("/room").emit("removeRoom", req.params.id);
      }, 2000);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  module.exports = router;
  ```
