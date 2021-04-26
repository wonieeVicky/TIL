# express-session과 미들웨어의 확장

### 세션 관리용 미들웨어 express-session

- `resave`: 요청이 왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부
- `saveUninitialized`: 세션에 저장할 내역이 없더라도 세션을 저장할지 여부
- `req.session.save`로 수동 저장도 가능하지만 사용할 일이 거의 없다.

`app.js`

```jsx
// app.use에 장착해주면 이후 라우터에서 req.session 사용 가능
// req.session은 개인 사용자에 대한 고유한 세션이 된다.
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "connect.sid", // 브라우저에 심기는 cookie-name을 의미한다.
  })
);

app.get("/", (req, res, next) => {
  req.session.name = "vicky"; // 세션 등록
  req.sessionId; // 세션 아이디 확인
  req.session.destroy(); // 세션 모두 제거
});
```

- 세션 쿠키에 대한 설정(secret: 쿠키 암호화, cookie: 세션 쿠키 옵션)
- 세션 쿠키는 앞에 s%3A가 붙은 후 암호화되어 프론트에 전송된다.

### 미들웨어간 데이터 전달하기

- req나 res 객체 안에 값을 넣어 데이터 전달 가능
  - app.set과의 차이점: app.set은 서버 내내 유지, req, res는 요청 하나 동안만 유지
  - req.body나 req.cookie와 같은 미들웨어의 데이터와 겹치지 않게 조심

```jsx
app.use((req, res, next) => {
	req.data = '데이터 넣기';
	next();
}, (req, res, next) => {
	console.log(req.data); // 데이터 받기
	next();
})

// 혹은
app.use((req, res, next) => {
		req.session.data = 'vicky비번'; // session이 남아있을 떄까지 계속 존재함
		req.data = 'vicky비번'; // 1회성 데이터
});

app.get('/'. (req, res, next) => {
	req.seesion.data; // vicky비번
	req.data; // vicky비번(1회성)
});
```

### 미들웨어 확장하기

미들웨어 안에 미들웨어를 넣는 방법

- 아래 두 코드는 동일한 역할을 한다.

  ```jsx
  app.use(morgan("dev"));

  //또는
  app.use((req, res, next) => {
    morgan("dev")(req, res, next);
  });
  ```

- 아래처럼 다양하게 활용 가능

  ```jsx
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      morgan("combined")(req, res, next);
    } else {
      morgan("dev")(req, res, next);
    }
  });
  ```

  ```jsx
  app.use("/", (req, res, next) => {
    if (req.session.id) {
      express.static(__dirname, "public")(req, res, next);
    } else {
      next();
    }
  });
  ```
