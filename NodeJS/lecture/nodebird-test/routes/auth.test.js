const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

beforeAll(async () => {
  await sequelize.sync(); // table이 생성된 상태로 시작
});

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
      .expect(302, done);
  });
});

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

afterAll(async () => {
  await sequelize.sync({ force: true });
});
