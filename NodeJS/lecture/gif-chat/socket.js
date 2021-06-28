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
    const req = socekt.request;
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

  /* // 웹소켓 연결 시
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
  }); */
};
