const https = require("https");
const fs = require("fs");

https
  .createServer(
    // https는 cert. key, ca 정보를 받는 인수가 추가된다. 서버가 시작되기 전에는 readFileSync를 사용해도 된다.
    {
      cert: fs.readFileSync("도메인 인증서 경로"),
      key: fs.readFileSync("도메인 비밀키 경로"),
      ca: [fs.readFileSync("상위 인증서 경로"), fs.readFileSync("상위 인증서 경로")],
    },
    (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Server</p>");
    }
  )
  // https를 사용하면 443 포트 사용(생략 가능하므로)
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다.");
  });
