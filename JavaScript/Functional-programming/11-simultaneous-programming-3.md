# 비동기: 동시성 프로그래밍 3

### async ~ await

`async ~ await`은 자바스크립트에서 비동기 상황을 보다 동기적인 코드로 다루기 위한 방법 중 하나이다. 비동기적으로 일어나는 일들을 문장으로 다루려고 할 때, 동기적인 문장으로 다룰 수 있도록 해주는 키워드인 것이다.

따라서 async ~ await를 사용하면 보다 쉽게 비동기 상황을 제어할 수 있는데, async ~ await 는 어떤 용도로 사용하며, 어떤 한계가 있는지에 대해 알아보자.

먼저 기본 사용법부터 보자. 아래 promise를 리턴하는 delay라는 함수가 있다고 하자.

```jsx
function delay(a) {
  return new Promise((resolve) => setTimeout(() => resolve(a), 500));
}

async function f1() {
  const a = delay(10);
  const b = await delay(10);
  const c = await delay(5);
  log("a:", a, "b:", b, "b+c:", b + c);
}

f(1); // a: Promise {<pending>} b: 10 b+c: 15
```

위와 같이 비동기 코드를 동기적으로 구현할 수 있다. 하지만 `async ~ await`를 쓴다고 해서 모든 비동기 상황을 잘 동기적으로 다룰 수 있는 것은 아니다. 일단 `async ~ await`를 기반인 `Promise`에 대해 정확히 아는 것이 중요하다. 왜냐하면 `delay`라는 함수에서는 `Promise`를 사용하기 때문이다. 더 정확히는 우리가 `async ~ await`을 사용하기 위해서는 실행 함수가 반드시 `Promise`를 리턴해야 `await`을 통해 결과를 기다려서 넣어줄 수 있기 때문에 `Promise`를 정확히 아는 것이 중요한 것이다.

물론 위 delay 함수에도 Promise가 보이지않도록 `delayIdentity` 함수를 만들어 처리할수도 있다.

```jsx
function delay(time) {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function delayIdentity(a) {
  await delay(1000);
  return a;
}

async function f1() {
  const a = await delayIdentity(10);
  const b = await delayIdentity(5);
  log(a + b); // 5
}
```

하지만 이 또한 delay라는 기존 함수를 depth 안으로 숨겨놓은 것일 뿐 결국 promise를 사용해야한다.

이렇듯 만약 이미 만들어진 함수가 `Promise`를 리턴하는 함수라면 쉽게 `async ~ await` 코드를 적용할 수 있겠지만 기존에 사용하던 함수가 일반 값을 리턴하던 것을 변경하거나 비동기 코드를 제어하는 새로운 함수를 생성할 경우 `promise`를 리턴하는 함수를 기본적으로 다룰 수 있어야하는 것이다.

그리고 또 하나의 특징은 `async ~ await` 코드를 적용하면 일반 원시값을 리턴할 수 없고 반드시 `Promise` 객체를 리턴한다는 점이다.

```jsx
async function f1() {
  const a = await delayIdentity(10);
  const b = await delayIdentity(5);
  return a + b;
}
log(f1()); // Promise {<pending>}

// 내부 함수가 Promise를 리턴하는 값이 아니라도 async 적용시 아래와 같이 반환된다.
async function f1() {
  const a = 10;
  const b = 5;
  return a + b;
}
log(f1()); // Promise {<resolved>: 15}

// 결과값을 리턴받아 사용하려면 then 혹은 go 혹 IIFE를 사용해야 한다.
f1().then(log); // 15
go(f1(), log); // 15
(async () => {
  log(f1()); // Promise {<pending>}
  log(await f1()); // 15
})();
```

예를 들면 아래와 같은 함수가 있다고 하자.

```jsx
const pa = Promise.resolve(10);
(async () => {
  log(pa); // Promise {resolved: 10}
  log(await pa); // 10
})();

const pa = f1();
(async () => {
  log(await pa); // 15
})();
```

위 코드를 보면 async 내부에 await이 Promise의 결과값을 리턴해주는 역할을 하는 것을 알 수 있다. 위와 같은 모든 가정 즉, Promise와 async ~ await 합을 잘 다룰 수 있어야 비동기 코드에 대한 핸들링을 더 잘 구현할 수 있다.
