# 로컬 로그인 구현

### 로컬 로그인 구현하기

- passport-local 패키지 필요
  - 로컬 로그인 전략 수립
  - 로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 한다.
  - 사용자가 로그인했는지, 하지 않았는지 여부를 체크하는 미들웨어도 만들어준다.
- `routes/middlewares.js`

  ```jsx
  exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send("로그인 필요");
    }
  };

  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent("로그인한 상태입니다.");
      res.redirect(`/?error=${message}`);
    }
  };
  ```

- `routes/page.js`

  ```jsx
  const express = require("express");
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.follwerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
  });

  router.get("/profile", (req, res) => {
    res.render("profile", { title: "내 정보 - NodeBird" });
  });

  router.get("/join", (req, res) => {
    res.render("join", { title: "회원가입 - NodeBird" });
  });

  router.get("/", (req, res, next) => {
    const twits = [];
    res.render("main", {
      title: "NodeBird",
      twits,
    });
  });

  module.exports = router;
  ```

### 회원가입 라우터

- `routes/auth.js` 작성
  - `bcrypt.hash`로 비밀번호 암호화
  - hash의 두 번째 인수는 암호화 라운드
  - 라운드가 높을수록 안전하지만 오래 걸림
  - 적당한 라운드를 찾는 게 좋다.
  - ?error 쿼리스트링으로 1회성 메시지
- `routes/auth.js`

  ```jsx
  const express = require("express");
  const passport = require("passport");
  const bcrypt = require("bcrypt");
  const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
  const User = require("../models/user");

  const router = express.Router();

  // 회원가입(join) : 로그인을 안 한 상태여야 하므로 isNotLoggedIn
  router.post("/join", isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        return res.redirect("/join?error=exist"); // 이미 가입한 이메일
      }
      const hash = await bcrypt.hash(password, 12); // 숫자가 높을수록 보안성은 높아지지만, 소요시간은 오래걸린다.(trade off)
      await User.create({
        email,
        nick,
        password: hash, // hash로 변환한 비밀번호를 저장한다.
      });
      return res.redirect("/");
    } catch (err) {
      console.err(err);
      return next(error);
    }
  });

  // ...
  ```

### 로그인 라우터

- routes/auth.js 작성
  - passport.authenticated('local') : 로컬 전략
  - 전략을 수행하고 나면 authenticate의 콜백 함수가 호출된다.
  - authError : 인증 과정 중 에러
  - user : 인증 성공 시 유저 정보
  - info : 인증 오류에 대한 메시지
  - 인증이 성공했다면 req.login으로 세션에 유저정보 저장
- `routes/auth.js`

  ```jsx
  // ...

  // 로그인(login) : 로그인을 안 한 상태여야 하므로 isNotLoggedIn
  router.post("/login", isNotLoggedIn, (req, res, next) => {
    // req.user : 사용자 정보가 없음
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        // passport index.js 실행
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        // 세션 쿠키를 브라우저로 보내준다.
        return res.redirect("/");
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
  });

  // 로그인 한 사람만 로그아웃 해야 하므로 isLoggedIn
  router.get("/logout", isLoggedIn, (req, res) => {
    // req.user : 사용자 정보가 있음
    req.logout();
    req.session.destroy;
    res.redirect("/");
  });

  module.exports = router;
  ```

### 로컬 전략 작성

- passport/localStrategy.js 작성
  - usernameField와 passwordField가 input 태그의 name(body-parser의 req.body)
  - 사용자가 DB에 저장되어 있는지 확인 후 있다면 비밀번호 비교(bcrypt.compare)
  - 비밀번호까지 일치한다면 로그인
  - LocalStrategy Flow
    - 로그인 성공 시
      - done(null, exUser);
        - null → authError, exUser → user
        - passport.authenticate('local', (authError, user, info) ⇒ {});
    - 로그인 실패 시
      - done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        - null → authError, false → user, { message: .. } → info
        - passport.authenticate('local', (authError, user, info) ⇒ {});
    - 서버 에러 시
      - done(error);
        - error → authError
        - passport.authenticate('local', (authError, user, info) ⇒ {});
- `passport/localStrategy.js`

  ```jsx
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcrypt");

  const User = require("../models/user");

  module.exports = () => {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email", // req.body.email
          passwordField: "password", // req.body.password
        },
        async (email, password, done) => {
          try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
              const result = await bcrypt.compare(password, exUser.password); // true or false
              if (result) {
                done(null, exUser); // response로 user 객체 보내준다.
              } else {
                done(null, false, { message: "비밀번호가 일치하지 않습니다. " });
              }
            } else {
              done(null, false, { message: "가입되지 않은 회원입니다." });
            }
          } catch (err) {
            console.error(err);
            done(err);
          }
        }
      )
    );
  };
  ```
