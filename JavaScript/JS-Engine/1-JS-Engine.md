## 인간 JS 엔진되기

---

**[인간 JS 엔진되기](https://www.youtube.com/playlist?list=PLcqDmjxt30Rt9wmSlw1u6sBYr-aZmpNB3)**

- JS Core 기능을 직접 다뤄보면서, 놓쳤던 것들 다시 챙기기

---

### 함수와 함수의 호출

```jsx
// 함수의 선언
const add = (a, b) => a + b;
function calculator(func, a, b) {
  return func(a, b);
}

// 함수의 호출
add(3, 5); // 8
calculator(add, 3, 5); // 8
```

위처럼 함수의 선언과 호출을 나눠 사용할 수 있다.
calculator 함수의 경우 함수를 인자로 넘겨주어서 함수를 실행시켜줄 수 있다.

### 고차함수

아래와 같이 onClick 이란 고차함수가 있을 떄 e 매개변수는 어디에 위치시켜야할까?

```jsx
const onClick = () => () => console.log("hello");
document.querySelector("#header").addEventListener("click", onClick(e));

// 무엇이 정답?
// const onClick = (e) => () => console.log("hello");
// const onClick = () => (e) => console.log("hello");
```

위와 같이 고차함수를 매개변수로 넘겨줄 때 1. 함수의 호출부를 넣어야하는지, 선언부를 넣어야하는지, 2. 인자값 데이터를 어디에 넣어줘야하는지 궁금하다면 간단히 리턴값으로 대체해서 확인해볼 수 있다.

```jsx
// 만약 첫 번째 순서에 e가 들어간다면
const onClick = (e) => () => console.log("hello");
// 리턴값으로 값을 대체했을 때 아래와 같다.
document.querySelector("#header").addEventListener("click", () => console.log("hello"));
```

위와 같이 리턴값 어디에도 e 인자가 전달되는 부분이 없음. 따라서 아래와 같이 바꿔준다.

```jsx
// 만약 두 번째 순서에 e가 들어간다면
const onClick = () => (e) => console.log("hello");
// 리턴값으로 값을 대체했을 때 아래와 같다.
document.querySelector("#header").addEventListener("click", (e) => console.log("hello"));
```

위와 같이 e를 두 번째 순서에 위치시키면 적절하게 리턴값에 e 인자가 들어간 것을 확인할 수 있음
위처럼 함수의 선언과 호출, 그리고 고차함수에 대한 정확한 이해는 기본적이고 중요한 부분임

---

### 호출 스택 분석

`callstack.js`

```jsx
const x = "x";
function c() {
  const y = "y";
  console.log("c");
}

function a() {
  const x = "x";
  console.log("a");
  function b() {
    const z = "z";
    console.log("b");
    c();
  }
  b();
}

a();
c();

// a
// b
// c
// c
```

위 함수를 보고 코드를 실행해보기 전에 기본적으로 어떤 결과로 실행될지를 알아야 한다.
함수에서 각 접근 가능한 변수들도 미리 알 수 있어야 한다.

자바스크립트 코드는 기본적으로 왼쪽에서 오른쪽으로, 위에서부터 아래로 흐른다.
또한 스택 구조로 코드 수행 순서가 담긴다는 것을 잊지말자. (위 구조가 스택 구조로 읽히는지 확인)

```
a > log(즉시 실행 후 삭제) > b > log(즉시 실행 후 삭제) > c > log
```

즉, c 함수 종료 후 b 함수 종료, 마지막으로 a 함수가 종료되는 스택 구조
위 코드의 호출 순서를 코드 실행 시 확인 할 수 있다. `debugger` 라는 메서드를 실행시키면 됨.

`callstack.js`

```jsx
const x = "x";
function c() {
  const y = "y";
  console.log("c");
  debugger; // 여기 추가
}

function a() {
  // ..
}

a();
c();
```

![개발자 도구에서 Call Stack을 확인할 수 있다.](../../img/221105-1.png)

개발자 도구를 확인하면 콜스택 뿐만 아니라 Scope까지 모두 확인할 수 있다.
anonymous는 뭘까? 헷갈린다면, 파일가 초기 실행되는 것을 anonymous라는 함수라고 생각하면 된다.
