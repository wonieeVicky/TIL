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
