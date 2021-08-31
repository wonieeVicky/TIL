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

### Array.prototype.map이 있는데 왜 FxJS의 map 함수가 필요할까?

```jsx
function delayI(a) {
  return new Promise((resolve) => setTimeout(() => resolve(a), 100));
}

// Array.prototype.map
function f2() {
  const list = [1, 2, 3, 4];
  const result = list.map((a) => delayI(a * a));
  log(result); // [Promise, Promise, Promise, Promise]
  log(res.reduce(add)); // [object Promise][object Promise][object Promise][object Promise]
}

// async ~ await을 쓰면 되지 않을까?
async function f2() {
  const list = [1, 2, 3, 4];
  const result = await list.map(async (a) => await delayI(a * a));
  log(result); // [Promise, Promise, Promise, Promise] - 동일한 반환값!
}
```

위와 같은 `f2` 함수가 있다고 할 때 `Array.prototype.map` 함수 적용 시 `async ~ await`을 적용해주어도 `Promise` 객체가 반환되어 원하는 값이 출력되지 않는다. `async~await`을 선언한다고 해도 map 함수가 비동기 상황인 `Promise`를 제어해주지 않기 때문이다. 따라서 `f2` 함수 자체가 비동기 상황을 잘 제어해주도록 처리되어야 한다.

아래 `f3` 함수는 `FxJS`의 `map`함수를 적용한 경우이다. `FxJS`의 `Map` 함수는 `Promise`에 대한 제어를 모두 해주므로 원하는 값이 잘 출력되고 있다.

```jsx
// FxJS - map
async function f3() {
  const list = [1, 2, 3, 4];
  const result = await map((a) => delayI(a * a), list);
  log(result); // [1, 4, 9, 16]
}
```

왜 `f2` 함수는 안되고 `f3` 함수는 되는가? 각 함수 내부에 map 함수 실행결과에 대해 로그를 찍어 확인해보자

```jsx
async function f2() {
  const list = [1, 2, 3, 4];
  const temp = list.map(async (a) => await delayI(a * a));
  log(temp); // [Promise, Promise, Promise, Promise]
  const res = await temp;
  log(res); // [Promise, Promise, Promise, Promise]
}
f2();

async function f3() {
  const list = [1, 2, 3, 4];
  const temp = map((a) => delayI(a * a), list);
  log(temp); // Promise {<pending>} - array로 떨어질 준비가 된 map
  const result = await temp;
  log(result); // [1, 4, 9, 16]
}
f3();
```

FxJS의 map 함수에 대해 더 알아두어야 할 것이 있다. 만약 아래처럼 `f4`함수가 있다고 할 때,

```jsx
async function f4() {
  const list = [1, 2, 3, 4];
  const res = await map((a) => delayI(a * a), list);
  log(res); // [1, 4, 9, 16]
  return res;
}
log(f4()); // Promise {<pending>}
f4().then(log); // [1, 4, 9, 16]
```

함수 내부의 `res`에 대한 값을 로그로 찍었을 때에는 `[1, 4, 9, 16]`으로 원하는 값이 나오지만 실제 함수를 동작 시켰을 때 반환값으로는 `Promise {<pending>}`을 뱉는다는 점이다. 따라서 then으로 이어받아야지만 원하는 값을 받아볼 수 있다.

혹은 아래와 같이 해서 값을 반환받을 수 있다.

```jsx
async(() => {
  log(await f4()); // [1, 4, 9, 16]
})();
```

즉 값을 풀어서 전달하는 것과 직접 map 함수를 전달하는 것은 크게 차이가 없으며,
이는 곧 `async-await`을 적용하지 않아도 된다는 뜻과 같다.

```jsx
function f4() {
  return map((a) => delayI(a * a), [1, 2, 3, 4]);
}
log(f4()); // Promise {<pending>}
f4().then(log); // [1, 4, 9, 16]
```

따라서 `async-await`가 어느 곳에 어떻게 사용되어야 하는지 아는 것이 매우 중요하며, 함수 콜에 있어서 비동기를 잘 제어하도록 고려되지 않은 Array.prototype.map 함수의 경우 `async-await`을 쉽게 사용할 수 없는 것이다.

따라서 많은 사람들이 사용하게 될 공용(유틸)함수의 경우 프로미스를 잘 다루는 식으로 만들어진 함수를 만들어야 다양한 조건에서 활용될 수 있다.

### 비동기는 제어 시 async - await이 있는데, 왜 파이프라인이 필요할까?

사실 파이프라인이나 체이닝이 해결하고자 하는 문제와 `async ~ await`가 해결하고자 하는 문제와 목적이 서로 다르다. 다만 이 둘이 마치 같은 목적을 가진 해결법으로 느끼는 이유는 파이프라인으로 프로그래밍을 했을 때에도 동기적인 코드와 비동기적인 코드의 모습이 동일하기 때문에 마치 파이프라인으로 코딩하는 이유가 비동기적인 상황을 동기적으로 표현하기 위해서로 받아들이기 때문이다.

