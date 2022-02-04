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

### Product, Products - 메서드를 함수형으로 구현하기

앞서 만든 Model과 Collection 클래스를 상속받은 Product, Products 클래스를 만들어보면서 객체 지향 프로그래밍에 함수형 프로그래밍, 즉 이터러블 프로그래밍과의 조합성에 대해 어떻게 구현할 수 있는지 더 알아보자

```jsx
class Product extends Model {}
class Products extends Collection {
  // Product의 모든 값을 합산
  totalPrice() {
    // 1. 기본적인 방법
    let total = 0;
    this._models.forEach((product) => {
      total += product.get("price");
    });
    return total;
  }
}

const products = new Products();
products.add(new Product({ id: 1, price: 10000 })); // 10000
console.log(products.totalPrice());
products.add(new Product({ id: 3, price: 25000 })); // 35000
console.log(products.totalPrice());
products.add(new Product({ id: 5, price: 35000 })); // 70000
```

Product의 모든 값을 합산하는 함수를 totalPrice라는 사용자 정의 함수로 넣었을 때 가장 기본적인 방법은 위와 같다. forEach로 각 값을 순회 및 합산하여 값을 도출하는 방식이다.

이를 위와 같은 for문이나 i++ 등으로 순회하여 연산하는 것이 아닌 함수형 프로그래밍으로 구현할 수 있다.
왜? Collection 함수에 Iterator 지원코드를 추가해두었기 때문!

```jsx
class Products extends Collection {
  // Product의 모든 값을 합산
  totalPrice() {
    console.log([...this]); // [Model, Model, Model]
    // 2. go 함수를 이용
    return _.go(
      this,
      L.map((p) => p.get("price")),
      _.reduce((a, b) => a + b)
    );
  }
}
```

사실 위와 같은 코드는 간단하므로 굳이 `go 함수`로 감싸지 않아도 된다.

```jsx
class Products extends Collection {
  getPrices() {
    return _.map((p) => p.get("price"), this); // 경우에 따라 L.map 처리
  }
  totalPrice() {
    // return _.reduce((a, b) => a + b, L.map((p) => p.get("price"), this);
    const add = (a, b) => a + b; // 별도 분리
    const addAll = _.reduce(add); // 별도 분리
    return addAll(this.getPrices());
  }
}
```

위와 같이 하면 아래와 같은 결과값을 도출할 수도 있다.

```jsx
console.log(products.totalPrice()); // 70000

// getPrices가 즉시평가일 경우(_.map)
console.log(products.getPrices()); // [10000, 25000, 35000]

// getPrices가 지연평가일 경우(L.map)
const it = products.getPrices();
console.log(it.next()); // {value: 10000, done: false}
console.log(it.next()); // {value: 25000, done: false}
console.log(it.next()); // {value: 35000, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

위와 같이 객체지향 프로그래밍과 이터러블 프로그래밍을 조합으로 더 좋은 코드를 구현할 수 있음 !
