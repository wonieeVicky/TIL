const SocketIO = require("socket.io");

module.exports = (server, app) => {
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

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");
    const req = socket.request;
    const {
      headers: { referer }
    } = req;
    const roomId = referer.split("/")[referer.split("/").length - 1].replace(/\?.+/, "");
    socket.join(roomId); // 방

    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
      socket.leave(roomId);
    });
  });
};
