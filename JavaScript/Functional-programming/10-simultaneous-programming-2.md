# 비동기: 동시성 프로그래밍 2

앞서 자바스크립트의 이터러블 중심의 여러가지 함수들을 만들었는데,이를 지연적으로 평가하면서 데이터를 다루는 기법들을 확인해보았다.

### 지연평가 + Promise - L.map, map, take

하지만 아직 `L.map`, `map`, `take` 함수는 동기 상황에서만 잘 돌아갈 수 있도록 처리되어있는데,
이 함수들을 저번 시간의 `reduce`나 `go1` 함수처럼 지연평가에서도 잘 돌아갈 수 있도록 리팩토링해보자

```jsx
go(
  [1, 2, 3],
  L.map((a) => a + 10),
  take(2),
  log
); // [11, 12]
```

위 함수는 잘 돌아가는 동기 코드이다. 만약 [1, 2, 3]이 `Promise`라면 어떻게 될까?

```jsx
go(
  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  L.map((a) => a + 10),
  take(2),
  log
); // ["[object Promise]10", "[object Promise]10"]
```

위와 같이 올바르게 연산되지 않는다. 이를 정상적으로 연산이 동작하게 하려면 `L.map` 함수를 수정해줘야 한다.

```jsx
// 기존 L.map
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

// go1 함수를 활용해 아래와 같이 변경
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield go1(a, f);
  }
});

go(
  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  L.map((a) => a + 10),
  take(2),
  log
); // [Promise{<resolved>: 11}, Promise{<resolved>: 12}]
```

위와 같이 `L.map` 함수에 `Promise` 객체일 경우에 대한 분기처리를 해주면 반환값은 `Promise`는
11, 12가 될 예정인 값으로 떨어진다. 따라서 11, 12라는 값을 꺼내기 위해서는 `take` 함수를 수정해주어야 한다.

```jsx
// 기존 take
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value; // a: [Promise, Promise]
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});

// 변경: 반환값을 유명 재귀함수로 변경
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  return function recur(){
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if(a instanceof Promise) return a.then(a =>
        (res.push(a), res).length == l ? res : recur());
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  }();
});

go(
  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  L.map(a => a + 10),
  take(2),
  log); // [11, 12]

go(
  [2, 3, 4],
  L.map(a => Promise.resolve(a + 10)),
  take(2),
  log); // [12, 13]

const map = curry(pipe(L.map, takeAll));

// map 함수는 L.map과 takeAll의 조합이므로 아래의 코드도 정상적으로 실행된다.
go(
  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  map(a => Promise.resolve(a + 10),
  log); // [12, 13, 14]
```

위와 같이 `take` 함수가 `Promise` 객체 값을 반환하도록 처리하면 11, 12 값이 정상적으로 반환되는 것을 확인할 수 있다.

### Kleisli Composition - L.filter, filter, nop, take

filter에서 지연평가와 비동기 동시성(Promise)를 함께 지원하려면 Kleisli Composition을 활용해야 한다.

```jsx
go(
  [1, 2, 3, 4],
  L.filter((a) => a % 2),
  take(2),
  log
); // [1, 3]

go(
  [1, 2, 3, 4],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => {
    log(a); // Promise {<resolved>: a}
    return a % 2;
  }),
  take(2),
  log
); // []
```

위와 같이 `L.filter` 시 넘어오는 인자에 `Promise` 객체값이 담겨 있어 빈 객체로 반환되는 오동작이 발생함.
따라서 `L.filter` 함수를 리팩토링 해주도록 한다.

```jsx
// 기존 L.filter
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

// go1 함수를 활용해 아래와 같이 변경
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
const nop = Symbol("nop"); // reject 메서드 안에 넣을 구분 자

// 변경된 L.filter
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    const b = go1(a, f); // Promise {<pending>}
    if (b instanceof Promise) yield b.then((b) => (b ? a : Promise.reject(nop)));
    else if (b) yield a;
  }
});
```

