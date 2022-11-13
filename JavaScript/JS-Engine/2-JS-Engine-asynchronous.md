## 인간 JS 엔진되기(비동기)

---

**[인간 JS 엔진되기](https://www.youtube.com/playlist?list=PLcqDmjxt30Rt9wmSlw1u6sBYr-aZmpNB3)**

- JS Core 기능을 직접 다뤄보면서, 놓쳤던 것들 다시 챙기기

---

### 프로미스의 좋은 점

자바스크립트의 비동기 개념이 들어오면 동작 과정을 이해하는 것이 어려워진다.
프로미스는 실행 후 결괏값을 나중에 쓸 수 있는 기능이다.

```jsx
function calculator(callback, a, b) {
  return callback(a, b);
}

calculator(
  function (x, y) {
    return x + y;
  },
  3,
  5
);
```

위 함수는 일반 동기 함수이다. callback 함수도 동기 함수이다. 인자가 전달되는 즉시 실행되기 때문임

```jsx
setTimeout(() => {
  console.log("a"); // () => { console.log('a'); } 이 부분은 콜백함수임
}, 1000);
```

반면 위 setTimeout 함수는 비동기 함수이다.

```jsx
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log("a");
  }, 1000);
});

// another codes..
promise.then(() => {
  console.log("go");
});
```

프로미스의 가장 핵심 기능은 원하는 시점에 기능을 수행할 수 있다는 점이다.

만약 api 를 치는 로직이 다양하게 존재한다고 했을 때

```jsx
axios.get("서버주소1", function (data1) {
  axios.get("서버주소2", function (data2) {
    axios.get("서버주소3", function (data3) {
      //..
    });
  });
});
```

응답에 대한 처리 로직을 기존에는 위와 같이 구현한다고 한다면, 프로미스를 활용하면 아래와 같이 구현할 수 있다.

```jsx
const p1 = axios.get("서버주소1");
const p2 = axios.get("서버주소1");
const p3 = axios.get("서버주소1");
const p4 = axios.get("서버주소1");

Promise.all([p1, p2, p3, p4])
  .then((result) => {})
  .catch((err) => {});
Promise.allSettled([p1, p2, p3, p4])
  .then((result) => {})
  .catch((err) => {});
```

프로미스의 장점은 위와같이 처리하여 콜백지옥을 벗어날 수 있게 한다.
또한, catch문은 `Promise.all` 까지만이 아닌 `Promise.all().then()`까지 에러를 잡아낸다.

### 비동기는 동시가 아님. 순서의 문제이다.

비동기는 동시의 개념이 아니다. 동시에 2-3개가 돌아간다. 라는 개념으로 이해하기 보다는 순서로 이해하는 것이 옳다. 모든 코드는 위에서 아래로 흐르고 왼쪽에서 오른쪽으로 실행된다. 동기코드는 이 흐름을 그대로 따르며, 비동기 코드는 코드 순서와 실제 실행순서가 다르다는 점이 가장 핵심 포인트이다.

한번 비동기는 영원한 비동기 코드이다. 비동기 코드를 동기 코드로 바꿀 수 없다.

(비동기 함수인지 알 수 있는 방법은 문서를 보는 방법 밖에 없다. 비동기 함수 중 promise로 반환되는 지 등등은 문서로 확인한다.)

`async.js`

```jsx
setTimeout(() => {
  console.log("a");
}, 0);
setTimeout(() => {
  console.log("b");
}, 1000);
setTimeout(() => {
  console.log("c");
}, 2000);

// a
// b - 1초 뒤
// c - 2초 뒤
```

위와 같은 비동기 코드가 있다고 하자. 위 함수의 실행 콜스택은 아래와 같다.

anonymous → setTimeout(a) → setTimeout(b) → setTimeout(c)

그럼 실제 콘솔을 출력하는 콜백함수들은 어디에 작성할 수 있을까?
이는 이벤트 루프 영역에 그릴 수 있다.

```jsx
	 ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

이벤트 루프는 실제 위와 같은 phase 단계를 거쳐서 실행된다.
위 과정을 간략하게 단계별로 담아놓는 이벤트 큐 영역으로 추상화해보면 아래와 같다.

T-fn(0) → T-fn(1000) → T-fn(2000) (T는 setTimeout의 줄임말)

위 이벤트 큐 영역에는 setTimeout, ajax, tick, eventListener, nextTick 등이 속할 수 있다. (동시성을 지원함)
위 이벤트 큐 영역이 실행되기 위해서는 콜 스택으로 옮겨져야 하며 해당 코드가 실행되도록 옮겨지기 위해서는 테스크 큐(매크로/마이크로 큐)에서 담겨 이벤트 루프에 의해 콜 스택으로 옮겨진다. (콜 스택이 비어져있을 때 하나씩 올려줌)

비동기는 순서의 문제이므로 위 과정을 하나씩 대입해 그릴 수 있다면 비동기 함수 또한, 동기 함수처럼 파악할 수 있게 된다.
