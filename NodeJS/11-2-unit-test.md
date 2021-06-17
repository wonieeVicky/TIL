# 단위 테스트 구현

### 미들웨어 단위(Unit) 테스트

테스트의 역할은 코드나 함수가 제대로 실행되고 예상한 결과와 일치하는지 검사하는 개념이며,
이 중에서도 단위 테스트는 작은 단위의 함수나 모듈이 의도대로 정확하게 동작하는지 확인하는 것이다.

`routes/middleware.test.js`

```jsx
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

describe("isLoggedIn", () => {
  // req, res, next 함수 mocking - jest.fn() 활용
  const res = {
    status: jest.fn(() => res),
    send: jest.fn()
  };
  const next = jest.fn();
  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    };
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
  };
  const next = jest.fn();
  test("로그인되어 있지 않으면 isLoggedIn이 next를 호출해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false)
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true)
    };
    const message = encodeURIComponent("로그인한 상태입니다.");
    isNotLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
});
```

테스트 코드의 객체 혹은 함수가 실제 익스프레스의 객체 혹은 함수와 꼭 같지 않아도 된다. 따라서 비슷하게 동작하는 가짜 함수를 넣는 행위를 Mocking이라고 하며 test에 필요한 req, res, next를 `jest.fn()`메서드를 사용해 구현해준다.

`toBeCalledTimes(숫자)`는 정확하게 몇 번 호출되었는지 체크하는 메서드

`toBeCalledWith(인수)`는 특정 인수와 함께 호출되었는지를 체크하는 메서드
