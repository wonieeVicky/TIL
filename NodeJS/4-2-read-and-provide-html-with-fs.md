# 2. fs로 HTML 읽어 제공하기

http 메서드를 통해 HTML을 보내줬는데 특정 브라우저의 경우 res.write('') 안의 태그가 문자인지 HTML인지 혹은 한글인지 구별을 못할 때도 있다. 가령 사파리가 그러하다. 그럴 때에는 해당 파일이 HTML이라는 것을 얘기해주어야 하는데 그것은 res.writehead내에 기입한다.

```jsx
const http = require('http');

const server = http
  .createServer((req, res) => {
    // 여기 !
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.write('<h1>Hello server!</h1>');
    res.end('<p>Hello Vicky :)</p>');
  })
  .listen(8080);

server.on('listning', () => {
  // 서버연결
  console.log('8080번 포트에서 서버 대기중입니다!');
});
server.on('error', (error) => {
  console.error(error);
});
```

또 작업은 8080 포트에서 진행 후 나중에 배포할 때에는 80으로 변경하면 해당 주소 뒤에 바로 도메인을 적용할 수 있다. 물론 로컬 작업 시에도 listen(80)으로 설정하여도 무방하나 다른 곳에서 이미 해당 포트를 사용하고 있을 확률이 높다. listen(80)의 경우 localhost:80이 아닌 localhost로 접근할 수 있다.

위 server 변수를 server1, server2로 하여 여러개를 동시에 돌릴 수 있다. 굳이 그렇게 할 필요가 없을 뿐이다.

### 2-1. HTML을 읽어서 제공하기

createServer 내에 데이터를 직접 넣으면 아무래도 코드가 더러워진다. 이를 위해 별도의 html파일에 넣어줄 데이터를 넣고 fs의 readFile 메서드로 읽어 데이터를 제공하는 방법이 있다.

`server2.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NodeJs 웹서버</title>
  </head>
  <body>
    <h1>NodeJS 웹서버</h1>
    <div>html파일을 직접 넣어준다!</div>
  </body>
</html>
```

`server.js`

```jsx
const http = require('http');
const fs = require('fs').promises;

const server = http
  .createServer(async (req, res) => {
    try {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const data = await fs.readFile('./server2.html');
      res.end(data);
    } catch (err) {
      console.error(err);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  })
  .listen(80);

server.on('listning', () => {
  // 서버연결
  console.log('80번 포트에서 서버 대기중입니다!');
});
server.on('error', (error) => {
  console.error(error);
});
```

readFile 시에는 반드시 async - await을 붙여주고, try - catch 문법으로 감싸준다. 에러 시에는 Content-Type을 text/plain으로 바꾼 뒤 에러 메시지를 반환해주면 해당 메시지를 출력해줄 수 있다 :)
