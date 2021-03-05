# 4. exports와 this

## 4-1. **filename, **dirname

노드에서는 **filename, **dirname 으로 내부 파일 시스템에 접근할 수 있다.

- \_\_filename: 현재 파일 경로
- \_\_dirname: 현재 폴더(디렉토리) 경로

```bash
$ node filename.js
C:\Users\study\TIL\NodeJS\filename.js
C:\Users\study\TIL\NodeJS
```

## 4-2. module, exports

module.exports 외에도 exports로 모듈을 만들 수 있다.

```jsx
const odd = "홀수입니다";
const even = "짝수입니다";

// 기존 방법
// module.exports = { odd, event }

exports.odd = odd;
exports.event = even;
```

위와같이 바꾼 후 `$ node filename` 실행하면 동일하게 동작한다. 동일하게 동작하는 이유는 **module.exports와 exports가 참조 관계**이기 때문이다. exports에 객체의 속성이 아닌 다른 값을 대입하면 참조 관계가 깨진다.

- exports와 module.exports의 관계

  exports ⇒ 참조 ⇒ module.exports ⇒ 참조 ⇒ {}

단, 함수를 내보낼 경우에는 객체 값으로 넣어줄 수 없다.
module.exports와 exports가 참조 관계가 아니기 때문이다.

```jsx
// module.exports = { funcCheck }
module.exports = funcCheck;
```

한가지만 모듈로 빼고 싶을 때에는 module.exports 방법을 사용하고, 여러가지를 모듈로 빼고 싶을 때에는 `exports.moduleName` 방법이나 `module.exports = { moduleName }` 으로 사용한다.!

## 4-3. this

노드에서 this를 사용할 때 주의점이 있다.

- 최상위 스코프의 this는 module.exports, 즉 {} 를 가리킨다.
- 함수 선언문 내부의 this는 `global(전역)` 객체를 가리킴
- 그 외에는 브라우저의 자바스크립트와 동일함

```jsx
console.log(this); // {}
console.log(this === module.exports); // true
console.log(this === exports); // true

function whatIsThis() {
  console.log("function: ", this === exports, this === global); // false, true
}

whatIsThis();
```
