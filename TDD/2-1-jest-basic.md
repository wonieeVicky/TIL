## 개요

단순하고 가볍게 사용할 수 있는 자바스크립트 테스트 프레임워크

## 특징

- zero config
  - 별도의 설정 없이 바로 작업할 수 있도록 한다
- snapshots
  - 큰 객체로 테스트하는 것을 쉽게 만든다.
  - 스냅샷 또는 인라인에 저장 된 객체와 함께 테스트가 실행된다.
- isolated
  - 성능을 극대화하기 위해 테스트들은 각각의 프로세스에서 병렬 실행
- great api
  - it, expect와 같은 Framework, Assertion API를 모두 가지고 있다.

## 철학

- 자바스크립트 코드베이스의 정확성을 보장하기 위해 설계 된 testing Framework
- 접근성이 좋고 친숙하며 기능이 풍부한 API를 통해 결과를 빠르게 얻을 수 있다.
- document good, 설정이 거의 필요치 않으며 개발환경에 맞게 확장할 수 있다.

## 설치

```bash
$ npm install --D jest
```

## 실행

package.json에 스크립트 추가(`—verbose` 옵션 추가 시 상세 테스트 내역 확인 가능)

```json
{
  "scripts": {
    "test": "jest --verbose"
  }
}
```

`sum.js`

```jsx
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

sum.test.js

```jsx
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

command에 테스트 명령어 실행

```bash
$ npm run test

------------------------
PASS  ./sum.test.js
  ✓ adds 1 + 2 to equal 3 (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.619 s
Ran all test suites.
```
