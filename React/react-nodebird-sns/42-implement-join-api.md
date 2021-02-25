# 회원가입 API 구현

이제부터는 터미널을 두 개를 사용해서 작업해야 한다.  
이렇게 하면 실제 브라우저(클라이언트)와 프론트 서버(터미널), 백엔드 서버(터미널), 데이터베이스(MySQL) 4개의 주체가 있는 상태로 작업하게 된다. 구성 요소가 4개이므로 헷갈리는 점이 많으니 천천히 작업해보자

```
브라우저(3026) - 프론트 서버(Next)(3026) - 백엔드 서버(express)(3065) - MySQL(3306)
```

포트 하나가 프로그램 하나라고 생각하면 된다. 즉 브라우저와 프론트는 하나의 프로그램을 사용하고, 백엔드와 데이터베이스는 각기 다른 프로그램을 사용한다. 이제 회원가입을 구현해보자 : )

`signup.js`에서 onSubmit이벤트로 SIGN_UP_REQUEST 액션이 dispatch 된다. 이 구조는 redux 미들웨어인 saga에서 api를 호출시킨다. 기존까지 delay메서드로 만들어왔던 기능을 직접 구현해보자

`front/sagas/user.js`

```jsx
function signUpAPI(data) {
  // data에는 { email, nickname, password } 객체 값이 들어있다.
  return axios.post("http://localhost:3065/user", data); // 실제 백엔드 주소를 넣어준다.
}
function* signUp(action) {
  try {
    // 기존의 delay 함수를 삭제하고 call메서드로 api 동작함수를 실행시킨다.
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}
```

위와 같이 프론트에서 api를 치는 동작을 만들었다. signUp함수에 들어오는 action.data에 유저가 넣은 email, password, nickname 데이터가 포함되고 해당 데이터를 req.body 정보에 함께 넣어서 보내준다.

이제 백엔드에서 해당 API 호출에 대한 라우팅이 필요하다!  
먼저 라우팅을 분기하는 제일 최상단 지점인 back/app.js에서 `userRouter`를 넣어준다. (일단 넣은 후 생성!)
또, 프론트에서 보내는 정보를 req.body로 받기 위한 설정 두가지를 함께 추가해준다!  
(express.json(), express.urlencoded({ extended: true })

```jsx
const express = require("express");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user"); // 추가!
const db = require("./models");
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

// 하위 두 개는 프론트에서 보내는 정보를 req.body로 넣어주기 위한 설정이다.
// 반드시 위치는 라우터 위에 존재해야 한다!!
app.use(express.json()); // Front에서 보낸 Json 데이터를 req.body에 추가
app.use(express.urlencoded({ extended: true })); // 2. Front에서 보낸 form.submit 데이터를 req.body에 추가

app.use("/post", postRouter);
app.use("/user", userRouter); // 추가 !

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
```

위와 같이 userRouter를 임포트하고, app.use 메서드로 호출해준다. 이후 자세한 userRouter를 설정한다.

```jsx
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // db.User를 가져옴
const router = express.Router();

// 1. POST /user/
router.post("/", async (req, res, next) => {
  try {
    // 5. 중복 아이디 체크: 중복된 아이디가 있으면 데이터가 있고, 아니면 null로 반환
    const exUser = await User.findOne({
      where: {
        // 조건
        email: req.body.email,
      },
    });

    // 6. 중복 아이디일 경우 return으로 403 응답 후 종료 처리
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다."); // saga의 error.response.data에 text가 담김
    }

    // 3. 보안설정 필요!
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // 2. async ~ await: req.body에 saga에서 axios로 보냈던 acion.data값이 들어있다.
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    res.status(201).send("ok"); // or res.json();
  } catch (error) {
    console.error(error);
    next(error); // 4. error 처리
  }
});

module.exports = router;
```

1. Post /user/ api 생성: front saga의 `axios.post("http://localhost:3065/user", data);` 와 연결된다.
2. Javascript의 비동기성으로 인해 데이터를 추가할 때에는 반드시 async ~ await 구문을 넣어야 안전하게 데이터가 추가된다. 또한 req.body에 saga에서 axios로 보낸 action.data가 들어있어서 해당 값을 넣어준다.
3. 비밀번호의 경우 보안문제로 인해 반드시 암호화하여 저장해야 한다. 이럴 때 비밀번호를 암호화해주는 라이브러리를 주로 사용하는데, bcrypt 라이브러리를 설치해주자!

   ```bash
   $ npm i bcrypt
   ```

4. 에러 발생 시 next메서드를 사용해서 error를 넣어주면 front에서 api error 발생 시 에러에 대한 정보를 바로 전달하여 빠르게 처리할 수 있다. status 500 에러를 발생시킨다.
5. 회원가입 처리 전에 중복 아이디 체크를 진행한다. User.findOne 또한 async-await을 넣어줘야 한다. 비동기인지 아닌지는 함수별로 공식 문서에서 확인하여 맞는 사용법으로 쓰도록 한다. findOne 메서드 안에는 where 데이터가 들어가는데 중복 아이디를 체크하는 조건을 넣어준다. 이렇게 체크하여 만약 중복된 데이터가 있으면 값을 내려주고, 중복 데이터가 없다면 null을 반환한다.
6. 중복 아이디일 경우 return으로 403 응답 후 종료 처리를 한다. send메서드 안에는 고객에게 전달할 에러 메시지를 넣을 수 있다.

- _만약 res.send가 두 번 실행될 경우 ?_
- _요청/응답은 Header(상태, 용량, 시간, 쿠키)와 Body(데이터)로 구성되어 있다. 상태의 상세 설명.._
