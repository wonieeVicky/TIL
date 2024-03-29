﻿## 객체를 이터러블 프로그래밍으로 다루기

객체를 이터러블 프로그래밍으로 다루는 방법에 대해 알아본다.
먼저 객체는 key, value의 쌍으로 이루어진 데이터 구조를 의미한다. 아래와 같은 객체가 있다고 하자

```jsx
const obj1 = { a: 1, b: 2, c: 3 };
```

이를 배열화 할 수 있는 가장 간단한 방법은 `Object.entries`를 사용해 배열로 변환하는 것이다.

```jsx
var arr = Object.entries(obj1); // [["a", 1], ["b", 2], ["c", 3]]
console.log(arr[Symbol.iterator]); // values(){ [native code] }
console.log(arr[Symbol.iterator]()); // Array Iterator {}
```

위처럼 만들어 배열에 `Symbol.iterator`를 적용하면 이터러블 프로그래밍을 구현할 수 있음. 이터러블 프로그래밍을 이용하는 이유는 무엇인가? 다시한번 상기시켜 보자면 아직 평가가 마치지 않은 상태의 `Iterator`를 만듦으로써 이후 `filter`, `take` 등의 함수를 통해 효율성을 최적화 할 수 있는 여지를 남겨놓기 위함이다. 지연성과 동시성을 함께 사용할 수 있는 이점을 가지기도 한다.

단, 위처럼 같은 크기의 arr 이란 배열을 별도로 만드는 것은 비효율적이므로, `key-value` 구성의 `object`에 동시성, 지연성을 적용할 수 있는 이터러블 프로그래밍 방법을 알아보자

### value

먼저 value를 다루는 방법에 대해 알아보자.  
위 obj1의 value를 모두 더하는 함수를 만든다고 하면 아래와 같이 구현할 수 있다.

```jsx
_.go(
  obj1,
  Object.values, // 즉시 모든 값을 배열로 변환
  _.reduce((a, b) => a + b),
  console.log
); // 6
```

위에서는 `obj1`에서 value만 별도로 `Object.values` 메서드를 사용해 배열로 변환하는데, 즉시 모든 값을 배열로 변환한 뒤 연산을 한다는 특징을 가진다. 이를 이터러블 프로그래밍으로 바꾸면 어떨까?
아래와 같은 함수가 있다.

```jsx
L.values = function* (obj) {
  for (const k in obj) yield obj[k];
};
var it = L.values(obj1);
console.log([...it]); // [1, 2, 3, 4]
```

위 `L.values` 함수는 객체의 값을 순회하면서 iterator를 반환하여 값을 평가할 수 있게 된다.
take 함수를 활용해 아래와 같이 만들 수도 있다.

```jsx
var it2 = L.take(2, it);
console.log([...it2]); // [1, 2]
```

필요한 값만 분리하여 계산해낼 수 있게 되는 것이다. 이를 이용해 처음 구현했던 함수를 고도화 시켜보자

```jsx
_.go(
  obj1,
  L.values, // 평가를 모두 하지 않고 결과를 만들어나갈 수 있음
  L.take(2), // iterable 최소화
  _.map((a) => a + 10),
  _.reduce((a, b) => a + b),
  console.log
); // 23
```

위와 같이 처리하면 평가를 모두하지 않고 결과를 단계별로 만들어나갈 수 있게된다.

위와 같은 방법이 언제나 정답인 것은 아니다. 객체의 값이 obj1과 같이 4개만 있을 경우 지연평가로 하는 방식이 연산에 차이가 없거나 혹은 비용이 더 드는 일이 될 수도 있다. 하지만 객체의 길이가 길어지거나 보조함수가 하는 일이 복잡해질수록 좀 더 유리한 연산이 될 수 있는 것이다.

### entries

이번에는 key, value 들이 들어있는 `entries`는 어떻게 지연평가하도록 만들 수 있을까

```jsx
L.entries = function* (obj) {
  for (const k in obj) {
    yield [k, obj[k]];
  }
};
```

위와 같이 구현할 수 있다. 반환된 iterator에 유의해서 보자

```jsx
var it = L.entries(obj1);
console.log(it.next().value); // ["a", 1]
console.log(it.next().value); // ["b", 2]
console.log(it.next().value); // ["c", 3]
console.log(it.next().value); // undefined
```

위처럼 지연평가가 가능하도록 만들 수 있다. 이를 조합해 values에서 만들었던 함수를 변경해보면 아래와 같다.

