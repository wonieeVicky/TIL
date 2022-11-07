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

### 스코프 체인

호출 스택은 흐름만 이해하면 그 순서가 머리에 자연스럽게 그려지게 될 것이다.
이번에는 스코프 체인에 대해서도 알아보자. 스코프 체인은 함수가 어디까지 접근이 가능한지를 나타내는 단어이다.

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
  b(); // 1 - b 함수 실행
}

a();
c();
```

1번 영역에서 b 함수가 실행되는 것은 스코프 체인에 의한 것이다. 같은 함수 a 내부에 b 함수 블럭의 본문이 존재하기 때문이다. 만약 위 코드가 아래와 같다면 어떨까?

```jsx
const x = "x";
function c() {
  const y = "y";
  console.log("c");
  function b() {
    const z = "z";
    console.log("b");
    c();
  }
}

function a() {
  const x = "x";
  console.log("a");
  b(); // 1 - b is not defined
}

a();
c();
```

a 함수에서 b함수가 실행되는데, 정상적으로 실행될까?
같은 블럭에 존재하지 않으므로 b 함수가 정의되지 않았다는 에러가 발생한다.
b 함수의 선언이 c 함수 내부에 있기 때문이다. 이것이 바로 lexical scope이며, 스코프 체인 이슈이다.
anonymous 함수 내 c 함수 존재(내부에 b 함수 존재) 즉 b → c → anonymous의 구조라고 할 수 있다.

스코프 체인이 중요한 이유는 무엇일까? 함수가 어디까지 접근 가능한지를 파악하기 위해서는 각 함수 간의 관계를 파악하는 것이 필수이기 때문이다.

만약 b 함수 내부에서 a 함수를 실행시킨다면 정상적으로 동작할까?

```jsx
const x = "x";
function c() {
  const y = "y";
  console.log("c");
  function b() {
    const z = "z";
    console.log("b");
    a(); // 1 - 정상 동작
  }
}

function a() {
  const x = "x";
  console.log("a");
}

a();
c();
```

정상적으로 동작한다. anonymous가 a 함수를 가지고 있기 때문이다.
b함수는 anonymous가 아니라, c 함수 내부에 존재하므로 에러가 발생했음

이렇게 선언 간의 지도가 머릿 속에 자연스럽게 그려지는지 확인해본다.

```jsx
const x = "x1";
function c() {
  // ..
}

function a() {
  const x = "x2";
  console.log("a");
  console.log(x); // x2
}

a();
```

위와 같은 코드가 있을 때, x의 값이 x2로 담기는 것도 스코프 체인의 개념으로 볼 수 있다.
a 함수 블럭 내에 x의 값이 선언되어 있기 때문임. 만약 a 함수 내부에 x 에 대한 선언이 없을 경우 x1이 로그에 찍힐 것이다.

이는 스코프 체인이 아닌, 호이스팅에 의한 것이다.
