const SocketIO = require("socket.io");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  // 웹 소켓 연결 시
  io.on("connection", (socket) => {
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer.split("/")[referer.split("/").length - 1]; // roomId는 Good 테이블의 row ID가 된다.
    socket.join(roomId);
    socket.on("disconnect", () => {
      socket.leave(roomId);
    });
  });
};