만약 위와 같이 `L.filter`를 바꿔줄 경우 조건에 맞는 인자가 없을 때 `Promise.reject(nop)` 시키도록 명시적으로 추가해주었다. 그렇다면 다른 오류가 아닌 `nop` 이슈로 인해 동작이 멈췄음을 명시적으로 전달해주기 위해 순차적으로 실행되는 `take` 함수의 대비가 필요하다. 따라서 `take` 함수를 아래와 같이 바꿔준다.

```jsx
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a
          .then((a) => ((res.push(a), res).length == l ? res : recur()))
          .catch((e) => (e == nop ? recur() : Promise.reject(e))); // e == nop이면 별도의 reject하지않고 다음 인자를 보도록(재귀) 처리
      }
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  })();
});
```

위 함수처럼 처리하는 것을 아래와 같이 처리되는 것과 비슷한 의미이다.

```jsx
Promise.resolve(1).then(() =>
	Promise.reject('err')).then(() =>
		console.log('여기')).then(() =>
			console.log('여기')).then(() =>
				console.log('여기')).catch(e =>
					console.log(e, 'hi');  // err, hi - reject 이하 함수 실행 불가
```

위와 같이 수정해주면 코드는 아래와 같이 실행된다.

```jsx
go(
  [1, 2, 3, 4],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => {
    log(a); // Promise {<resolved>: a}
    return a % 2;
  }),
  L.map((a) => {
    log(a);
    return a * a;
  }),
  L.map((a) => {
    log(a);
    return a * a;
  }),
  L.map((a) => {
    log(a);
    return a * a;
  }),
  take(2),
  log
); // [1, 43046721]

go(
  [1, 2, 3, 4, 5, 6],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => a % 2),
  L.map((a) => {
    log(a);
    return a * a;
  }),
  take(4),
  log
); // [1, 81, 625]

go(
  [1, 2, 3, 4, 5, 6],
  L.filter((a) => Promise.resolve(a % 2)),
  L.map((a) => a * a),
  take(4),
  log
); // [1, 9, 25]

go(
  [1, 2, 3, 4, 5, 6],
  filter((a) => Promise.resolve(a % 2)),
  log
); // [1, 3, 5]
```

### reduce에서 nop 지원

위 `take` 함수와 같이 `reduce`에서도 `nop`을 지원하도록 리팩토링해보자.
이를 통해 지연성과 Promise를 모두 지원하는 이터러블 중심 프로그래밍이 가능해지고
나아가 동시성이나 비동기 상황들을 잘 제어해보고자 한다.

```jsx
go(
  [1, 2, 3, 4],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => Promise.resolve(a % 2)),
  reduce(add),
  log
); // 1[object Promise][object Promise][object Promise]
// Uncaught (in promise) Symbol(nop)
```

reduce를 사용 시 위와 같이 에러가 나고 있다.

```jsx
// 기존 Reduce
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      acc = f(acc, a);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});

const reduceF = (acc, a, f) =>
  a instanceof Promise
    ? a.then(
        (a) => f(acc, a),
        (e) => (e == nop ? acc : Promise.reject(e))
      )
    : f(acc, a);

// 기존 Reduce
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f); // reduceF 적용
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});
```

위와 같이 변경 후 위 go 함수를 실행시키면 정상적으로 동작한다.

```jsx
go(
  [1, 2, 3, 4],
  L.map((a) => Promise.resolve(a * a)),
  L.filter((a) => Promise.resolve(a % 2)),
  reduce(add),
  log
); // 10
```

위 reduce 함수를 좀 더 리팩토링 하면 아래와 같이 변경이 가능하다.

```jsx
const head = (iter) => go1(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
  if (!iter) return reduce(f, head((iter = acc[Symbol.iterator]())), iter);

  iter = iter[Symbol.iterator]();
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f); // reduceF 적용
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});
```

### 지연평가 + Promise의 효율성

