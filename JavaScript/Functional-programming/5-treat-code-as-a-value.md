# 코드를 값으로 다루어 표현력 높여보기

함수형 프로그래밍에서는 코드를 값으로 다루는 아이디어를 많이 사용한다.
코드를 값으로 다룬다는 것은 "어떤 함수가 다른 함수를 받아서 평가하는 시점을 원하는대로 다룰 수 있다."는 의미로, 이를 사용하면 코드의 표현력을 더욱 높일 수 있다.

### 코드를 값으로 다루는 `go`, `pipe` 함수

```jsx
// 아래와 같이 순서대로 인자의 값이 더해지는 reduce 함수를 만들고자 한다. (즉시 값을 평가한다)
const go = (...args) => reduce((a, f) => f(a), args);

// 함수들이 나열되어있는 합성된 함수를 리턴하는 pipe 함수를 만들고자 한다. (함수를 리턴한다)
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

go(
  add(0, 1),
  (a) => a + 1,
  (a) => a + 10,
  (a) => a + 100,
  log
); // 111

const f = pipe(
  (a, b) => a + b,
  (a) => a + 10,
  (a) => a + 100
);
log(f(0, 1)); // 111
```

### go 함수를 사용하여 읽기 좋은 코드로 만들기

- 4에서 다루었던 함수의 중첩(아래 코드 참고)을 개선해본다.

```jsx
const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

const add = (a, b) => a + b;

log(
  reduce(
    add,
    map(
      (p) => p.price,
      filter((p) => p.price < 20000, products)
    )
  )
); // 30000

// 위에서부터 아래로 읽기 좀 더 편해졌다.
// 코드양이 많아졌지만 코드 가독성은 높아졌다. 순서가 변경되었다.
go(
  products,
  (products) => filter((p) => p.price < 20000, products),
  (products) => map((p) => p, price, products),
  (prices) => reduce(add, prices),
  log
); // 30000
```

### `go + curry`를 사용하여 더 읽기 좋은 코드로 만들기

```jsx
// curry라는 함수는 역시 함수를 값으로 다루면서, 받아둔 함수를 원하는 시점에 평가시키는 함수이다.
// 인자가 두 개 이상이라면 받아둔 함수를 즉시 실행
// 인자가 두 개 보다 작다면, 함수를 다시 리턴하여, 그 이후에 받은 이자를 실행한다.
const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

const mult = curry((a, b) => a * b);
mult(1); // (..._) => f(a, ..._);
mult(3)(2); // 6;

// 아래와 같은 패턴으로 사용할 수 있다.
const mult3 = mult(3); // 미리 값을 만들어둔다.
mult3(10); // 30
mult3(5); // 15
mult3(3); // 9

// map, filter, reduce 함수에 curry 함수를 적용하면 아래의 함수를 더 간단히 표현할 수 있다.
// 인자를 하나만 받았을 경우 이후의 인자를 더 받도록 기다리는 함수를 리턴하도록 구성된다.
// 즉, 함수를 부분적으로 실행되어 기다릴 수 있도록 함
const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

// curring을 통해 아래와 간결하게 함수를 간소화할 수 있다
go(
  products,
  filter((p) => p.price < 20000),
  map((p) => p, price),
  reduce(add),
  log
); // 30000

// 위 코드를 이해하기 위해 아래의 구문을 다시 생각해보자
const add1 = (a) => a + 1;
const f1 = (a) => add1(a);
const f2 = add1;
add1(2); // 3
f1(2); // 3
f2(2); // 3
```

### 함수 조합으로 함수 만들기

- `pipe` 함수로 만들어진 코드를 감싸면 중복을 쉽게 제거할 수 있다.
- `predi` 라는 함수를 전달받아 함수를 더 다양하게 사용할 수 있다.
- 함수형 프로그래밍에서는 잘게 나누고, 중복을 제거하는 과정 등의 일련의 과정을 통해 고차함수의 조합을 다양하게 만들 수 있으며, 이를 통해 더 많은 곳에서 사용될 수 있도록 변화시킬 수 있다.

```jsx
// 아래의 코드들은 중복된 코드들이 있다.
go(
	products,
	filter(p => p.price < 20000),
	map(p => p,price),
	reduce(add),
	log
);

go(
	products,
	filter(p => p.price >= 20000),
	map(p => p,price),
	reduce(add),
	log
);

/*  --------------------------------------------------------- */
// 파이프라인으로 만들어진 코드를 굉장히 쉽게 중복을 제거할 수 있다.

const total_price = pipe(
	map(p => p.price),
	reduce(add)
);

// predi 라는 함수를 받아 반환한다.
더 많은 곳에서 사용될 수 있게 변화시킬 수 있다.
const base_total_price = predi => pipe(
	filter(predi),
	total_price,
);
go(
	products,
	base_total_price(p => p.price < 20000),
	log
); // 30000

go(
	products,
	base_total_price(p => p.price >= 20000),
	log
); // 75000
```
