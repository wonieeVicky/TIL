# 테스트 커버리지

### 테스트 커버리지란?

- 전체 코드(전체 테스트 코드) 중에서 테스트되고 있는 코드의 비율
  - 테스트되지 않는 코드의 위치도 알려준다.
  - jest -coverage
  - Stmts: 구문
  - Branch: 분기점
  - Funcs: 함수
  - Lines: 줄수
- `package.json`

  ```json
  {
    "name": "nodebird-test",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "start": "nodemon app",
      "test": "jest",
      "coverage": "jest --coverage" // 추가
    }
  }
  ```

  ```bash
  $ npm run coverage

  > nodebird-test@1.0.0 coverage
  > jest --coverage

   PASS  routes/middlewares.test.js
   PASS  controllers/user.test.js
    ● Console

      console.error controllers/user.js:13
        테스트용 에러

  -----------------|----------|----------|----------|----------|-------------------|
  File             |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
  -----------------|----------|----------|----------|----------|-------------------|
  All files        |       84 |      100 |       60 |       84 |                   |
   controllers     |      100 |      100 |      100 |      100 |                   |
    user.js        |      100 |      100 |      100 |      100 |                   |
   models          |    33.33 |      100 |        0 |    33.33 |                   |
    user.js        |    33.33 |      100 |        0 |    33.33 |        5,44,45,50 |
   routes          |      100 |      100 |      100 |      100 |                   |
    middlewares.js |      100 |      100 |      100 |      100 |                   |
  -----------------|----------|----------|----------|----------|-------------------|

  Test Suites: 2 passed, 2 total
  Tests:       7 passed, 7 total
  Snapshots:   0 total
  Time:        4.929s
  Ran all test suites.
  ```

  - models/user.js가 테스트 커버리지에 포함된 이유는 `controllers/user.js`에서 model/user를 import했기 때문이다.

### user model 테스트 코드 작성하기

`models/user.test.js`

테스트 시 config.json 데이터에 test용 데이터베이스를 사용한다.

```jsx
const Sequelize = require("sequelize");
const User = require("./user");
const config = require("../config/config.json")["test"];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

describe("User 모델", () => {
  test("static init 메서드 호출", () => {
    expect(User.init(sequelize)).toBe(User);
  });
  test("static associate 메서드 호출", () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn()
      },
      Post: {}
    };
    User.associate(db);
    expect(db.User.hasMany).toBeCalledWith(db.Post);
    expect(db.User.belongsToMany).toBeCalledTimes(2);
  });
});
```

model/user에 대한 테스트 코드 작성이 완료된 후 테스트 커버리지를 다시 확인해보면 아래와 같이 나옴

```bash
$ npm run coverage

> nodebird-test@1.0.0 coverage
> jest --coverage

 PASS  routes/middlewares.test.js
 PASS  controllers/user.test.js
  ● Console

    console.error controllers/user.js:13
      테스트용 에러

 PASS  models/user.test.js
-----------------|----------|----------|----------|----------|-------------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------|----------|----------|----------|----------|-------------------|
All files        |      100 |      100 |      100 |      100 |                   |
 controllers     |      100 |      100 |      100 |      100 |                   |
  user.js        |      100 |      100 |      100 |      100 |                   |
 models          |      100 |      100 |      100 |      100 |                   |
  user.js        |      100 |      100 |      100 |      100 |                   |
 routes          |      100 |      100 |      100 |      100 |                   |
  middlewares.js |      100 |      100 |      100 |      100 |                   |
-----------------|----------|----------|----------|----------|-------------------|

Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        7.134s
Ran all test suites.
```

테스트 코드가 완벽하다고 해서 실제 서비스에서 에러가 발생하지 않는 것은 아니므로, 테스트 커버리지를 100%로 맞추기 위해 테스트 코드 작성에 불필요한 노력을 들이지 말 것. 굳이 확인하지 않아도 되는 것은 넘어가고, 오류 발생 시 해당 버그가 다시는 발생하지 않도록 방지하는 개념으로 테스트 코드를 보강해주어야 한다.
