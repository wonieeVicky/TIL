# 지연성 2

### 결과를 만드는 함수 reduce, take

`map`, `filter` 함수는 보통 지연성을 가질 수 있는 함수라고 볼 수 있고, `reduce` 함수는 실제로 연산을 시작하는 시작점을 알리는 역할을 한다. a로부터 b라는 값을 만들려고 할 때, `map`, `filter`를 통해 값을 정리하고, 최종적인 값을 만들 때 `reduce`를 사용한다.

`take`함수는 특정 갯수의 배열로 축약하고 완성을 짓는 성질을 가진다. 따라서 지연성을 가진 함수라기 보단 해당 시점에 연산이 이루어지는 함수이다. 즉 `reduce`와 `take` 함수는 값을 연산하여 결과를 만들 때 사용하는 함수이다.

### queryStr 함수 만들기

`reduce`, `take` 함수들이 실제로 지연성 함수인 `map`, `filter`와 조합하여 사용되는지 확인해보려고 한다. 객체로부터 url query-string을 얻어내는 코드를 만들어보려고 하는데, 이 때 `map`, `filter`, `reduce`를 어떤 관점으로 바라보면서 만드는지 살펴보자

```jsx
const queryStr = (obj) =>
  go(
    obj,
    Object.entries, // ["limit", 10], ["offset", 10], ["type", "notice"]
    map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
    reduce((a, b) => `${a}&${b}`)
  );
log(queryStr({ limit: 10, offset: 10, type: "notice" })); // limit=10&offset=10&type=notice
```

위 `queryStr` 함수는 객체값을 가져와 `Object.entries`로 분리해주고, `map` 함수를 통해 원하는 값으로 데이터를 변경한 뒤, `reduce`로 원하는 결과값을 도출해내는 함수이다.

### Array.prototype.join보다 다형성 높은 join 함수 만들기

여기서 급 궁금..! 굳이 reduce를 사용할 필요가 있을까? `join('&')`를 통해서도 충분히 도출되는 값을 만들 수 있다. 그러나 join은 `Array.prototype`에 있는 함수로 `reduce`는 이터러블 객체를 모두 순회하면서 축약할 수 있으므로 더 다형성이 높은 `join` 함수라고 볼 수 있다.

따라서 `join`함수를 `reduce`를 통해서 만들어보고 해당하는 함수를 재사용이 가능하게 만들어보자.

```jsx
// 아래의 join 함수는 배열이 아닌 것도 사용할 수 있다. 받는 값을 reduce를 통해 이터러블을 축약하기 때문
const join = curry((sep = ",", iter) => reduce((a, b) => `${a}${sep}${b}`, iter));

const queryStr = pipe(
  Object.entries, // ["limit", 10], ["offset", 10], ["type", "notice"]
  map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
  join("&")
);

log(queryStr({ limit: 10, offset: 10, type: "notice" })); // limit=10&offset=10&type=notice
```

위와 같이 `join` 함수를 만든 것처럼 함수형 프로그래밍 사고를 하면 `pipe` 사이에 있는 함수들을 꺼내 조합성과 재사용성을 살려 프로그래밍 할 수 있다. 위에서 만든 `join` 함수는 배열이 아닌 값도 처리한다.

```jsx
function* a() {
  yield 10;
  yield 11;
  yield 12;
  yield 13;
  yield 14;
}
// log(a().join(",")); // a(...).join is not a function
log(join("-", a())); // 10-11-12-13-14
```

다형성이 높은 `join` 함수를 구현했으므로 기존 `queryStr` 함수의 `map`도 이터러블 프로토콜을 따르는 `L.map` 함로 변경할 수 있다. 다음 단계에서 넘어오는 값에 대해 로그를 달면 아래와 같다.

```jsx
const queryStr = pipe(
  Object.entries,
  L.map(([k, v]) => `${k}=${v}`),
  function (a) {
    console.log(a); // Generator {<suspended>}, 기존 map사용 시 배열 객체가 반환됨.
    return a;
  },
  join("&")
);
```

위 로그를 통해 `join`이 안쪽에서 next 처리하면서 하나씩 풀어서 그때그때 필요한 순간에 연산할 수 있도록 하는 것이다. 이를 통해 기존 `Array.prototype.join` 보다 훨씬 더 다형성이 높고 유연한 방식의 `join`함수가 된다는 것을 알 수 있다. 이를 통해 재미있는 함수로 다양하게 활용할 수 있다.

`queryStr` 함수 내 `Object.entries` 도 이터레이터로 결과를 흘려보내주도록 만들 수 있다.

