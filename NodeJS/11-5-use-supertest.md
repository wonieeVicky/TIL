# supertest 사용 및 통합테스트 구현

### supertest 설치

supertest는 데이터 요청(request)에 대한 응답을 mocking 해주는 역할을 해주는 라이브러리이다. 테스트 과정에서 통신을 하다보면 데이터베이스가 올바르지 않게 될 수도 있기 때문이다.

```bash
npm i -D supertest
```

이후 테스트를 위해 로컬 데이터에 반영이 되면 안되므로 로컬 환경 실행에 대한 분기가 필요하므로 이를 위해 app.js와 package.json을 수정해준다.

`app.js`

```jsx
// ..
module.exports = app;

// 삭제
/* app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
}); */
```

`server.js` 생성

```jsx
const app = require("./app");

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

`package.json`

```json
{
  "name": "nodebird-test",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "nodemon server", // app에서 server로 수정
    "test": "jest",
    "coverage": "jest --coverage"
  }
}
```

### 테스트용 MySQL 생성

`nodebird-test/config/config.json`

```json
{
  "development": {
    // ...
  },
  "test": {
    "username": "root",
    "password": "1234",
    "database": "nodejs-nodebrid-test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false // 콘솔에 로깅 미출력 설정
  }
}
```

```bash
$ npx sequelize db:create --env test
Sequelize CLI [Node: 16.2.0, CLI: 5.5.1, ORM: 5.22.4]

Loaded configuration file "config/config.json".
Using environment "test".
Database nodejs-nodebrid-test created.
```

### auth routes 테스트 코드 작성

auth routes에서 실행될 수 있는 다양한 시나리오에 대해 테스트 코드를 작성한다.

```jsx
const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

// 테스트 전 sequelize table 생성 후 시작되도록 설정
beforeAll(async () => {
  await sequelize.sync();
});

// 로그인 안했으면 가입 테스트
describe("POST /join", () => {
  test("로그인 안 했으면 가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "fongfing@gmail.com",
        nick: "vicky",
        password: "1234"
      })
      .expect("Location", "/")
      .expect(302, done); // Promise - then구문 사용 시 반드시 마지막에 done을 넣어줘야 테스트가 완료된다.
  });
});

// 이미 로그인 한 뒤 로그인 or 가입 시도 테스트
describe("POST /login", () => {
  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "fongfing@gmail.com",
        password: "1234"
      })
      .end(done);
  });

  test("이미 로그인한 뒤 가입하면 redirect /에러", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "fongfing@gmail.com",
        nick: "zerocho",
        password: "1234"
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });

  test("이미 로그인했는데 다시 로그인하면 redirect /에러", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/login")
      .send({ email: "fongfing@gmail.com", password: "1234" })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

// 가입되지 않은 유저 로그인, 일반로그인, 비밀번호 틀린 유저 로그인 테스트
describe("POST /login", () => {
  test("가입되지 않은 회원", async (done) => {
    const message = encodeURIComponent("가입되지 않은 회원입니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "zerohch1@gmail.com",
        password: "1234"
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  test("로그인 수행", async (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "fongfing@gmail.com",
        password: "1234"
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  test("비밀번호 틀림", async (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");
    request(app)
      .post("/auth/login")
      .send({
        email: "fongfing@gmail.com",
        password: "wrong"
      })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });
});

// 로그아웃 테스트
describe("GET /logout", () => {
  test("로그인 되어있지 않으면 403", async (done) => {
    request(app).get("/auth/logout").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "fongfing@gmail.com",
        password: "1234"
      })
      .end(done);
  });

  test("로그아웃 수행", async (done) => {
    agent.get("/auth/logout").expect("Location", `/`).expect(302, done);
  });
});

// 테스트가 완료 된 후 DB 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
```

이후 테스트를 해보면 정상 수행되는 것을 확인할 수 있다.

```bash
$ npm run test

> nodebird-test@1.0.0 test
> jest

 PASS  controllers/user.test.js
  ● Console

    console.error controllers/user.js:13
      테스트용 에러

 PASS  models/user.test.js
 PASS  routes/middlewares.test.js
POST /auth/join 302 346.686 ms - 23
POST /auth/login 302 375.481 ms - 23
POST /auth/join 302 13.183 ms - 115
POST /auth/login 302 6.255 ms - 115
POST /auth/login 302 7.065 ms - 115
POST /auth/login 302 3.596 ms - 141
POST /auth/login 302 291.016 ms - 23
POST /auth/login 302 356.319 ms - 159
POST /auth/login 302 288.191 ms - 23
GET /auth/logout 403 4.509 ms - 16
POST /auth/login 302 5.311 ms - 115
GET /auth/logout 302 5.460 ms - 23
 PASS  routes/auth.test.js (5.712s)
  ● Console

    console.log app.js:29
      데이터베이스 연결 성공

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        8.974s
Ran all test suites.
```
