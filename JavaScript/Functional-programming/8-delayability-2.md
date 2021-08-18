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

### L.flatten, flatten

다수의 배열을 하나의 배열로 펼쳐서 반환하면서 지연성까지 갖춘 L.flatten 함수를 만들어보려고 한다.

```jsx
log([...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]);
```

예를 들면 위 다수의 배열을 `[1, 2, 3, 4, 5, 6, 7, 8, 9]`로 반환해주는 함수를 만들고자 하는 것이다.

```jsx
// a값이 있고, a가 Symbol.iterator를 가졌는지 체크한다.
const isIterable = (a) => a && a[Symbol.iterator];

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) for (const b of a) yield b;
    else yield a;
  }
};

var it = L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]);
log(it.next()); // { value: 1, done: false }, 지연적으로 동작한다.
log(it.next()); // { value: 2, done: false }, 지연적으로 동작한다.
log([...it]); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

`L.flatten` 함수는 위와 같이 구현이 가능하다. 즉시평가하는 flatten 함수도 만들 수 있다.

```jsx
const flatten = pipe(L.flatten, takeAll);
log(flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]])); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

혹은 필요한 갯수만큼만 전개하여 반환하는 함수도 쉽게 만들 수 있다.

```jsx
log(take(3, L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]))); // [1, 2, 3]
```

### yield \*를 활용한 L.flatten 리팩토링, L.deepFlat

`yield *`를 활용하면 위 `L.flatten` 함수를 아래와 같이 변경할 수 있다. `yield *iterable`은 `for(const val of iterable) yield val;`과 같다.

```jsx
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};
```

만약 다중배열 혹은 깊은 `Iterable`을 모두 펼치고 싶다면 아래와 같이 `L.deepFlat` 함수로 구현할 수 있다. `L.deepFlat`은 깊은 `Iterable`을 펼쳐준다.

```jsx
L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};
log([...L.deepFlat([1, [2, [3, 4], [[5]]]])]); // [1, 2, 3, 4, 5];
```

### L.flatMap, flatMap

flatMap 함수는 map과 flatten을 동시에 하는 역할을 담당하는 함수이다. 자바스크립트 기본 문법으로 제공되는 flatMap의 사용법은 아래와 같으며, flatMap 안에 들어가는 함수를 통해 다양한 값에 대한 조작이 가능하다.

```jsx
log(
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ].flatMap((a) => a)
); // [1, 2, 3, 4, 5, 6, 7]
log(
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ].flatMap((a) => a.map((a) => a * a))
); // [1, 4,9, 16, 25, 36, 49]
```

위 flatMap과 동일한 동작을 수행하는 함수를 직접 구현하려면 `map` 한 값에 `flatten` 함수를 적용하면 된다.

```jsx
log(
  flatten(
    [
      [1, 2],
      [3, 4],
      [5, 6, 7],
    ].map((a) => a.map((a) => a * a))
  )
);
log(
  flatten(
    [
      [1, 2],
      [3, 4],
      [5, 6, 7],
    ].map((a) => a.map((a) => a * a))
  )
);
```

`flatMap`함수가 존재하는 이유는 `map`과 `flatten`이 비효율적으로 동작하기 때문인데, `map`을 통해 모든 배열의 인자를 순회 후 다시 `flatten`을 적용하기 때문이다.

물론 비효율적이라고 해서 시간복잡도가 차이나거나 하지 않는다. 그 이유는 위 flatMap 함수도 결국 모든 배열을 순회하기 때문이다. 순회하지 않아도 되는 부분이 발생하거나 연산자체를 하지 않아도 되는 부분이 있는 코드가 아니라면 시간복잡도가 동일하므로 굉장히 많은 효율을 만들어낼 수 있지는 않다.

그러나 좀 더 효율적으로 동작하도록 하는 혹은 다형성이 높은 `FlatMap` 함수를 직접 구현해보자

```jsx
L.flatMap = curry(pipe(L.map, L.flatten));
var it = L.flatMap(
  map((a) => a * a),
  [
    [1, 2],
    [3, 4],
    [5, 6, 7],
  ]
);
log([...it]); // [1, 4, 9, 16, 25, 36, 49]
log(it.next()); // { value: 1, done: false }
log(it.next()); // { value: 4, done: false }
log(it.next()); // { value: 9, done: false }
log(it.next()); // { value: 16, done: false }

// 아래와 같이 만들 수도 있다.
const flatMap = curry(pipe(L.map, flatten));
log(
  flatMap(
    (a) => a,
    [
      [1, 2],
      [3, 4],
      [5, 6, 7],
    ]
  )
); // [1, 2, 3, 4, 5, 6, 7]
log(
  flatMap(
    L.range,
    map((a) => a + 1, [1, 2, 3])
  )
); // [0, 1, 0, 1, 2, 0, 1, 2, 3]

var it = L.flatMap(
  L.range,
  map((a) => a + 1, [1, 2, 3])
);
log(it.next()); // { value: 0, done: false }
log(it.next()); // { value: 1, done: false }
log(it.next()); // { value: 0, done: false }
log(it.next()); // { value: 1, done: false }

log(
  take(
    3,
    L.flatMap(
      L.range,
      map((a) => a + 1, [1, 2, 3])
    )
  )
); // [0, 1, 0]
```