```jsx
L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

const queryStr = pipe(
  L.entries,
	L.map(([k, v]) => `${k}=${v}`),
  join("&")
);

log(queryStr({ limit: 10, offset: 10, type: 'notice }); // limit=10&offset=10&type=notice
```

### take, find

앞서 `join` 함수는 `reduce` 계열의 함수였다. 함수형 프로그래밍은 이렇게 계열 혹은 계보를 가진 식으로 함수를 만들 수 있다. 그런 것처럼 find 함수는 `Take` 계열 함수로 만들 수 있다. 예를 들어 아래와 같은 `users` 데이터가 있고, 해당 데이터에 특정 조건에 맞는 한가지 데이터만 반환하는 함수를 구현한다고 하자

```jsx
const users = [{ age: 32 }, { age: 31 }, { age: 37 }, { age: 28 }, { age: 25 }, { age: 32 }, { age: 31 }, { age: 37 }];

const find = (f, iter) => go(iter, filter(f), take(1), ([a]) => a);

log(find((u) => u.age < 30, users)); // { age: 28 }
```

위 `fInd` 함수는 아쉬운 점이 있다. 해당 함수는 모든 값을 순회하므로 비효율적인 상태이기 때문이다.
아래와 같이 로그를 찍어보면 더 명확하게 알 수 있음

```jsx
const find = (f, iter) => go(
	iter,
	filter(a => (console.log(a), f(a)), // { age: 32 }, ... { age: 37 }
	a => (console.log(a), a), // (2) [{ age: 28 }, { age: 25 }], 두 객체를 만들어 리턴함
	take(1),
	([a]) => a
);
```

`L.filter`로만 변경해도 연산 방식이 달라진다.

```jsx
const find = (f, iter) => go(
	iter,
	L.filter(a => (console.log(a), f(a)), // { age: 32 }, ... { age: 28 }
	a => (console.log(a), a), // { age: 28 }
	take(1),
	([a]) => a
);
```

`take(1)`로 적합한 데이터를 찾을 수 있는 때가 오면 함수를 더 진행하지 않고 결과를 반환하게 된다.
따라서 그냥 `filter`보다 `take`에게 결과를 미룸으로서 하나의 값이 꺼내지면 `filter`가 실해되지 않도록 함으로서 함수 효율성을 높여줄 수 있는 것이다.

여기에 `curry` 함수를 넣어 다양한 조합성으로 사용할 수 있도록 해주면 더 좋다.

```jsx
const find = curry((f, iter) => go(iter, L.filter(f), take(1), ([a]) => a));

log(find((u) => u.age < 30)(users)); // { age: 28 }
```

즉 위와 같이 업데이트 된 `find` 함수는 `take`를 통해 이터러블 값을 받는 함수이며, 아래와 같이 정리된다.

```jsx
go(
  users,
  L.map((u) => u.age),
  find((n) => n < 30),
  log
); // 28
```

### L.map, L.filter로 map과 filter 만들기

기존 `map`을 활용한 아래와 같은 함수가 있다고 하자.

```jsx
const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(f(a));
  }
  return res;
});

log(map((a) => a + 10, range(4))); // [10, 11, 12, 13]
// map 함수가 이터러블 객체를 이터레이터로 만들어사용하기 때문에 L.range 사용 가능
log(map((a) => a + 10, L.range(4))); // [10, 11, 12, 13]
```

위 `map` 함수를 `L.map` 을 적용하여 더욱 간결하게 만들 수 있다.

```jsx
const map = curry(
  pipe(
    L.map, // 앞에서 만들어진 map이 length가 어떻게 되든
    take(Infinity) // 만들어진 값만 반환한다
  )
);

log(map((a) => a + 10, L.range(4))); // [10, 11, 12, 13]
```

기존 filter도 마찬가지로 동일하게 `L.filter`를 활용하여 더욱 간결하게 만들 수 있는데, 기존 filter 함수로 구현한 코드가 아래와 같다면..

```jsx
L.filter = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) {
      yield a;
    }
  }
});

const filter = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) res.push(a);
  }
  return res;
});

log(filter((a) => a % 2, L.range(4))); // [1, 3]
```

아래처럼 코드를 간소화시킬 수 있다.

```jsx
const filter = curry(pipe(L.filter, take(Infinity)));

log(filter((a) => a % 2, L.range(4))); // [1, 3]
```

또한 `take(Infinity)`가 계속 반복되므로 `const takeAll = take(Infinity);` 별도로 빼줘도 좋다.

```jsx
const takeAll = take(Infinity);

const map = curry(pipe(L.map, take

All));
const filter = curry(pipe(L.filter, take(Infinity)));
```

또한 `L.map`과 `L.filter`를 좀 더 간소화하여 표현하자면 아래와 같다.

```jsx
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});
```
