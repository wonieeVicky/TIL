# 컨트롤러 분리 및 테스트

### routes 함수에서 컨트롤러 분리하기

이전 시간에 middleware 함수들을 테스트해봤다. 이제 실제 route부분도 테스트를 해줘야하는데, 기존의 routes 함수들은 middleware처럼 별도의 함수로 분리되어있는 구조가 아님. 따라서 테스트를 위해 컨트롤러 영역의 코드를 controllers에 분리해주는 것이 좋다.

`routes/user.js`

```jsx
const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

// async/await으로 연결된 컨트롤러를 분리
router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
```

`controllers/user.js` 생성

```jsx
const User = require("../models/user");

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
```

### 분리한 controller에 대한 테스트 코드 작성

`controllers/user.test.js`

```jsx
jest.mock("../models/user"); // user model mocking: 모듈 경로를 인수로 넣는다.
const User = require("../models/user");
const { addFollowing } = require("./user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 }
  };
  const res = {
    send: jest.fn(),
    status: jest.fn(() => res),
    send: jest.fn()
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 한다.", async () => {
    // 모킹할 메서드에 mockReturnValue라는 메서드를 이용해 더미데이터를 반환해준다.
    User.findOne.mockReturnValue(
      Promise.resolve({
        id: 1,
        name: "vicky",
        addFollowing(value) {
          return Promise.resolve(true);
        }
      })
    );
    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출해야 한다.", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));
    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });
  test("DB에서 에러가 발생하면 next(error)를 호출해야 한다.", async () => {
    const error = "테스트용 에러";
    User.findOne.mockReturnValue(Promise.reject(error));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});
```

컨트롤러 영역을 테스트 하는 과정에서 데이터베이스 모델 User가 필요한데, 이 부분에 대한 데이터를 테스트 과정에서 불러올 수 없으므로 `jest.mock` 메서드를 사용해 데이터베이스 mocking을 해준다. 먼저 필요한 데이터를 jesk.mock()함수로 호출 후 모킹할 메서드에 `mockReturnValue` 메서드로 더미데이터를 반환해준다.