### 2차원 배열 다루기

아래와 같은 2차원 배열을 가지고 flatten이나 기타 지연성을 가진 함수를 조합하여 2차원 배열을 다루는 코드를 작성해보고자 한다.

```jsx
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10],
];
```

먼저 flatten 함수로 배열을 펼칠 수 있다.

```jsx
go(arr, flatten, log); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

여기에서 더 나아가 L.flatten과 filter 함수를 조합하여 홀수만 남길 수 있다.

```jsx
go(
  arr,
  L.flatten,
  filter((a) => a % 2),
  log
); // [1, 3, 5, 7, 9]
```

L.filter를 통해 지연성을 추가해주는 함수를 만들고,

```jsx
go(
  arr,
  L.flatten,
  L.filter((a) => a % 2),
  log
); // Generator {<suspended>}
```

이를 바로 반환하도록 구현하면 아래와 같다.

```jsx
go(
  arr,
  L.flatten,
  L.filter((a) => a % 2),
  takeAll,
  log
); // [1, 3, 5, 7, 9]

go(
  arr,
  L.flatten,
  L.filter((a) => a % 2),
  take(3),
  log
); // [1, 3, 5] - 모든 배열을 순회하지 않고 3가지만 순회 후 멈춘다.
```

map과 reduce까지 적용해보면 아래와 같이 사용할 수 있다.

```jsx
go(
  arr,
  L.flatten,
  L.filter((a) => a % 2),
  L.map((a) => a * a),
  take(3),
  reduce(add),
  log
); // 84
```

### 이터러블 중심 프로그래밍 실무적인 코드

위처럼 기본적인 2차원 배열을 다뤄보았는데, 실무적인 코드에서 해당 함수형 프로그래밍을 활용하는 방법과 우리가 함수형 프로그래밍을 활용해야 하는 이유를 알아보자.

```jsx
var users = [
  {
    name: "a",
    age: 21,
    family: [
      { name: "a1", age: 53 },
      { name: "a2", age: 47 },
      { name: "a3", age: 16 },
      { name: "a4", age: 15 },
    ],
  },
  {
    name: "b",
    age: 24,
    family: [
      { name: "b1", age: 58 },
      { name: "b2", age: 51 },
      { name: "b3", age: 19 },
      { name: "b4", age: 22 },
    ],
  },
  {
    name: "c",
    age: 31,
    family: [
      { name: "c1", age: 64 },
      { name: "c2", age: 62 },
    ],
  },
  {
    name: "d",
    age: 20,
    family: [
      { name: "d1", age: 42 },
      { name: "d2", age: 42 },
      { name: "d3", age: 11 },
      { name: "d4", age: 7 },
    ],
  },
];
```

위와 같은 데이터가 있다고 해보자. 4명의 유저가 있고, 각 유저마다 이름, 나이, 가족 정보가 포함되어 있다.

우리는 지난 시간 만들어보면 지연성 함수를 활용해 유저의 가족 중에 20살이 넘는 4개만 도출해내는 함수를 작성할 수 있다.

```jsx
go(
  users,
  L.flatMap((u) => u.family),
  L.filter((u) => u.age > 20),
  L.map((u) => u.age),
  take(4),
  reduce(add),
  log
); // 158
```

위 2차원 배열 다루기 코드와 크게 다르지 않다. 필요한 속성에만 접근하여 연산을 처리하는 것이다. 이미 충분히 실무에서 사용될 수 있는 형태 예제인 것이다. 함수형 프로그래밍은 데이터를 어떻게 구성할건지를 먼저 만든 후 프로그래밍을 하는 것이 아닌, 이미 조합되어 있는 함수에 맞는 데이터를 구성하는 식으로 프로그래밍을 하는 방법이다. 이에 따라 객체지향 프로그래밍은 데이터를 우선적으로 정의하고 메소드를 이후에 만들면서 작성해나간다면, 함수형 프로그래밍은 이미 만들어진 함수 조합이 있다면 그 함수 조합에 맞는 데이터를 구성하는 것으로, 보다 더 함수가 우선순위에 있으므로 함수형 프로그래밍이라고 불린다.

또한 위 코드는 굉장히 다양한 데이터들을 순회(커버)할 수 있다. users가 아닌 comments, posts 등의 다양한 데이터일 수 있는데 특정 정보를 위한 데이터를 이미 조합되어 있는 함수(L.flatMap, L.filter 등) 를 통해 원하는 결과를 만들어나가는 것이다. 이는 이터러블 중심, 컬렉션 중심, applicative 프로그래밍이라고 하며, 결론적으로 고차함수를 조합하여, 보조함수를 데이터에 적절하게 조합하여 어떤 일을 할 때 추상적으로 일을 처리하도록 사고할 수 있도록 하는 것이 함수형 프로그래밍이라고 할 수 있다.
