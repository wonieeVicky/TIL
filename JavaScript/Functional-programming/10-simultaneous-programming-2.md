# 비동기: 동시성 프로그래밍 2

앞서 자바스크립트의 이터러블 중심의 여러가지 함수들을 만들었는데, 이를 지연적으로 평가하면서 데이터를 다루는 기법들을 확인해보았다.

### 지연평가 + Promise - L.map, map, take

하지만 아직 `L.map`, `map`, `take` 함수는 동기 상황에서만 잘 돌아갈 수 있도록 처리되어있는데, 이 함수들을 저번 시간의 `reduce`나 `go1` 함수처럼 지연평가에서도 잘 돌아갈 수 있도록 리팩토링해보자

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

위와 같이 `L.map` 함수에 `Promise` 객체일 경우에 대한 분기처리를 해주면 반환값은 `Promise`는 11, 12가 될 예정인 값으로 떨어진다. 따라서 11, 12라는 값을 꺼내기 위해서는 `take` 함수를 수정해주어야 한다.

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

위와 같이 `L.filter` 시 넘어오는 인자에 `Promise` 객체값이 담겨 있어 빈 객체로 반환되는 오동작이 발생함. 따라서 `L.filter` 함수를 리팩토링 해주도록 한다.

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
