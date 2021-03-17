# 3. REST API 서버 만들기

## 3-1. REST API

### 서버에 요청을 보낼 때는 주소를 통해서 요청의 내용을 표현

- /index.html이면 index.html을 보내달라는 뜻
- 항상 html을 요구할 필요는 없으며 서버가 이해하기 쉬운 주소로 적자
- 보통 정보에 대한 요청을 서버가 모두 허용하지 않기 때문에 데이터의 주도권은 서버가 가지고 있다.  
  따라서 서버가 정해준 주소나 방법으로 클라이언트가 따라간다.

### REST API(Representational State Transfer)

- 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법
  - 좀 더 자세히 알아보기 👩🏻‍🏫
    REST API란 웹의 장점을 최대한 활용할 수 있는 아키텍쳐로, HTTP 프로토콜을 의도에 맞게 디자인하도록 유도하기 위해 만들어진 설계방법이다. REST의 기본 원칙을 성실히 지킨 서비스 디자인을 “RESTful”이라고 표현한다. URI는 자원을 표현하는 데에 집중하고 행위에 대한 정의는 HTTP Method를 통해 하는 것이 REST한 API를 설계하는 중심 규칙이다.
- 아래와 같이 REST 규칙에 근거한 주소를 결정하는 것 ⇒ 클라이언트가 서버의 구조를 파악하는 데 도움이 됨
  - `/user`이면 사용자 정보에 관한 정보를 요청하는 것
  - `/post`이면 게시글에 관련된 자원을 요청하는 것
- 단점: 주소에 규칙성이 있기 때문에, 자원이 어디에 위치할 지 예측하여 정보 해킹 등에 악용될 수 있다.

### HTTP 요청 메서드

- GET: 서버 자원을 가져오려고 할 때 사용한다.
- POST: 서버에 자원을 새로 등록하고자 할 때 사용한다(또는 뭘 써야할지 애매할 때)
- PUT: 서버의 자원을 요청에 들어있는 자원으로 치환하고자할 때 사용 - 전체 수정(A유저를 B유저로)
- PATCH: 서버 자원의 일부만 수정하고자 할 때 사용 - 부분 수정(A의 나이를 31 → 32로)
- DELETE: 서버 자원의 일부만 수정하고자 할 때 사용
  - 애매할 때는 주로 POST를 사용한다. (로그인 시, 결제나 송금 시)

## 3-2. HTTP 프로토콜

### 클라이언트가 누구든 서버와 HTTP 프로토콜로 소통 가능

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca31d9b2-a4b9-4118-b9c2-39a124d37568/_2021-03-16__9.25.54.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca31d9b2-a4b9-4118-b9c2-39a124d37568/_2021-03-16__9.25.54.png)

- iOS, 안드로이드, 웹이 모두 같은 주소로 요청을 보낼 수 있음
- 서버와 클라이언트의 분리

### RESTful

- REST API를 사용한 주소 체계를 이용하는 서버 ⇒ 'RESTful한 서버다!'
- GET /user는 사용자를 조회하는 요청, POST /user는 사용자를 등록하는 요청
- 실제 규칙에 동사를 쓰면 안된다던지 하는 규칙에 정확히 맞추는 것이 매우 어렵기 때문에 RESTful한 서버가 되기는 정말 어렵다. 따라서 무조건 준수하게 맞춘다라기 보다는 주소만 보면 바로 해당 기능을 알 수 있도록 짜면 그것만으로도 훌륭하다.

### 3-3. REST 서버 만들기

먼저 REST 서버를 구동하기 위해 기본적으로 필요한 페이지와 API 콜 스크립트를 작성해보자.

`/about.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>RESTful SERVER</title>
    <link rel="stylesheet" href="./restFront.css" />
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <div>
      <h2>소개 페이지입니다.</h2>
      <p>사용자 이름을 등록하세요!</p>
    </div>
  </body>
</html>
```

`/restFront.html`

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>RESTful SERVER</title>
    <style>
      a {
        color: blue;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <div>
      <form id="form">
        <input type="text" id="username" />
        <button type="submit">등록</button>
      </form>
    </div>
    <div id="list"></div>
    <scrip src="https://unpkg.com/axios/dist/axios.min.js"></scrip>
    <scrip src="./restFront.js"></scrip>
  </body>
</html>
```

`/restFront.js` → API request 를 위한 프론트 Script

```jsx
async function getUser() {
  // 로딩 시 사용자 가져오는 함수
  try {
    const res = await axios.get('/users');
    const users = res.data;
    const list = document.getElementById('list');
    list.innerHTML = '';
    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    Object.keys(users).map(function (key) {
      const userDiv = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = users[key];
      const edit = document.createElement('button');
      edit.textContent = '수정';
      edit.addEventListener('click', async () => {
        // 수정 버튼 클릭
        const name = prompt('바꿀 이름을 입력하세요');
        if (!name) {
          return alert('이름을 반드시 입력하셔야 합니다');
        }
        try {
          await axios.put('/user/' + key, { name });
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement('button');
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        // 삭제 버튼 클릭
        try {
          await axios.delete('/user/' + key);
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
      console.log(res.data);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser; // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  if (!name) {
    return alert('이름을 입력하세요');
  }
  try {
    await axios.post('/user', { name });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = '';
});
```

그리고 드디어 REST API 서버를 만들어본다.

```jsx
const http = require('http');
const fs = require('fs').promises;
const users = {}; // 데이터 저장용

http
  .createServer(async (req, res) => {
    // req: request & res: response
    try {
      if (req.method === 'GET') {
        // 요청 메서드 GET
        if (req.url === '/') {
          // 요청 url이 /이면 restFront.html을 노출한다.
          const data = await fs.readFile('./restFront.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(data);
          // 요청 url이 /about이면 about.html을 노출한다.
        } else if (req.url === '/about') {
          const data = await fs.readFile('./about.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(data);
          // 요청 url이 /users이면 users 정보를 보내준다.
        } else if (req.url === '/users') {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(users));
        }
        // 요청 url이 /도 /about도 /users도 아니면
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {
          // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
        }
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

- `GET` 메서드에서 `/`, `/about` 요청 주소는 페이지를 요청하는 것이므로 HTML파일을 읽어서 전송한다. AJAX 요청을 처리하는 `/users`에서는 users 데이터 묶음을 전송하는데 이를 JSON형식으로 보내기 위해 `JSON.stringify`를 해주었다. 그 외의 GET 요청은 CSS나 JS파일을 요청하는 것이므로 찾아서 보내주고, 없다면 404 NOT FOUND 에러를 응답한다.
- 해당하는 주소가 없을 경우 `404 NOT FOUND` 에러를 응답한다.

해당 내용을 살펴보며 크롬의 디버그 콘솔 - Network를 이용해서 데이터가 어떻게 요청되고 들어오는지 살펴보자. response 정보 뿐만아니라 request 정보도 함께 보여준다. 다음시간에 POST, PUT, DELETE 메서드도 함께 확인해본다!
