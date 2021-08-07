# map, filter, reduce

함수형 프로그래밍에서 map, filter, reduce 함수는 실용적으로 자주 사용되는 함수이다.

### 가. map

```jsx
const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

// 만약 name만 따로, price만 따로 분리하려면 어떻게 할까?
// 일반적인 문장형은 : 직접적으로 가져올 데이터를 명시한다.
let names = [];
for (const p of products) {
  name.push(p.name);
}
log(names); // ['반팔티', '긴팔티', '핸드폰케이스' , '후드티', '바지']
let prices = [];
for (const p of products) {
  prices.push(p.price);
}
log(prices); // [15000, 20000, 15000, 30000, 25000]

// map을 활용한 이터러블형은 : 보조함수를 통해 가져올 데이터를 추상화한다.
// 함수형 프로그래밍에서는 함수가 인자와 리턴값으로 소통하는 것을 권장한다.
const map = (f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a)); // {name: '~~'} => ~~
  }
  return res;
};
log(map((p) => p.name, products)); // ['반팔티', '긴팔티', '핸드폰케이스' , '후드티', '바지']
log(map((p) => p.price, products)); // [15000, 20000, 15000, 30000, 25000]
```

### 나. 이터러블 프로토콜을 따른 map의 다형성 1

- 브라우저에서 사용되는 `web api`나 헬퍼 함수도 `ECMAScript`의 이터레이터/이터러블 프로토콜을 따르고 있고, 앞으로 계속해서 이러한 방향으로 만들어질 것으로 판단. 그렇기 때문에 이터러블 프로토콜을 따르는 함수들을 사용하는 것은 앞으로 다양한 헬퍼 함수와의 조합성이 좋아진다는 의미이기도 하다.
- 아래와 같이 map을 통한 이터러블 프로토콜을 따르면, 훨씬 더 유연하고 다형성이 높은 개발을 할 수 있다.

```jsx
log([1, 2, 3].map(a => a + 1)); // [2, 3, 4]
// document.querySelectorAll은 Array를 상속받는 객체가 아니기 때문에 map함수가 프로토타입에 없다.
log(document.querySelectorAll('*').map(el => el.nodeName)); // undefined

// 그러나 위에서 만든 map 함수를 사용하면 잘 동작한다. => 이터러블 프로토콜을 잘 따르고 있기 때문
log(map(el => el.nodeName, document.querySelectorAll('*'))); // ["HTML", "HEAD", ...]

// 실제 이터러블 프로토콜을 잘 따르고 있음
const it = document.querySelectorAll('*')[Symbol.iterator]();
log(it.next()); // {value: html, done: false}
log(it.next()); // {value: head, done: false}

// generator 함수의 결과값에도 map을 할 수 있다. -> 사실상 모든 것에 map이 가능하다.
function *gen(){
	yield 2;
	if(false) yield 3;
	yield 4;
}
log(map(a => a * a, gen()); // [4, 16]
```

### 나. 이터러블 프로토콜을 따른 map의 다형성 2

- new Map()을 통해 전혀 다른 Map 함수를 만들어 낼 수도 있다.

```jsx
let m = new Map();
m.set("a", 10);
m.set("b", 20);
const it = m[Symbol.iterator]();
// it.next(); // {value: Array(2), done: false} -> ['a', 10]
// it.next(); // {value: Array(2), done: false} -> ['b', 20]
// it.next(); // {value: undefined, done: true}

// 위처러 it는 이터레이터이므로 아래처럼 새로운 Map함수를 만들어 낼 수도 있다.
log(new Map(map(([k, a]) => [k, a * 2], m))); // Map(2) {'a' => 20, 'b' => 40}
```

### 다. filter

- filter 함수 역시 이터러블 프로토콜을 따르며, 아래의 예시처럼 중복을 제거하는 함수를 만들어 쓸 수 있다.

```jsx
const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

// 기존에는 20000원 이상, 20000원 미만의 상품을 걸러낼 때 아래와 같이 작업했었다.
let under20000 = [];
for (const p of products) {
  if (p.price < 20000) under20000.push(p);
}
log(...under20000); // {name: '반팔티', price: 15000}, {name: '핸드폰케이스', price: 15000}

let over20000 = [];
for (const p of products) {
  if (p.price > 20000) over20000.push(p);
}
log(...over20000); // {name: '후드티', price: 30000},	{name: '바지', price: 25000}

// 그러나 이터러블 프로토콜을 따른 filter 함수를 이용하면 중복을 제거할 수 있다.
const filter = (f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
};
log(...filter((p) => p.price < 20000, products)); // {name: '반팔티', price: 15000}, {name: '핸드폰케이스', price: 15000}
log(...filter((p) => p.price > 20000, products)); // {name: '후드티', price: 30000},	{name: '바지', price: 25000}
log(filter((n) => n % 2, [1, 2, 3, 4])); // [1, 3]
log(
  filter(
    (n) => n % 2,
    (function* () {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    })()
  )
); // [1, 3, 5]
```

### 라. reduce

- reduce 는 값을 축약하는 함수이다.

```jsx
const nums = [1, 2, 3, 4, 5];
let total = 0;
// 어떤 특정한 값을 계속해서 순회하면서 하나의 값으로 누적해나갈 때 아래와 같이 사용했었다.
for (const n of nums) {
  total = total + n;
}
log(total); // 15

// 우리는 실제 아래와 같은 코드를 reduce 함수를 통해 구현해야 한다.
const add = (a, b) => a + b;
log(add(add(add(add(add(0, 1), 2), 3), 4), 5)); // 15

// reduce 함수를 만들어보자
const reduce = (f, acc, iter) => {
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};
log(reduce(add, 0, [1, 2, 3, 4, 5])); // 15

// acc(시작하는 값)없이 사용하는 reduce 함수
// reduce(add, [1, 2, 3, 4, 5])일 경우 => reduce(add, 1, [2, 3, 4, 5])로 변경해버림
// acc가 없는 상태에서도 시작값을 0으로 하여 동일한 15가 나오도록 만들어준다.
const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value; // 첫번쨰 수를 뽑아써야하므로
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

log(reduce(add, [1, 2, 3, 4, 5])); // 15
```

- reduce 함수도 역시 보조함수를 통해 안쪽의 값에 다형성을 잘 지원해준다.

```jsx
const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];
const add = (a, b) => a + b;
const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value; // 첫번째 수를 뽑아써야하므로
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

reduce((total_price, product) => total_price + product.price, 0, products); // 105000
```

### 마. map + filter + reduce 중첩 사용과 함수형 사고

- 아래의 내용을 보면서, 함수의 중첩 사용과 함수형 사고란 어떤 것인지 살펴보자

```jsx
const log = console.log;

const map = (f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
};

const filter = (f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
};

const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
};

const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

const add = (a, b) => a + b;

// 상품 가격이 20,000원 이하인 상품의 총 합계 - 방법 1
log(
  reduce(
    add,
    map(
      (p) => p.price,
      filter((p) => p.price < 20000, products)
    )
  )
);

// 위 내용에서 filter((p) => p.price < 20000, products)은
// [{ name: "반팔티", price: 15000 }, { name: "핸드폰케이스", price: 15000 }]와 같다.
// 함수형 사고란 위의 특정 조건으로 평가된 정보가 들어올 것을 미리 설계하여 사고하는 것을 말한다.

// 순서를 바꿔 처리할 수도 있다.
// 상품 가격이 20,000원 이하인 상품의 총 합계 - 방법 2
log(
  reduce(
    add,
    filter(
      (n) => n < 20000,
      map((p) => p.price, products)
    )
  )
);
```
