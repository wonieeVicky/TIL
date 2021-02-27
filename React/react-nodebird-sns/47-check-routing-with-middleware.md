# 미들웨어로 라우팅 검사하기

이제 로그인과 로그아웃에 대한 기능이 모두 만들어졌다..!  
그런데 한가지 확인해야 할 것이 있다. 이미 공개적으로 만들어져있는 로그인, 로그아웃 API를 임의로 사용하여, 로그인 하지 않은 상태에서 로그아웃 API를 동작시키거나 로그인을 한 상태에서 또 로그인 API를 동작시킬 수도 있다. 이럴 때는 미들웨어로 라우터를 검사해야 하는데, 그 방법을 알아보자.

먼저 로그인 여부를 확인하는 미들웨어를 만들기 위해 back/routes 내 `middlewares.js`라는 파일을 만든다.

```jsx
// middlewares.js
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // next의 사용법!
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
```

login 여부를 확인하기 위해 req에서 제공하는 메서드인 isAuthenticated를 사용해서 체크한다.  
위 코드에서 `next();`라는 코드가 사용되었는데 기존에는 `next(loginErr);` 와 같이 에러를 처리하기 위한 방법으로 사용되었으나, 여기에서는 다음 미들웨어로 가기 우

위 코드는 모두 exports 하였으므로 바깥에서 사용할 수 있으므로 해당 내용을 `routes/user.js`에 적용하자

```jsx
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

// POST /user/login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", isNotLoggedIn, (err, user, info) => { /* codes.. */ });
  })(req, res, next);
});

// POST /user/
router.post("/", isNotLoggedIn, async (req, res, next) => { /* codes.. */ });

// POST /user/logout
router.post("/logout", isLoggedIn, (req, res, next) => { /* codes.. */ });

module.exports = router;
```

위와 같이 미들웨어를 라우터 동작 중간에 끼워넣는다. 위 코드가 위에서 부터 아래로 왼쪽에서 오른쪽으로 읽히며 순서적으로 진행되면서 조건에 맞을 때 middlewares에서 적은 `next()`가 실행된다. 보통 next()안에 별도의 인자가 없을 경우 다음 미들웨어로 보내는 역할을 한다. 따라서 이후 (req, res, next) ⇒ {} 코드가 순서대로 실행되는 것이다.

따라서 next(err); 으로 코드를 썻을 경우 다음 미들웨어로 가지 않고 에러 미들웨어로 가게 되는데, 이 에러 미들웨어의 경우 app.js의 app.listen(()⇒{}); 의 상위.. 그러니까 미들웨어 적용의 최하단 쯤에 내부적으로 존재한다.

만약 에러 처리 미들웨어를 직접 커스텀하려면 어떻게 할까? 직접 만들어주면 된다.

`/back/app.js`

```jsx
// codes..
app.use((err, req, res, next) => {
  // 에러 처리 미들웨어 구현
});

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
```

에러처리 미들웨어의 경우 위와 같이 매개변수가 4개이다. 보통 내부적으로 존재하는 에러 미들웨어를 사용하지만 위와 같이 별도의 에러 처리 미들웨어를 구현하는 이유는 에러 페이지를 별도로 띄우거나, 에러에 어떤 정보를 제외시키고 싶을 경우에 별도로 구현해주는 편이다.

## 라우터 검사를 별도 커스텀 미들웨어로 분리하는 이유?

사실 위 미들웨어를 직접 라우터 안에 적어줘도 된다.

```jsx
// POST /user/login
router.post("/login", (req, res, next) => {
	// 로그인 여부 검사
	if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }

  passport.authenticate("local", isNotLoggedIn, (err, user, info) => { /* codes.. */ });
  })(req, res, next);
});
```

위와 같이 각 라우터에서 처리해도 되지만, 이렇게 할 경우 중복된 영역의 API마다 해당 체크를 하는 로직이 중복으로 들어가기 때문에 해당 미들웨어만 별도로 커스텀 미들웨어로 분리해준 것이다.