```jsx
_.go(obj1, L.entries, _.takeAll, console.log); // [["a", 1], ["b", 2], ["c", 3]]

_.go(obj1, L.entries, _.take(2), console.log); // [["a", 1], ["b", 2]]

_.go(
  obj1,
  L.entries,
  L.filter(([_, v]) => v % 2),
  L.map(([k, v]) => ({ [k]: v })),
  _.each(console.log)
); // {a: 1}, {c: 3}

_.go(
  obj1,
  L.entries,
  L.filter(([_, v]) => v % 2),
  L.map(([k, v]) => ({ [k]: v })),
  _.reduce(Object.assign),
  console.log
); // {a: 1, c: 3}
```

위처럼 다양한 형태로의 도출이 가능해진다!

위와 같이 entries를 이터러블하게 변경하는 이유가 단순히 entries를 어떻게 구현하느냐를 보여주기 위한 것은 아니다. 이터러블하지 않은 값을 어터러블화하게 변경하는 함수를 직접 구현함으로써 이후 이터러블 프로그래밍으로 더욱 효율이 높은 프로그래밍을 만들어 나갈 수 있도록 하기 위한 사례를 보여주기 위함임

주어진 값이 어떤 형태, 어떤 구조를 가지던지 이터러블 프로그래밍으로 응용해나갈 수 있어야 한다.

### keys

keys도 앞선 경우와 비슷하게 구현할 수 있다.

```jsx
L.keys = function* (obj) {
  for (const k in obj) {
    yield k;
  }
};

_.go(obj1, L.keys, _.each(console.log)); // a, b, c
```

이처럼 values, entries, keys를 이터러블하게 변경할 수 있다는 것을 가벼운 사례로 알아보았다.
그렇다면 위 지연평가를 바탕으로 어떻게 응용해나갈 수 있을지 살펴보자

### 어떤 값이든 이터러블 프로그래밍으로 다루기

여태까지 다양한 객체 형태를 제너레이터를 이용해 iterator로 만들어서 iterable programming을 구현해보았다. 위처럼 실제 만들어져있는 메서드를 이용할 뿐만 아니라 어떤 값이든 혹은 어떤 제너레이터든 iterator로 만들어 이터러블 프로그래밍을 할 수 있다.

```jsx
const it1 = (function* () {
  yield 10;
  yield 20;
  yield 30;
})();

// console.log([...it]); // [10, 20, 30]
console.log(it1.next()); // { value: 10, done: false }
console.log(it1.next()); // { value: 20, done: false }
console.log(it1.next()); // { value: 30, done: false }
console.log(it1.next()); // { value: undefined, done: true }
```

위처럼 어떠한 함수를 즉시 실햄함수를 만들어 값으로 사용할 수 있다.
이러한 함수에는 아래와 같이 조건을 추가할 수도 있다.

```jsx
const it_2 = (function* () {
  let i = -1;
  while (++i < 5) {
    // 조건을 추가해준 제너레이터
    yield 10;
    if (false) yield 20 + 30;
    yield 30;
  }
})();

console.log([...it_2]); // [10, 30, 10, 30, 10, 30, 10, 30, 10, 30]
```

위 함수에 인자를 전달받도록 구현할수도 있겠다.

```jsx
const g1 = function* (stop) {
  let i = -1;
  while (++i < stop) {
    yield 10;
    if (false) yield 20 + 30;
    yield 30;
  }
};

console.log([...g1(3)]); // [10, 30, 10, 30, 10, 30]
console.log([...L.take(3, g1(3))]); // [10, 30, 10], 어디까지 평가할 것인가를 평가할 수 있음

_.go(
  g1(10),
  _.reduce((a, b) => a + b),
  console.log
); // 400
_.go(
  g1(10),
  L.take(1),
  _.reduce((a, b) => a + b),
  console.log
); // 10
// 위처럼 어떠한 코드도 값으로 다뤄질 수 있다.
// 제너레이터를 이용해 map, filter, reduce를 이용해 이터러블 프로그래밍을 다룰 수 있다.
```

위 코드처럼 어떠한 함수도 어떠한 코드도, 값으로 다뤄질 수 있다는 것이 포인트 👩🏻‍🏫
어떤 상황에서든 map,filter, reduce 등의 제너레이터 함수를 활용함으로서 이터러블 프로그래밍을 다룰 수 있다.

### Object

```jsx
const a = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
]; // 해당 값을
const b = { a: 1, b: 2, c: 3 }; // 아래 형태로 바꾸는 일을 한다.
```

위 2차원 배열을 b와 같은 객체로 변환하는 `Object`함수를 만들어보려고 한다.

