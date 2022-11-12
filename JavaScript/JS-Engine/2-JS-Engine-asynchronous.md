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
