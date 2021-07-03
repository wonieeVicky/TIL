const SSE = require("sse");

module.exports = (server) => {
  const sse = new SSE(server);
  // 서버센트 이벤트 연결 - 매 초마다 서버 시간을 보내준다.
  sse.on("connection", (client) => {
    setInterval(() => {
      client.send(Date.now().toString());
    }, 1000);
  });
};