```jsx
**const object = (entries) =>
_.go(
  entries,
  L.map(([k, v]) => ({ [k]: v })),
  _.reduce(Object.assign),
  console.log
);
object(a); // {a: 1, b: 2, c: 3}**
```

위 함수는 `reduce` 함수 하나만 사용해서 구현할수도 있다.

```jsx
const object2 = (entries) => _.reduce((obj, [k, v]) => ((obj[k] = v), obj), {}, entries);
console.log(**object2**(a)); // {a: 1, b: 2, c: 3}
console.log(object2(L.entries({ b: 2, c: 3 }))); // {b: 2, c: 3}
```

object 함수는 또한 커스텀 메서드인 Map에서도 동작이 가능하다.

```jsx
let m = new Map();
m.set("a", 10);
m.set("b", 20);
m.set("c", 30);
console.log(m); // {"a" => 10, "b" => 20, "c" => 30}
console.log(JSON.stringify({ a: 1, b: 1 })); // "{"a":1,"b":1}"
console.log(JSON.stringify(m)); // "{}", Map 메서드의 값은 stringify가 안됨
```

object2 와 같은 제너레이터 함수로 감싸주면 그 안에서는 언제든지 구현이 가능한 것이다.

```jsx
**console.log(JSON.stringify(object2(m))); // "{"a":1,"b":20,"c":30}", object2로 감싸주면 가능**
```

위처럼 **`object`는 다형성이 높은 함수이다. 표준만 맞는 이터러블만 들어온다면 모두 객체로의 구현이 가능함**

### mapObject

이번에는 두 개의 인자로 새로운 객체를 반환하는 `mapObject` 함수를 만들면서 이터러블 프로그래밍을 확장해보자.

```jsx
// mapObject는 아래와 같은 결과를 도출하는 함수이다.
mapObject((a) => a + 10, { a: 1, b: 2, c: 3 }); // { a: 11, b: 12, c: 13}
```

기존의 함수 합성으로 위 문제를 쉽게 개선할 수 있다. 아래과 같은 순서를 가진 사고를 가져보자.

1. [['a', 1], ['b', 2], ['c', 3]]를 entries로 다룬다.
2. [['a', 11], ['b', 12], ['c', 13]] 로 값을 바꾼다.
3. {a: 11}, {b: 12}, {c: 13}, 객체로 변환
4. {a: 11, b: 12, c: 13}, 객체로 합친다.

위 사고를 기존에 만들어놓은 함수 합성으록 구현하면 아래와 같다.

```jsx
const mapObject = (f, obj) =>
  _.go(
    obj,
    L.entries,
    _.map(([k, v]) => [k, f(v)]), // [['a', 11], ['b', 12], ['c', 13]]
    object, // {a: 11, b: 12, c: 13}
    console.log
  );

mapObject((a) => a + 10, { a: 1, b: 2, c: 3 }); // {a: 11, b: 12, c: 13}
```

### pick

`pick` 함수는 선택된 key, value만 꺼내서 반환하는 함수이다.

```jsx
const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const pick = (ks, obj) => {
  /* ... */
};
console.log(pick(["b", "c"], obj2)); // { b: 2, c: 3 }
```

위 문제를 해결하기에 앞서 순회를 할 대상을 찾는 것이 중요하다.
obj를 순회할 것인가? 아니면 ks를 순회할 것인가? 무엇이 더 좋은지는 상황에 따라 달라질 수 있다.
주어진 obj의 길이가 줄어들 수도 있고, ks의 길이가 길어질 수도 있는 것이다.
이러한 상황에 따라 성능이 차이가 있을 수 있음.

하지만 함수명 pick의 성격으로 봤을 떄 대체적으로 주어지는 obj 값보다
비교인자로 주어지는 ks의 길이가 더 짧을 경우가 많으므로, ks를 중심으로 순회해본다.

```jsx
const pick = (ks, obj) =>
  _.go(
    ks,
    L.map((k) => [k, obj[k]]),
    object
  );

// 혹은 go 함수를 제외하고 아래처럼 작성할 수도 있음
// const pick = (ks, obj) => object(L.map((k) => [k, obj[k]], ks));

console.log(pick(["b", "c"], obj2)); // { b: 2, c: 3 }
```

만약 없는 값을 찾을 경우에는 어떻게 하면 좋을까? 지금 구조에서는 아래와 같이 된다.

```jsx
console.log(pick(["b", "c", "z"], obj2)); // {b: 2, c: 3, z: undefined}
```

