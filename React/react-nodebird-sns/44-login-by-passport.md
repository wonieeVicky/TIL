# 패스포트로 로그인하기

회원가입을 완료했으면 이제 로그인을 구현해 볼 차례이다.  
우선 기존의 delay()로 구현되었던 saga의 logIn이벤트를 업데이트 해보자!

```jsx
function logInAPI(data) {
  return axios.post("http://localhost:3065/user/login", data);
}
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}
```

위의 백엔드 서버 주소가 다른 API에도 모두 동일하게 적어줘야하는 상수값이다. 이후에 서비스가 오픈되었을 때 해당 url이 nodebird.co.kr과 같이 변경되는데, 그럴 때마다 모든 URL을 바꿔주는 것은 효율적이지 않다. 따라서 saga를 총 관리하는 Index.js에 axios 설정을 추가하여 해당 코드를 지워보자!

`front/sagas/index.js`

```jsx
axios.defaults.baseURL = "http://localhost:3065";
```

위와 같이 설정하면 별도로 앞에 baseURL을 적지않아도 기본적으로 3065 포트로 api가 요청될 것이다.

## 패스포트를 이용한 로그인 구현

카카오 로그인, 구글 로그인, 깃헙 로그인 등 다양한 로그인 정책이 있다. 이런 것들을 한번에 관리해주는 라이브러리가 있는데 이게 바로 `passport`이다. 우선 설치해보자. `passport-local`은 이메일과 비밀번호 혹은 아이디랑 비밀번호로 로그인이 하도록 도와주는 라이브러리이다.

```bash
$ cd prepare/back
$ npm i passport passport-local
```

라이브러리를 설치했다면 해당 passport를 설정해주는 폴더가 추가되어야 한다.

`back/passport/index.js`

```jsx
const passport = require("passport");
const local = require("./local");

module.exports = () => {
  passport.serializeUser(() => {});

  passport.deserializeUser(() => {});

  local();
};
```

`back/passport/local.js`

```jsx
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // login 전략을 세운다.
          // 1. 이메일이 있는지 확인
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // done으로 성공여부의 결과를 판단해준다.(서버 에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }

          // 2. 비밀번호 확인
          const result = await bcrypt.compare(password, user.password);

          if (result) {
            // 3. 성공 처리
            return done(null, user);
          }

          // 4. 비밀번호 실패 여부 alert
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);

          // 5. 서버에러일 경우 첫번째 인자에 error를 넣어준다.
          return done(error);
        }
      }
    )
  );
};
```

먼저 실행 구조를 잘 이해해보자. 먼저 index.js에서 local 로그인 정책에 대한 정보는 local.js에서 가져온다. (만약 이후 카카오 로그인이나 페이스북 로그인이 생기면 KakaoStrategy, FacebookStrategy 등으로 추가될 것임) 해당 데이터를 받은 index.js는 중앙관리소 격인 app.js에서 호출되어진다.

local.js의 **done 메서드는 상황에 따라 달라지는 콜백함수와 비슷한 개념**이다. done의 인자로는 3가지가 있는데, (서버 에러, 성공, 클라이언트 에러)이다. 만약 서버 에러가 있을 경우 첫 번째 인자에 error가 들어가고, 성공 시 두 번째 인자에 true/false값, 그리고 세 번째엔 클라이언트 에러에 대한 사유가 데이터로 들어간다.

`back/app.js`

```jsx
const express = require("express");
const cors = require("cors");
const db = require("./models");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const passportConfig = require("./passport"); // 추가
const app = express();

db.sequelize
  .sync()
  .then(() => {})
  .catch(console.error);

passportConfig(); // 추가

// code...
```

이제 해당 내용을 가지고 user.js에 로그인 라우팅 처리를 추가해주자!

`back/routes/user.js`

```jsx
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const router = express.Router();

// POST /user/login
// 미들웨어 확장: req, res, next를 사용하기 위해 passport.authenticate 함수를 감싸준다.
router.post("/login", (req, res, next) => {
  // 하위 err, user, info는 done의 3가지 인자를 의미한다. (local.js)
  passport.authenticate("local", (err, user, info) => {
    // server error
    if (err) {
      console.err(err);
      return next(err); // status 500
    }
    // client error
    if (info) {
      return res.status(401).send(info.reason); // 401 허가되지 않음
    }
    // passport login
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // real login!!
      return res.json(user);
    });
  })(req, res, next);
});

router.post("/", async (req, res, next) => {
  /* code.. */
});

module.exports = router;
```

[HTTP 상태코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)는 엄청나게 다양하다. 우선 가장 거시적으로 200은 성공, 300은 캐시 혹은 리다이렉트, 400은 클라이언트 에러, 500은 서버에러로 나뉜다. 세부적인 사항도 모두 규정되어 있으나 세부적인 것은 개발자 간의 소통을 통해 합쳐서 쓰거나 나눠서 쓰는 행위가 허용된다. 나중에 시간될 때 한번씩 열어보자!
