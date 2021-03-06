# 5. 모듈 심화와 순환 참조

## 5-1. 모듈 심화 - require

- require가 제일 위에 올 필요는 없다. (import는 가장 위에 있어야 한다.)
- `require.cache`에 한 번 require한 모듈에 대한 캐싱 정보가 들어있음
  - 처음 파일을 불러온 이후에는 실제 파일을 읽지않고 메모리에 캐싱된 파일을 가져와서 쓴다.
  - 원래 하드디스크에서 불러오는 것은 느리고 메모리에서 불러오는 것은 빠르다.
  - 캐시를 초기화 할 수도 있으나 잘 사용하지 않는다.
- `require.main`은 노드 실행 시 첫 모듈을 가리킴(내가 실행한 모듈)

  ⇒ require.main으로 어떤 파일을 실행한건지 알아낼 수 있다.

```jsx
// require.js
console.log("require가 가장 위에 오지 않아도 된다.");

module.exports = "나를 찾아봐";
require("./var"); // 다른 파일을 실행만 하고 싶을 경우 require만 써도 된다.
console.log(require);

console.log("require.cache이다");
console.log(require.cache);
console.log("require.main이다");
console.log(require.main === module);
console.log(require.main.filename);
```

## 5-2. 순환참조

두 개의 모듈이 서로를 require하는 상황을 조심해야 한다.

- Dep1의 module.exports가 함수가 아니라 빈 객체가 된다. (무한 반복을 막기 위해 의도됨)
- 순환참조하는 상황이 나오지 않도록 하는게 좋다.
- Dep1이 Dep2를 require하고, Dep2가 Dep1을 require함

```jsx
// Dep1.js
const dep2 = require("./Dep2");
console.log("require Dep2", dep2);
module.exports = () => {
  console.log("Dep2", Dep2);
};
```

```jsx
// Dep2.js
const dep1 = require("./Dep1");
console.log("require Dep1", dep1);
module.exports = () => {
  console.log("Dep1", Dep1);
};
```

```jsx
// Dep-run.js
const dep1 = require("./Dep1");
const dep2 = require("./Dep2");

dep1();
dep2();
```

```bash
$ node Dep-run
require Dep1 {}
require Dep2 [Function (anonymous)]
Dep2 [Function (anonymous)]
Dep1 {}
```
