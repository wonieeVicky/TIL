# https, http2

### https

- 웹 서버에 SSL 암호화를 추가하는 모듈
  - 오고가는 데이터를 암호화해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없음
  - 요즘에는 https 적용이 필수이다. (개인 정보가 있는 곳은 특히)

### https 서버

- http 서버를 https 서버로
  - 암호화를 위해 인증서가 필요한데 발급받아야 함
- createServer가 인자를 두 개 받음
  - 첫 번째 인자는 인증서와 관련된 옵션 객체
  - pem, crt, key 등 인증서를 구입할 때 얻을 수 있는 파일 넣기
  - 두 번째 인자는 서버 로직

```tsx
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
```

### http2 서버

![](../img/210415-1.png)

- SSL 암호화와 더불어 최신 HTTP 프로토콜이 http/2를 사용하는 모듈
  - 요청 및 응답 방식이 기존 http/1.1보다 개선됨
  - 웹의 속도도 개선됨
  - HTTP/1.1 Baseline → HTTP/2 Multiplexing
  - 데이터를 동시에 받아오는 방식을 채택하므로 매우 빨라짐
  - 요즘은 주로 http2를 적용한다.

### http2 적용

- https 모듈을 http2로, `createServer` 메서드를 `createSecureServer` 메서드로

```tsx
const http2 = require("http2");
const fs = require("fs");

http2
  .createSecureServer
  // like https
  ()
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다.");
  });
```