위와 같이 map, filter, reduce에서 동기와 비동기 상황을 모두 제어하도록 코드를 완성시켜보았다.
이로써 함수가 많은 효율성이 생겼는데, 아래 코드를 보자

```jsx
go(
  [1, 2, 3, 4, 5, 6, 7, 8],
  L.map((a) => {
    log(a);
    return new Promise((resolve) => setTimeout(() => resolve(a * a), 1000));
  }),
  L.filter((a) => a % 2),
  take(2),
  log
);
// 1
// 2
// 3
// [1, 9]
```

위 코드를 실행하였을 때 해당하지 않는 4 - 8은 아예 코드 동작이 진행되지 않는 것을 알 수 있다.

```jsx
go(
	[1, 2, 3, 4, 5, 6, 7, 8],
  L.map(a => {
    lo`(a);
    return new Promise(resolve => setTimeout(() => resolve(a * a), 1000))
  }),
  L.filter(a => {
    log(a);
    return new Promise(resolve => setTimeout(() => resolve(a % 2), 1000))
  }),
	take(2),
  log
);
// 1
// 1
// 2
// 4
// 3
// 9
// [1, 9]
```

### 지연된 함수열을 병렬적으로 평가하기 - C.reduce, C.take (1)

이번에는 병렬적인 로직에 대해 다뤄보자.
자바스크립트 동작하는 환경 즉 브라우저나 node.js 환경에서는 비동기 IO로 보통 동작하는데 이 비동기IO는 싱글스레드를 기반으로 IO들을 동기적으로 처리하기 보다는 비동기적으로 처리해서 하나의 쓰레드에서도 CPU 점유를 효율적으로 하여 IO 작업이 효율적으로 돌아가도록 해준다.

자바스크립트가 싱글 스레드이므로 '자바스크립트에서는 병렬적인 프로그래밍을 할 일이 없다'라고 생각하기 쉬우나 사실 자바스크립트가 로직을 제어하는 것을 싱글스레드로(비동기적으로) 제어할 뿐 얼마든지 병렬적인 처리는 필요할 수 있다. 예를 들어 node.js에서 쿼리를 칠 때 병렬적으로 요청한다거나, nosql에서 여러 개의 결과를 한번에 처리한다던지 할 때에는 실제로 node.js가 직접 처리하기 보다는 네트워크나 기타IO로 작업을 보내놓고 대기하고 시점을 다루는 것만 node.js가 하므로 어떤 처리를 동시에 시작했다가 하나의 로직으로 귀결시키는 등의 작업은 자바스크립트에서 특별히 잘 다룰 필요가 있다.

따라서 동시성으로 동작하는 코드에 대해 살펴보고자 한다.

```jsx
const delay1000 = (a) =>
  new Promise((resolve) => {
    console.log("check");
    setTimeout(() => resolve(a), 1000);
  });

console.time("");
go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay1000(a * a)),
  L.filter((a) => a % 2),
  reduce(add),
  log,
  (_) => console.timeEnd("")
);
// check
// check
// check
// check
// check
// 35
// : 56013.577128312981ms

