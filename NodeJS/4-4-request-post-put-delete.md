# 4. POST, PUT, DELETE 요청

지난시간 넣어두었던 restServer.js의 POST, PUT, DELETE에 대한 구현부분을 더 살펴본다.

```jsx
const http = require('http');
const fs = require('fs').promises;
const users = {};

http
  .createServer(async (req, res) => {
    try {
      if (req.method === 'GET') {
        // 요청 메서드 GET
        // codes..
      } else if (req.method === 'POST') {
        // 요청 메서드 POST
        if (req.url === '/user') {
          let body = '';
          // 요청의 body를 stream 형식으로 받음
          req.on('data', (data) => {
            body += data;
          });
          // 요청의 body를 다 받은 후 실행됨
          return req.on('end', () => {
            console.log('POST 본문(Body):', body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('ok');
          });
        }
      } else if (req.method === 'PUT') {
        // 요청 메서드 PUT
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          let body = '';
          req.on('data', (data) => {
            body += data;
          });
          return req.on('end', () => {
            console.log('PUT 본문(Body):', body);
            users[key] = JSON.parse(body).name;
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('ok');
          });
        }
      } else if (req.method === 'DELETE') {
        // 요청 메서드 DELETE
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          delete users[key];
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('ok');
        }
      }
      res.writeHead(404);
      return res.end('NOT FOUND');
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  })
  .listen(8082, () => {
    console.log('8082번 포트에서 서버 대기 중입니다');
  });
```

- `POST`와 `PUT` 메서드는 클라이언트로부터 데이터를 받으므로 특별한 처리가 필요하다. req.on('data', 콜백)과 req.on('end', 콜백) 부분인데, 해당 방식은 지난 시간 버퍼와 스트림에서 배웠던 readStream을 활용해 처리한 예시이다. readStream으로 요청과 같이 들어오는 요청 본문을 받을 수 있다. 단 문자열이므로 JSON으로 만드는 `JSON.parse` 과정이 한번 필요하다.
- `POST /user`시 데이터 등록이 성공하면 HTTP status code로 200번이 아닌 201번을 보내준다. 201번은 보통 요청한 정보가 잘 등록되어 새로운 리소스가 생성되었다는 의미로 사용한다. (참고. [HTTP status code](https://developer.mozilla.org/ko/docs/Web/HTTP/Status) - 자주쓰는 status code 200, 201, 400, 403, 500, 503 정도.. 용도에 맞게 사용한다.)
- `DELETE` 메서드로 요청이 오면 주소에 들어있는 키에 해당하는 사용자를 제거한다.

위와 같은 방법으로 http만을 가지고 REST API를 구현해보았다.  
이미 만들어진 특정 패턴을 참고하여 작업하면 조금 더 가독성 있는 코드로 만들 수 있다.

또 개발자도구(F12) Network 탭을 이용해 요청 내용을 실시간으로 확인할 수 있다.

- Name은 요청 주소, Method는 요청 메서드, Status는 HTTP 응답 코드
- Protocol은 HTTP 프로토콜, Type은 요청 종류(xhr은 AJAX 요청)