먼저 `async ~ await`는 `Promise.then().then()~`으로 흘러가는 구조가 복잡하고 어려우므로 문장형으로 다루기 위한 목적을 가지고 있다. 반면에 `파이프라인` 혹은 이터러블 중심의 프로그래밍 방식이 추구하는 것은 비동기 프로그래밍이 아닌 명령형 프로그래밍이 아닌 안전한 함수합성을 하기 위한 목적을 가지고 있다.

즉, 파이프라인은 연속적으로 함수를 합성하는 것이 목적이고, `async ~ await`은 비동기 코드를 동기적인 문장형으로 풀어놓으려는 것이 목적이다. 따라서 두 논제는 각자 다른 문제를 해결하기 위한 것들이다.

아래 코드를 보면서 이해해보자.

```jsx
function f5(list) {
  return go(
    list,
    L.map((a) => delayI(a * a)),
    L.filter((a) => delayI(a % 2)),
    L.map((a) => delayI(a + 1)),
    take(3),
    reduce((a, b) => delayI(a + b))
  );
}

go(f5([1, 2, 3, 4, 5, 6, 7, 8]), log); // 38
```

위 `f5()` 함수의 경우 비동기가 일어나는 상황이지만, `Promise` 코드가 보이지 않고, 동기적인 코드로 서술되어 있다. 위 함수는 `async ~ await`를 없애기 위한 혹은 쓰지 않기 위해 만들어진 코드가 아니라 복잡한 for문 등을 쉽고 안전하게 프로그래밍하기 위해 만들어진 구조이다.

이것이 이해가 되지 않는다면, 위 코드를 멍령형으로 작성하고 `async ~ await`로 풀어 작성하여 코드가 어떻게 달라지는지 전개과정을 보면 된다. 아래 `f6()` 함수를 보자

```jsx
async function f6(list) {
  let temp = [];
  for (const a of list) {
    const b = await delayI(a * a);
    log(b); // 1 4 9 16 26 ...
    if (await delayI(b % 2)) {
      const c = await delayI(b + 1);
      log(c); // 2 10 26 38 50
      temp.push(c);
      if (temp.length === 3) break;
    }
  }
  log(temp); // [2, 10, 26]
  let res = temp[0],
    i = 0;
  while (++i < temp.length) {
    res = await delayI(res + temp[i]);
  }
  return res;
}
go(f6([1, 2, 3, 4, 5, 6, 7, 8]), log); // 38
```

위처럼 `async ~ await`는 명령형으로 비동기적인 상황을 문장으로 풀기위해 사용한다. 위 파이프라인 형태의 프로그래밍 방법과 차이점이 있는 것이다. 만약 위 `delayI()` 함수가 비동기 `Promise`를 리턴하는 것이 아닌 일반 원시값을 즉시 실행하여 리턴하는 함수라면 어떻게 될까? 기존 `f5()` 함수는 변경사항 없이 바로 코드가 실행 되지만, `f6()` 함수는 `Promise {<resolved>: 38}` 로 리턴이 된다. 함수 내 비동기가 일어나지 않더라도 이미 `async ~ await`를 적용한 함수이므로 Promise 객체가 반환되는 것이다. 즉 비동기가 발생하지 않을 경우 `async ~ await`를 삭제해주어야 하므로 즉시 코드가 실행될 수 있는 구조가 아닌 것이다.

이로써 파이프라인 형태의 프로그래밍은 기존의 `for문`이나 `async ~ await` 을 적용하는 복잡한 작업을 굉장히 단순한 형태로 코딩하고, 잘 동작할 것이라는 기대를 갖게되는 장점이 있다는 것이 뚜렷해진다.

`C.take`나 `C.reduce`를 동작시켜 병렬적으로 코드를 실행되도록 옵셔널한 선택지를 빠르게 적용할 수 있는 것도 파이프라인 형태의 프로그래밍 방식의 큰 장점이라고 할 수 있는데, 병렬적 코드 실행을 `f6()` 함수에서 지원되도록 하려면 다양한 분기와 Promise.all 등을 사용한 많은 리팩토링이 필요한 한계점을 지닌다.

### async ~ await과 파이프라인을 같이 사용하기도 할까?

당연히 두 프로그래밍 방식을 조합해 사용하기도 하며, 같이 사용하는 과정에서 장점이 많다..!
아래 코드를 보자

```jsx
async function f52(list) {
  const r1 = await go(
    list,
    L.map((a) => delayI(a * a)),
    L.filter((a) => delayI(a % 2)),
    L.map((a) => delayI(a + 1)),
    take(2),
    reduce((a, b) => delayI(a + b))
  );
  const r2 = await go(
    L.map((a) => delayI(a * a)),
    L.filter((a) => delayI(a % 2)),
    reduce((a, b) => delayI(a + b))
  );

  const r3 = await delayI(r1 + r2);
  return r3 + 10;
}

go(f52([1, 2, 3, 4, 5, 6, 7, 8]), log); // 106
```

위 `f52()` 함수처럼 (1) 각 기능을 수행하는 함수를 문장형으로 만든 후 (2) 반환된 두 가지의 재료를 가지고 추가적인 비동기 코드를 실행하여 (3)리턴하는 함수를 만들 때 파이프라인과 `async ~ await`를 조합하여 단계적인 코드를 간단히 구현할 수 있다.
