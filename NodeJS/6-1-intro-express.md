# express 서버 사용해보기

### express 왜 쓸까?

**http 모듈로 웹 서버를 만들 때 코드가 보기 좋지않고, 확장성도 떨어진다.** 따라서

- 프레임워크로 해결
- 대표적인 것이 Express(익스프레스), Koa(코아), Hapi(하피)
- 코드 관리도 용이하고 편의성이 많이 높아짐

### package.json 만들기

**직접 만들거나 npm init 명령어로 생성**

- nodemon이 소스 코드 변경 시 서버를 재시작 해준다.

`package.json`

```json
{
  "name": "learn-express",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "nodemon app"
  },
  "author": "vicky",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

```bash
$ npm i express
$ npm i -D nodemon // 혹은 npm i -g nodemon
```

### app.js 작성하기

**서버 구동의 핵심이 되는 파일**

- app.set('port', 포트)로 서버가 실행될 포트 지정
- app.get('주소', 라우터)로 GET 요청이 올 때 어떤 동작을 할지 지정
- app.listen('포트', 콜백)으로 몇 번 포트에서 서버를 실행할지 지정

`app.js`

```jsx
const express = require("express");

// 전역변수 느낌적인 느낌
const app = express();
app.set("port", process.env.PORT || 3000);

// app에 메서드를 구현하는 방식으로 코드를 작성할 수 있다.
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// 별도 포트를 지정하지 않고, app의 포트번호를 가져온다.
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
```

404, 500 error를 알아서 처리한다.

### 실제 서버 실행해보기

```bash
$ node app
// 혹은
$ nodemon app
// 혹은
$ npm start

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
3000 번 포트에서 대기 중
```

개발환경에서는 `nodemon`을 많이 사용하는데 이유는 변경사항을 알아서 감지하여 화면을 새로고침해주기 때문이다 !
