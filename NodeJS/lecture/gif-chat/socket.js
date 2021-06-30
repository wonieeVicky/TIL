const SocketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const cookie = require("cookie-signature");

module.exports = (server, app, sessionMiddleware) => {
  // 서버와 연결
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io); // req.app.get('io') 라우터에서 socket.io를 호출해서 사용할 수 있다.
  const room = io.of("/room"); // namespace
  const chat = io.of("/chat"); // namespace

  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
  chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
  chat.use(wrap(sessionMiddleware));

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
      chat: `${req.session.color}님이 입장하셨습니다.`
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
