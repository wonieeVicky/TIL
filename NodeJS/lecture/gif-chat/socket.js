const WebSocket = require("ws");

module.exports = (server) => {
  // web-socket-server
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    // 웹 소켓 연결 시
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // ip 파악
    console.log("새로운 클라이언트 접속", ip);
    // 클라이언트로부터 메시지
    ws.on("message", (message) => {
      console.log(message);
    });
    // 에러 시
    ws.on("error", (error) => {
      console.error(error);
    });
    // 연결 종료 시
    ws.on("close", () => {
      console.log("클라이언트 접속 해제", ip);
      clearInterval(ws.interval);
    });

    // 3초마다 클라이언트로 메시지 전송
    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라이언트로 메시지를 보낸다.");
      }
    }, 3000);
  });
};
