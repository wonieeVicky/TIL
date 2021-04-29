# router 분리

### express.Router

라우터를 분리하면 app.js가 길어지는 것을 막을 수 있다.

- userRouter의 get은 /user와 /가 합쳐져서 GET /user/가 된다.

`routes/index.js`

```jsx
const express = require("express");
const router = express.Router();

// GET / 라우터
router.get("/", (req, res) => {
  res.send("Hello, Express!");
});

module.exports = router;
```

`routes/user.js`

```jsx
const express = require("express");
const router = express.Router();

// GET /user 라우터
router.get("/", (req, res) => {
  res.send("Hello, User!");
});

module.exports = router;
```

`app.js`

```jsx
// ...
const path = require("path");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

// ...
app.use("/", indexRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
```

### 라우트 매개변수

`:id`를 넣으면 `req.params.id`로 받을 수 있음

- 동적으로 변하는 부분을 라우트 매개변수로 만든다.

  ```jsx
  router.get("/user/:id", (req, res) => {
    console.log(req.params, req.query);
  });
  ```

- 일반 라우터보다 뒤에 위치해야 한다.

  ```jsx
  router.get("/user/:id", (req, res) => {
    console.log("얘만 실행된다.");
  });
  router.get("/user/like", (req, res) => {
    console.log("전혀 실행되지 않는다.");
  });
  ```

- /users/123?limit=5&skip=10 주소 요청인 경우

  ```jsx
  { id: '123' } // req.params.id
  { limit: '5', skip: '10' } // req.query.limit, req.query.skip
  ```

### 404 미들웨어

요청과 일치하는 라우터가 없는 경우를 대비해 404 라우터를 만들기

```jsx
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
```

위와 같은 설정이 없을 경우 단순히 `Cannot GET 주소` 문자열이 브라우저에 노출된다.

### 라우터 그룹화하기

주소는 같지만 메서드가 다른 코드가 있을 때

```jsx
router.get("/abc", (req, res) => {
  res.send("GET /abc");
});
router.post("/abc", (req, res) => {
  res.send("POST /abc");
});
```

`router.route`로 묶어서 관리할 수 있다..!

```jsx
router
  .route("/abc")
  .get((req, res) => {
    res.send("GET /abc");
  })
  .post((req, res) => {
    res.send("POST /abc");
  });
```

## req, res 객체 살펴보기

### req

- req.app: req 객체를 통해 app 객체에 접근할 수 있다. req.app.get('port')와 같은 식으로 사용할 수 있다.
- req.body : body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체이다.
- req.cookie : cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체이다.
- req.ip : 요청의 ip 주소가 담겨있다.
- req.params : 라우트 매개변수에 대한 정보가 담긴 객체이다.
- req.query : 쿼리스트링에 대한 정보가 담긴 객체이다.
- req.signedCookies : 서명된 쿠키들은 req.cookies 대신 여기에 담겨있다.
- req.get(헤더이름) : 헤더의 값을 가져오고 싶을 때 사용하는 메서드이다.

### res

- res.app : req.app처럼 res객체를 통해 app 객체에 접근할 수 있다.
- res.cookie(키, 값, 옵션): 쿠키를 설정하는 메서드이다.
- res.clearCookie(키, 값, 옵션): 쿠키를 제거하는 메서드이다.
- res.end() : 데이터 없이 응답을 보낸다.
- res.json(JSON) : JSON 형식의 응답을 보낸다.
- res.redirect(주소) : 리다이렉트할 주소와 함께 응답을 보낸다. `res.status(302).redirect('/');`
- res.render(뷰, 데이터) : 다음 절에서 다룰 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드이다.
- res.send(데이터) : 데이터와 함께 응답을 보낸다. 데이터는 문자열일 수도 있고, HTML일 수도 있으며, 버퍼일 수도 있고 객체, 배열일 수도 잇다.
- res.sendFile(경로) : 경로에 위치한 파일을 응답한다.
- res.set(헤더, 값) or res.setHeader(헤더, 값) : 응답의 헤더를 설정한다.
- res.status(코드) : 응답 시의 HTTP 상태 코드를 지정한다.

### 기타

메서드 체이닝을 지원한다.

```jsx
res.status(201).cookie("test", "test").redirect("/admin");
```

응답은 한 번만 보내야 한다! (아래와 같은 에러가 발생함)

```bash
Error: Can't set headers after they are sent.
```