go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay1000(a * a)),
  L.filter((a) => a % 2),
  // reduce(add),
  log
);
// Generator {<suspended>}
```

위와 같은 코드가 있다고 하자 위 `[L.map](http://l.map)`과 `L.filter`의 경우 `reduce`에 의해 실행되는 함수이므로 두번째 `go`함수처럼 `reduce(add)`를 주석 처리하면 실제 코드는 동작하지 않는다. 해당 코드를 주석해지하면 각 배열의 값에 대해 하나씩 `L.map → L.filter → reduce` 연산을 진행하는 것이다.

만약 각 배열을 순차적으로 처리하는 것이 아닌 동시에 연산을 출발시킨 다음 더하는 reduce를 만든다면 어떨까?
부하가 발생할 가능성도 있지만 특정한 상황에서는 더욱 빠르게 최종 결과를 만들 수 있는 매우 효율적인 함수가 될 수 있다.
따라서 `C.reduce` 함수를 만들어보고자 한다. (여기에서 C는 Concurrency 병행성을 의미한다)

```jsx
// 기존 Reduce는 하나씩 순회하면서 대기열의 모든 결과를 마친 후에 다음 값으로 넘어가지만
// 아래와 같이 변경하면 모든 함수를 다 실행한 뒤 개별적으로 비동기제어를 해서 앞에서 부터 누적을 시킨다.
const C = {};
C.reduce = curry((f, acc, iter) => (iter ? reduce(f, acc, [...iter]) : reduce(f, [...acc])));

console.time("");
go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay1000(a * a)),
  L.filter((a) => a % 2),
  reduce(add),
  log,
  (_) => console.timeEnd("")
);
// 5 check - 동시에 출발하고
// 35 - 결과 출력
// : 1006.2939019129ms
```

위처럼 `C.reduce` 함수를 적용하면 모든 인자가 동시에 실행되어 값을 도출하므로 앞선 go 함수가 실행되면서 걸린 5초보다 훨씬 빠르게 처리가 가능한 것을 확인할 수 있다. 따라서 이런 동시적인 작업이 부하가 걸리지 않을 정도의 코드라면 동시에 실행시켜 효율적인 프로그래밍으로 이어지게 하는 것이 이득이 될 수 있다.

### 지연된 함수열을 병렬적으로 평가하기 - C.reduce, C.take (2)

좀 더 많은 함수 대기열이 있을 때에 대해 살펴보자.

```jsx
console.time("");
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  L.map((a) => delay1000(a * a)),
  L.filter((a) => delay1000(a % 2)),
  L.map((a) => delay1000(a * a)),
  C.reduce(add),
  log,
  (_) => console.timeEnd("")
);

// Uncaught (in Promise) Symbol(nop)
// check
// Uncaught (in Promise) Symbol(nop)
// check
// 2 Uncaught (in Promise) Symbol(nop)
// check
// 9669
// : 3012. 12139210ms
```

반환값 자체는 문제가 없으나 `Symbol(nop)`에 대한 에러가 발생한다. 이는 무조건 실행되는 에러인데 아래 예시를 보자

```jsx
Promise.reject("hi");
// Promise {<rejected>: "hi"}
// UnCaught (in promise) hi

var p = Promise.reject("ho");
// UnCaught (in promise) ho
p.catch((a) => console.log("해결", a));
// 해결 ho
```

위와 같이 에러가 발생하는 이유는 콜스택에 Promise reject으로 평가되는 것이 있으면 자동으로 에러 메시지가 출력되도록 설계되어 있기 때문이다. 해당하는 값을 나중에 catch를 통해 출력을 해도 해당 에러는 미리 발생한다. 따라서 `C.reduce` 함수에 reject 처리가 되어도 다음 콜스택에서 처리할 것이라는 것을 알려주는 코드 보강이 필요하다.

```jsx
const C = {};
// 아무것도 하지 않는 noop 함수 생성
function noop() {}

// 미리 Promise.reject에 대한 에러가 발생하지 않도록 catch 처리
// 단, catch 처리된 arr를 반환하지 않고 초기 들어온 arr을 그대로 리턴한다.
// 이유는 a.catch()를 먼저 진행할 경우 이후에 catch 시 동작하지 않기 때문임
const catchNoop = (arr) => arr.forEach((a) => (a instanceof Promise ? a.catch(noop) : a), arr);

C.reduce = curry((f, acc, iter) => {
  const iter2 = catchNoop(iter ? [...iter] : [...acc]);
  return iter ? reduce(f, acc, iter2) : reduce(f, iter2);
});
```

물론 node.js나 자바스크립트 실행 환경은 싱글스레드이므로 외부에 네트워크 IO를 한다거나 이미지 편집을 하는 코드들에게
명령 전달 시 제어만 위와 같이 병렬적으로 한다면 코드의 효율성을 높일 수 있다.

위와 같은 방식으로 take 함수도 변형시킬 수 있다.

```jsx
C.take = curry((l, iter) => take(l, catchNoop([...iter])));
```

이후 아래와 같이 함수를 실행시켜보면

```jsx
console.time("");
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  L.map((a) => delay1000(a * a)),
  L.filter((a) => delay1000(a % 2)),
  L.map((a) => delay1000(a * a)),
  C.take(2),
  C.reduce(add),
  log,
  (_) => console.timeEnd("")
);
// 9 check
// 9 check
// 5 check
// 82
// : 3002.123123192301ms

console.time("");
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],

  L.map((a) => delay1000(a * a)),
  L.filter((a) => delay1000(a % 2)),
  L.map((a) => delay1000(a * a)),
  ttake(2),
  C.reduce(add),
  log,
  (_) => console.timeEnd("")
);
// check
// check
// check
// check
// check
// check
// check
// check
// 82
// : 3002.123123192301ms
```

위와 같이 `take` 함수와 `C.take` 함수를 쓰는 것에 따라 실행시간이 차이가 난다.
즉, `take` 함수의 경우 명령 자체를덜 실행시키는데 최적화된 사용법이고
`C.take` 함수의 경우 최대한 많은 자원을 써서 빠르게 결과를 받아내려는데 최적화된 사용법으로
각 전략에 따라 선택적으로 사용할 수 있게 된다.

위처럼 이터러블 중심적으로 사고를 하면 병렬적인 프로그래밍을 안전하고 쉽고, 선언적으로 해결할 수 있다.

### 즉시 병렬적으로 평가하기 - C.map, C.filter

지금까지는 함수열들을 쭉 만든 뒤 마지막에 평가를 하는 함수인 reduce나 take에서 지금까지 등록되어 있는 함수를 병렬적 혹은 동기적으로 실행하겠다를 선택하여 여러 개의 대기열을 처리하는 식으로 만들어보았다.

이번에는 특정 함수 라인에서만 병렬적으로 평가 후 이외에는 동기적으로 실행할 수 있도록 선택할 수 있는 C.map과 C.filter를 만들어보고자 한다.

```jsx
C.take = curry((l, iter) => take(l, catchNoop([...iter])));
C.takeAll = C.take(Infinity); // 간단하게 C.take를 활용한 C.takeAll 구현

// curry와 pipe, 그리고 C.takeAll을 활용해 C.map, C.filter 구현
C.map = curry(pipe(L.map, C.takeAll));
C.filter = curry(pipe(L.filter, C.takeAll));
```

위 C.map, C.filter로 아래 코드를 구현하면 1초 뒤 동시에 시작되어 값이 도출되도록 구현이 가능하다.

```jsx
C.map((a) => delay1000(a * a), [1, 2, 3, 4]).then(log); // 1초 뒤 동시에 시작되어 [1, 4, 9, 16]
C.filter((a) => delay1000(a % 2), [1, 2, 3, 4]).then(log); // 1초 뒤 동시에 시작되어 [1, 3]
```

### 즉시, 지연, Promise, 병렬적 조합하기

지금까지 즉시/지연 평가되는 함수와 Promise 지원 및 병렬적 실행이 가능한 코드들을 작성해보았다. 이러한 코드들을 조합하여 내가 원하는 평가전략을 세우는 식으로 코딩을 할 수 있다.

아래 사례를 보자

```jsx
const delay500 = (a, name) =>
  new Promise((resolve) => {
    console.log(`${name}: ${a}`);
    setTimeout(() => resolve(a), 100);
  });

// 엄격한 평가를 한 예
console.time("");
go(
  [1, 2, 3, 4, 5],
  map((a) => delay500(a * a, "map 1")),
  filter((a) => delay500(a % 2, "filter 2")),
  map((a) => delay500(a + 1, "map 3")),
  take(2),
  // reduce(add),
  log,
  (_) => console.timeEnd("")
);
// map 1: 1
// map 1: 4
// map 1: 9
// map 1: 16
// map 1: 25
// filter 2: 1
// filter 2: 0
// filter 2: 1
// filter 2: 0
// filter 2: 1
// map3: 2
// map3: 10
// map3: 26
// (2) [2, 10]
// :10064.1231231ms

// 지연평가 적용한 얘
console.time("");
go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay500(a * a, "map 1")),
  L.filter((a) => delay500(a % 2, "filter 2")),
  L.map((a) => delay500(a + 1, "map 3")),
  take(2),
  // reduce(add),
  log,
  (_) => console.timeEnd("")
);
// map 1: 1
// filter 2: 1
// map 3: 2
// map 1: 4
// filter 2: 0
// map 1: 9
// filter 2: 1
// map 3: 10
// (2) [2, 10]
// :4064.1231231ms

// C.map을 적용한 예
console.time("");
go(
  [1, 2, 3, 4, 5],
  C.map((a) => delay500(a * a, "map 1")),
  L.filter((a) => delay500(a % 2, "filter 2")),
  L.map((a) => delay500(a + 1, "map 3")),
  take(2),
  // reduce(add),
  log,
  (_) => console.timeEnd("")
);
// map 1: 1
// map 1: 4
// map 1: 9
// map 1: 16
// map 1: 25
// filter 2: 1
// map 3: 2
// filter 2: 0
// filter 2: 1
// map 3: 10
// (2) [2, 10]
// 4542.1231231ms

// C.filter 병렬 처리 적용한 예
console.time("");
go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay500(a * a, "map 1")),
  C.filter((a) => delay500(a % 2, "filter 2")),
  L.map((a) => delay500(a + 1, "map 3")),
  take(2),
  // reduce(add),
  log,
  (_) => console.timeEnd("")
);
// map 1: 1
// map 1: 4
// map 1: 9
// map 1: 16
// map 1: 25
// filter 2: 1
// filter 2: 0
// filter 2: 1
// filter 2: 0
// filter 2: 1
// map3: 2 - 여기서부터 하나씩 연산
// map3: 10
// (2) [2, 10]
// :2020.1293012931ms

// C.filter 병렬 처리 적용한 예
console.time("");
go(
  [1, 2, 3, 4, 5],
  L.map((a) => delay500(a * a, "map 1")),
  L.filter((a) => delay500(a % 2, "filter 2")),
  L.map((a) => delay500(a + 1, "map 3")),
  C.take(2),
  // reduce(add),
  log,
  (_) => console.timeEnd("")
);
// map 1: 1
// map 1: 4
// map 1: 9
// map 1: 16
// map 1: 25
// filter 2: 1
// filter 2: 0
// filter 2: 1
// filter 2: 0
// filter 2: 1
// map3: 2
// map3: 10
// map3: 26
// (2) [2, 10]
// :1511.1231231ms
```

위와 같이 상황에 맞게 전략을 짜서 선언적으로 부하정도를 결정하여 프로그래밍 할 수 있다.

### 코드 리팩토링

`C.reduce` 함수를 좀 더 간결하게 리팩토링해보자

```jsx
// 기존 catchNoop
const catchNoop = (arr) => arr.forEach((a) => (a instanceof Promise ? a.catch(noop) : a), arr);
// 기존 C.reduce
C.reduce = curry((f, acc, iter) => {
  const iter2 = catchNoop(iter ? [...iter] : [...acc]);
  return iter ? reduce(f, acc, iter2) : reduce(f, iter2);
});

// 변경 후 catchNoop
const catchNoop = ([...arr]) => arr.forEach((a) => (a instanceof Promise ? a.catch(noop) : a), arr);
// 변경 후 C.reduce
C.reduce = curry((f, acc, iter) => (iter ? reduce(f, acc, catchNoop(iter)) : reduce(f, catchNoop(acc))));
```