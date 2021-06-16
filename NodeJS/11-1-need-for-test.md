# 테스트를 하는 이유

### 테스트는 왜 할까

- 자신이 만든 서비스가 제대로 동작하는지 테스트해야 한다.
  - 기능이 많다면 수작업으로 테스트하기 힘듦
  - 프로그램이 프로그램을 테스트할 수 있도록 자동화함
  - 테스트 환경을 최대한 실제 환경과 비슷하게 흉내냄
  - 아무리 철저하게 테스트를 해도 에러를 완전히 막을 수는 없다.
- 그럼에도 불구하고 테스트를 하면 좋은 점
  - 허무한 에러로 인해 프로그램이 고장나는 것은 막을 수 있다.
  - 한 번 발생한 에러는 테스트로 만들어두면 같은 에러가 발생하지 않도록 막을 수 있음
  - 코드를 수정할 때 프로그램이 자동으로 어떤 부분이 고장나는 지 알려준다.

### Jest 설치하기

- `npm i -D jest`
- `nodebird-test/package.json`

  ```json
  {
    "name": "nodebird-test",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "start": "nodemon app",
      "test": "jest"
    }
    // ...
  }
  ```

### 테스트 실행해보기

- routes 폴더 안에 `middlewares.test.js`작성

  - 테스트용 파일은 파일명에 `test`나 `spec`이 있으면 된다.
  - `npm test`를 실행하면 test나 spec 파일들을 찾아서 테스트한다.
  - 테스트를 아무것도 작성하지 않았으므로 처음에는 에러가 발생한다. (테스트 실패)
    또 어떤 부분에서 테스트가 실패했는지 알려주므로 매우 좋다.

        ```bash
        $ npm test

        > nodebird-test@1.0.0 test
        > jest

         FAIL  routes/middlewares.test.js
          ● Test suite failed to run

            Your test suite must contain at least one test.

              at node_modules/@jest/core/build/TestScheduler.js:242:24
              at asyncGeneratorStep (node_modules/@jest/core/build/TestScheduler.js:131:24)
              at _next (node_modules/@jest/core/build/TestScheduler.js:151:9)
              at node_modules/@jest/core/build/TestScheduler.js:156:7
              at node_modules/@jest/core/build/TestScheduler.js:148:12
              at onResult (node_modules/@jest/core/build/TestScheduler.js:271:25)

        Test Suites: 1 failed, 1 total
        Tests:       0 total
        Snapshots:   0 total
        Time:        2.032s
        Ran all test suites.
        ```

  - `middlewares.test.js`에 간단한 테스트 코드를 작성한 뒤 실행

    ```jsx
    test("1+1은 2이다", () => {
      expect(1 + 1).toEqual(2);
    });
    ```

    ```bash
    $ npm test

    > nodebird-test@1.0.0 test
    > jest

     PASS  routes/middlewares.test.js
      ✓ 1+1은 2이다 (3ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        2.619s
    Ran all test suites.
    ```

    만약 테스트에 실패하면 실패 이유를 함께 로깅해준다.

    ```jsx
    test("1+1은 2이다", () => {
      expect(1 + 1).toEqual(3);
    });
    ```

    ```bash
    $ npm test

    > nodebird-test@1.0.0 test
    > jest

     FAIL  routes/middlewares.test.js
      ✕ 1+1은 2이다 (5ms)

      ● 1+1은 2이다

        expect(received).toEqual(expected) // deep equality

        Expected: 3
        Received: 2

          1 | test("1+1은 2이다", () => {
        > 2 |   expect(1 + 1).toEqual(3);
            |                 ^
          3 | });
          4 |

          at Object.<anonymous> (routes/middlewares.test.js:2:17)

    Test Suites: 1 failed, 1 total
    Tests:       1 failed, 1 total
    Snapshots:   0 total
    Time:        1.942s, estimated 2s
    Ran all test suites.
    ```
