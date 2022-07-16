## 비동기

### 자바스크립트 비동기 처리의 이해와 사용 패턴 정리

Svelte의 비동기 블록을 알아보기 전에 자바스크립트에서의 비동기 처리에 대한 여러 패턴을 확인해보자.

```jsx
function a() {
  console.log("a");
}
function b() {
  console.log("b");
}

a();
b();
```

위 코드에서 a함수와 b함수는 모두 동기 함수 즉, 순서대로 실행되는 함수이다.
따라서 해당 함수를 실행시키면 a, b가 순차적으로 로그에 찍히는 것을 확인할 수 있다.

여기에 비동기적인 코드를 추가해보자

```jsx
function a() {
  setTimeout(() => {
    console.log("a");
  }, 1000);
}
function b() {
  console.log("b");
}

a();
b();
```

위와 같이 setTimeout 메서드로 시간 지연을 주면 a, b 함수를 순서대로 실행시켜도 b 이후 a가 로그에 기록되는 것을 확인할 수 있다. 만약 이러한 상황에서 a가 먼저 나오고 이후에 b가 나오도록 하려면 어떻게 해야하는가?

간단히 콜백함수로 처리하면 가능하다!

```jsx
function a(callback) {
  setTimeout(() => {
    console.log("a");
    callback();
  }, 1000);
}
function b() {
  console.log("b");
}

a(() => b());
```

위처럼 익명 callback 함수로 b를 실행하는 함수를 인자로 전달받도록 하면 a 로그 확인 후 b가 로그에 찍히는 것을 확인할 수 있다.

위 패턴은 콜백지옥을 만들 수 있는 패턴이다. 바로 아래처럼 말이다.

```jsx
function a(cb) {
  setTimeout(() => {
    console.log("a");
    cb();
  }, 1000);
}
function b(cb) {
  setTimeout(() => {
    console.log("b");
    cb();
  }, 1000);
}
function c(cb) {
  setTimeout(() => {
    console.log("c");
    cb();
  }, 1000);
}
function d(cb) {
  setTimeout(() => {
    console.log("d");
    cb();
  }, 1000);
}
a(() => {
  b(() => {
    c(() => {
      d(() => {
        console.log("done!");
      });
    });
  });
});
```

순차적인 함수 처리를 보장하기 위해 위처럼 콜백지옥의 구조를 생성해내므로 문제가 있다. 이는 복잡도가 너무 높다. 이를 개선하기 위해서 Promise 구문을 활용할 수 있다. Promise 내부의 resolve를 통해서 언제 다음 함수를 실행시켜줄지 결정할 수 있다.

```jsx
function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("a");
      resolve();
    }, 1000);
  });
}
function b() {
  console.log("b");
}
a().then(() => b());
```

위처럼 구현하면 기본적인 a→b 로직 실행을 보장할 수 있게 된다.
이를 활용해 위 콜백지옥 함수를 아래와 같이 구현할 수 있음

```jsx
function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("a");
      resolve();
    }, 1000);
  });
}
function b() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("b");
      resolve();
    }, 1000);
  });
}
function c() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("c");
      resolve();
    }, 1000);
  });
}
function d() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("d");
      resolve();
    }, 1000);
  });
}

a()
  .then(() => b())
  .then(() => c())
  .then(() => d());
```

위처럼 chain 형식으로 약속(promise)의 객체가 반환되고 then 메서드를 활용해 다음 함수를 리턴할 수 있게 된다. 이를 async ~ await 구문으로 더 간단히 구현할 수도 있다.
