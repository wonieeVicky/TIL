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
