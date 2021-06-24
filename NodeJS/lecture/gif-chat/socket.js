const SocketIO = require("socket.io");

module.exports = (server) => {
  // 서버와 연결
  const io = SocketIO(server, { path: "/socket.io" });

  // 웹소켓 연결 시
  io.on("connection", (socket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속!", ip, socket.id, req.ip);
    // 연결 종료 시
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });
    // 에러 시
    socket.on("error", (error) => {
      console.error(error);
    });
    // 클라이언트로부터 메시지
    socket.on("reply", (data) => {
      console.log(data);
    });
    // 3초마다 클라이언트로 메시지 전송
    socket.interval = setInterval(() => {
      socket.emit("news", "Hello Socket.IO");
    }, 3000);
  });
};
