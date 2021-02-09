## 3) var, const, let

## 3-1. const, let

- ES2015 이전에는 var로 변수를 선언

  - ES2015부터는 const와 let이 대체
  - 가장 큰 차이점: 블록 스코프(var는 함수 스코프)

  ```jsx
  if (true) {
    var x = 3;
  }
  console.log(x); // 3

  if (true) {
    const y = 3;
  }
  console.log(y); // Uncaught ReferenceError: y is not defined

  // 함수 안에 variable 변수를 넣어주면 별도의 스코프를 가진다.
  function test() {
    var a = 1;
  }
  console.log(a); // Uncaught ReferenceError: a is not defined
  ```

- 기존: 함수 스코프(function(){}이 스코프의 기준점)
  - 다른 언어와는 달리 if나 for, while은 영향을 미치지 못함
  - const와 let은 함수 및 블록({})에도 별도의 스코프를 가진다.
