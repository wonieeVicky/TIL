const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn()
  }; // res 가짜함수 생성
  const next = jest.fn(); // next 가짜함수 생성
  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    }; // req 가짜함수 생성
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    redirect: jest.fn()
  }; // res 가짜함수 생성
  const next = jest.fn(); // next 가짜함수 생성
  test("로그인되어 있지 않으면 isLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    }; // req 가짜함수 생성
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    }; // req 가짜함수 생성
    const message = encodeURIComponent("로그인한 상태입니다.");
    isNotLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
});
