## 객체지향과 함꼐 사용하기 - 사용자 정의 객체를 이터러블 프로그래밍으로

### Map, Set, NodeList

우리가 자주 사용하는 Map과 Set 자료형도 사실상 사용자 정의 객체와 다르지 않다.

```jsx
let m = new Map();
m.set("a", 1);
m.set("b", 2);
m.set("c", 3);

console.log(m[Symbol.iterator]()); // MapIterator {"a" => 1, "b" => 2, "c" => 3}
console.log([...m.entries()]); // [['a', 1], ['b', 2], ['c', 3]]
console.log([...m.keys()]); // ['a', 'b', 'c']
console.log([...m.values()]); // [1, 2, 3]
```

위와 같이 값을 만들어낼 수 있으므로 어떠한 사용자 정의 객체를 이터러블화하는 과정을 통해
미리 준비되어 있는 이터러블을 지원하는 함수들로 Map, Set도 다룰 수 있다.

```jsx
// Map 데이터에 filter 적용
_.go(
  m,
  L.filter(([k, v]) => v % 2),
  _.takeAll,
  console.log
); // [['a', 1], ['c', 3]]

// Map 데이터 필터링 후 다시 Map 자료형으로 반환
_.go(
  m,
  _.filter(([k, v]) => v % 2),
  (entries) => new Map(entries),
  console.log
); // Map(2) {'a' => 1, 'c' => 3}
```

Set 자료형도 위와 같이 같은 이터러블 프로그래밍을 적용할 수 있다.

```jsx
let s = new Set();
s.add(10);
s.add(20);
s.add(30);

console.log([...s]); // [10, 20, 30]
```

위와 같으므로 합산 금액을 산출하는 경우 아래와 같이 동일하게 구현할 수 있는 것이다.

```jsx
const add = (a, b) => a + b;
console.log(_.reduce(add, s)); // 60
```

### Model, Collection 클래스로 이터러블 프로토콜 지원하기

자바스크립트에서도 이터러블 프로그래밍을 통해 객체지향 프로그래밍을 다룰 수 있다.
이터러블 프로그래밍 즉, 함수형 프로그래밍이 객체지향 프로그래밍을 대체한다라고 생각할 필요는 없음
즉, 큰 그림은 객체 지향으로 구현하고 실제 로직을 구현함에 있어 이터러블 프로그래밍을 다루는 것도 한 방법이다. 예로 사용자 객체를 만들어보자

```jsx
class Model {
  constructor(attrs = {}) {
    this._attrs = attrs;
  }
  get(k) {
    return this._attrs[k];
  }
  set(k, v) {
    this._attrs[k] = v;
    return this;
  }
}

class Collection {
  constructor(models = []) {
    this._models = models;
  }
  at(idx) {
    return this._models[idx];
  }
  add(model) {
    this._models.push(model);
    return this;
  }
}
```

위 클래스에 객체를 추가하면 아래와 같이 만들 수 있음

```jsx
const coll = new Collection();
coll.add(new Model({ id: 1, name: "AA" }));
coll.add(new Model({ id: 3, name: "BB" }));
coll.add(new Model({ id: 5, name: "CC" }));

console.log(coll);
/* [ 0: Model {_attrs: {id: 1, name: "AA"}},
  1: Model {_attrs: {id: 3, name: "BB"}},
  2: Model {_attrs: {id: 5, name: "CC"}} ] */
console.log(coll.at(2).get("name")); // C
console.log(coll.at(1).get("id")); // 3
```

만약 위 코드에서 coll의 model을 순회하는 코드를 만들려면 어떻게 해야할까?

```jsx
_.go(
  L.range(3),
  L.map((i) => coll.at(i)),
  _.map((m) => m.get("name")),
  _.each(console.log)
); // AA, BB, CC
```

위와 같이 조회할 model을 꺼내오는 구문을 추가해줘야 한다.
그렇다면 이러한 방향말고 클래스 객체 내에 직접 iterator를 지원하도록 즉, 컬렉션 자체를 이터러블로 순회할 수 있도록 하면 어떨까?

```jsx
class Collection {
  // ..

  // Iterator 지원 코드 추가
  // 내가 가진 모든 _models를 yield하는 iterator를 생성
  *[Symbol.iterator]() {
    yield* this._models;
  }
  /* 아래와 같이 표현해도 된다.*/
  /* [Symbol.iterator]() {
    return this._models[Symbol.iterator]();
  } */
}
```

그러면 아래와 같은 조회가 쉬워진다.

```jsx
console.log([...coll]); // [Model, Model, Model]
_.go(
  coll,
  _.map((m) => m.get("name")),
  _.each(console.log)
); // AA, BB, CC

_.go(
  coll,
  _.each((m) => console.log(m.set("name", m.get("name").toLowerCase())))
);
// [ 0: Model {_attrs: {id: 1, name: "aa"}},
//	 1: Model {_attrs: {id: 3, name: "bb"}},
//   2: Model {_attrs: {id: 5, name: "cc"}} ]
```