undefined라는 값이 그대로 존재해도 상관없는 경우는 그냥 두겠지만 이는 근본적으로 옳지않다. 왜?
undefined는 런타임에서 최대한 배제하는 것이 좋은 값이기 때문. 그 이유는 아래에서 보면 알 수 있음

```jsx
var obj3 = { b: 3, c: 3, z: undefined };
JSON.stringify(obj3); // "{"b":2,"c":3}"
```

위처럼 JSON에는 undefined라는 값이 없으므로 서버로 전달할 방법이 없기 때문이다.
undefined는 DB에도 저장이 안되고, 서버로도 전달되지 않으며, 서버에서 프론트엔드로 가져올 수도 없는 값이다.

따라서 undefined란 값은 어떤 롲기의 구분자로만 사용하되 실제 값으로서 정의해서 사용하지 않는 것이 바람직하다. 따라서 pick 함수를 아래와 같이 개선하면 undefined에 대응하는 함수로 만들 수 있다.

```jsx
const pick = (ks, obj) =>
  _.go(
    ks,
    L.map((k) => [k, obj[k]]),
    L.reject(([k, v]) => v === undefined),
    object
  );

console.log(pick(["b", "c", "z"], obj2)); // {b: 2, c: 3}
```

### indexBy

`indexBy` 함수는 아래의 users와 같은 값을 key, value 쌍으로 만들어 데이터 조회 비용을 줄이기 위한 함수이다.

```jsx
const users = [
  { id: 5, name: "AA", age: 35 },
  { id: 10, name: "BB", age: 25 },
  { id: 19, name: "CC", age: 32 },
  { id: 23, name: "DD", age: 23 },
  { id: 24, name: "EE", age: 33 },
];

console.log(_.indexBy((u) => u.id, users));
/* { 5: { id: 5, name: "AA", age: 35 },
    10: { id: 10, name: "BB", age: 25 },
    19: { id: 19, name: "CC", age: 32 },
    23: { id: 23, name: "DD", age: 23 },
    24: { id: 24, name: "EE", age: 33 }}; */
```

위와 같이 변경했을 때 이점은 무엇인가? 위와 같이 변경하면 값을 모두 순회하는 것을 초기 한번만 진행 후 이후 데이터 조회가 간편해지는 장점을 지닌다. 데이터 조회를 할 일이 많은 데이터일 경우 `indexBy` 함수를 활용하는 것이 훨씬 더 효율적인 코드가 될 것이다.

```jsx
const users2 = _.indexBy((u) => u.id, users);
console.log(users2[5]); // {id: 5, name: 'AA', age: 35}, 직접 find 메서드를 쓰지 않고 index key로 값을 찾음
```

`indexBy` 함수는 reduce 함수를 활용해서 만들 수 있다. (아래 로직을 여러번 생각해보자)

```jsx
_.indexBy = (f, iter) => _.reduce((obj, a) => ((obj[f(a)] = a), obj), {}, iter);

const user2 = _.indexBy((u) => u.id, users);
console.log(user2);
/* { 5: { id: 5, name: "AA", age: 35 },
    10: { id: 10, name: "BB", age: 25 },
    19: { id: 19, name: "CC", age: 32 },
    23: { id: 23, name: "DD", age: 23 },
    24: { id: 24, name: "EE", age: 33 }}; */
```

### indexBy 된 값을 filter 하기

보통 배열 데이터에서 조건 필터링을 하려면 아래와 같이 한다.

```jsx
// 나이가 30이상인 경우로 필터링
console.log(_.filter(({ age }) => age >= 30, users));
```

하지만 이미 `indexBy`로 특정 `key` 값에 정렬된 데이터의 경우 위와 같은 방법으로 정렬하면 빈 배열이 반환된다.

```jsx
const users3 = _.indexBy((u) => u.id, users);
console.log(_.filter(({ age }) => age >= 30, users3)); // []
```

이를 어떻게 하면 개선할 수 있을까?

```jsx
const users4 = _.go(
  users3, // indexBy 된 값을 가져와서
  L.entries, // 다시 배열로 변환한 뒤 [key, {id: "", name: "", age: ""}]
  L.filter(([_, { age }]) => age >= 30), // 원하는 조건에 필터링
  L.take(2), // 한 값 중 2개만 뽑아
  object, // 다시 object로 변환하여 값 도출
  console.log
);
console.log(users3[19]); // {id: 19, name: 'CC', age: 32}
```

위 과정에서 지연평가를 도입하면 실제 필요한 만큼만 최소한으로 순회하여 결과를 도출할 수 있으므로 훨씬 바람직함
