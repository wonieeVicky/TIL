# 클라이언트 호출 서버(NodeCat) 만들기

### 호출서버 nodecat 프로젝트 구조 갖추기

`nodecat/package.json`

```json
{
  "name": "nodecat",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon app"
  },
  "author": "Vicky",
  "license": "MIT",
  "dependencies": {
    "axios": "^0.21.1",
    "cookie-parser": "^1.4.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "morgan": "^1.10.0",
    "nunjucks": "^3.2.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

`nodecat/.env`

```
COOKIE_SECRET=123
CLIENT_SECRET=123123
```

`nodecat/app.js`

```jsx
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes");

const app = express();
app.set("port", process.env.PORT || 4000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true
});

app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use("/", indexRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

### 토큰 테스트용 라우터 만들기

- `routes/index.js` 생성

  - GET /test에 접근 시 세션 검사
    - 세션에 토큰이 저장되어 있지 않으면 POST [http://localhost:8002/v1/token](http://localhost:8002/v1/token)로 토큰 발급
    - 이때 HTTP 요청 본문에 클라이언트 비밀키(CLIENT_SECRET) 동봉
  - 발급에 성공했다면 발급받은 토큰으로 다시 GET [http://localhost:8002/v1/test](http://localhost:8002/v1/test) 로 접근, 토큰 테스트

  ```jsx
  const express = require("express");
  const axios = require("axios");

  const router = express.Router();

  // 토큰 테스트 라우터
  router.get("/test", async (req, res, next) => {
    try {
      // 세션에 토큰이 없으면 토큰 발급 시도 - 초기
      if (!req.session.jwt) {
        const tokenResult = await axios.post("http://localhost:8002/v1/token", {
          clientSecret: process.env.CLIENT_SECRET
        });
        if (tokenResult.data && tokenResult.data.code === 200) {
          // 토큰 발급 성공
          req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
        } else {
          // 토큰 발급 실패
          return res.json(tokenResult.data); // 발급 실패 사유 응답
        }
      }
      // 발급받은 토큰 테스트 :: verifyToken
      const result = await axios.get("http://localhost:8002/v1/test", {
        headers: {
          authorization: req.session.jwt
        }
      });
      return res.json(result.data);
    } catch (error) {
      console.error(error);
      if (error.response.status === 419) {
        // 토큰 만료 시
        return res.json(error.response.data);
      }
      return next(error);
    }
  });

  module.exports = router;
  ```

### 요청보내기

- npm start로 서버를 시작한 뒤, [http://localhost:4000/test에](http://localhost:4000/test에) 접속한다.

  (단, nodebird-api, nodecat 서버 모두 실행 필요)

  - 토큰 테스트 성공

    ```json
    {
      "id": 1,
      "nick": "vicky",
      "iat": 1623509205,
      "exp": 1623509265,
      "iss": "nodebird"
    }
    ```

  - 유효기간(1분) 후 토큰 만료 시 토큰 테스트 실패

    ```json
    {
      "code": 419,
      "message": "토큰이 만료되었습니다"
    }
    ```
