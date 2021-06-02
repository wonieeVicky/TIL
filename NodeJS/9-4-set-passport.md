# passport 설정

### 패스포트 설치하기

- 로그인 과정을 쉽게 처리할 수 있게 도와주는 Passport 설치하기

  - 비밀번호 암호화를 위한 bcrypt로 같이 설치
  - 설치 후 app.js와 연결
  - `passport.initialize()` : 요청 객체에 passport 설정을 심음
  - `passport.session()` : req.session 객체에 passport 정보를 저장
  - express-session 미들웨어에 의존하므로 이보다 더 뒤에 위치해야 한다.

    ```bash
    $ npm i passport passport-local passport-kakao bcrypt
    ```

    `app.js`

    ```jsx
    // ...
    const passport = require("passport");
    const passportConfig = require("./passport");

    const app = express();
    passportConfig(); // 패스포트 설정

    // ...

    app.use(
      session({
        // ..
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/", pageRouter);
    app.use("/auth", authRouter); // /auth/join

    // ...
    ```

    `routes/auth.js`

    ```jsx
    const express = require("express");
    const passport = require("passport");
    const bcrypt = require("bcrypt");
    const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
    const User = require("../models/user");

    const router = express.Router();

    // 회원가입(join)
    router.post("/join", async (req, res, next) => {
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

    // 로그인(login)
    router.post("/login", (req, res, next) => {
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

    router.get("/logout", isLoggedIn, (req, res) => {
      req.logout();
      req.session.destroy;
      res.redirect("/");
    });

    module.exports = router;
    ```

### 패스포트 모듈 작성

- `passport/index.js` 작성

  ```jsx
  const passport = require("passport");
  const local = require("./localStrategy");
  const kakao = require("./kakaoStrategy");
  const User = require("../models/user");

  module.exports = () => {
    passport.serializeUser((user, done) => {
      done(null, user.id); // 세션에 user의 id만 저장
    });
    // {id: 3, connect.sid: 1231ad9adkfaldfka }
    passport.deserializeUser((id, done) => {
      User.findOne({ where: { id } })
        .then((user) => done(null, user))
        .catch((err) => done(err));
    });
    local();
    kakao();
  };
  ```

  - passport.serializeUser

    req.session 객체에 어떤 데이터를 저장할 지 선택, 사용자 정보를 다 들고 있으면 메모리를 많이 차지하기 때문에 사용자의 아이디만 저장

  - passport.deserializeUser

    req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 req.user에 저장

- `passport/localStrategy.js` 작성

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

### 패스포트 처리 과정

- 로그인 과정
  1. 로그인 요청이 들어옴
  2. passport.authenticate 메서드 호출
  3. 로그인 전략 수행(쩐략은 뒤에 알아봄)
  4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
  5. req.login 메서드가 passport.serializeUser 호출
  6. req.session에 사용자 아이디만 저장
  7. 로그인 완료
- 로그인 이후 과정
  1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
  2. req.session 에 저장된 아이디로 데이터베이스에서 사용자 조회
  3. 조회된 사용자 정보를 req.user에 저장
  4. 라우터에서 req.user 객체 사용가능
