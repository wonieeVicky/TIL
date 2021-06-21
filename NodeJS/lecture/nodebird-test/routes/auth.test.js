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
  test("로그인 수행", async (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "fongfing@gmail.com",
        password: "1234"
      })
      .expect("Location", "/")
      .expect(302, done); // done을 넣어줘야 테스트가 완료된다.
  });
});

// describe("POST /logout", () => {});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
