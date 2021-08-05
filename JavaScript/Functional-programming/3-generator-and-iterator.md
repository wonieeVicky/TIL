# 제너레이터와 이터레이터

### 가. 제너레이터와 이터레이터

- 제너레이터: 이터레이터이자 이터러블을 생성하는 함수, 즉 이터레이터를 리턴하는 함수이다.
  - 자바스크립트는 이 제너레이터를 통해 어떠한 상태(혹은 값)든 순회할 수 있는 이터러블을 만들 수 있다.

```jsx
// 일반함수에 *을 붙여 generator 함수를 만들고, generator는 iterator를 반환한다.
function* gen() {
  yield 1;
  if (false) yield 2;
  yield 3;
  return 100;
}

let iter = gen();
log(iter[Symbol.iterator]() === iter); // true
log(iter.next()); // {value: 1, done: false}
log(iter.next()); // {value: 3, done: false}
log(iter.next()); // {value: 100, done: true}

for (const a of gen()) log(a); // 1, 3 // return 값은 순회하지 않는다.
```

### 나. odds

제너레이터를 활용하여 홀수만 발생시키는 이터레이터를 만들어 순회하는 함수를 만들어본다.

```jsx
// 넘겨준 값으로 부터 시작해서 무한히 값을 만들어내는 제너레이터(이터레이터)
function* infinity(i = 0) {
  while (true) yield i++;
}
// 정해진 제한 l 내의 iter의 값을 반환하는 제너레이터(이터레이터)
function* limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a === l) return;
  }
}
let iter4 = limit(4, [1, 2, 3, 4, 5, 6]);
iter4.next(); // {value: 1, done: false}
iter4.next(); // {value: 2, done: false}
iter4.next(); // {value: 3, done: false}
iter4.next(); // {value: 4, done: false}
iter4.next(); // {value: undefined, done: true}

// 홀수 값을 만들어내는 제너레이터(이터레이터)
function* odd(l) {
  for (const a of limit(l, infinity(1))) {
    if (a & 2) yield a;
  }
}
let iter2 = odds(10);
log(iter2.next()); // {value: 1, done: false}
log(iter2.next()); // {value: 3, done: false}
log(iter2.next()); // {value: 5, done: false}
log(iter2.next()); // {value: 7, done: false}
log(iter2.next()); // {value: 9, done: false}
log(iter2.next()); // {value: undefined, done: true}
// for ~ of 문을 이용해서 홀수값 도출도 가능하다
for (const a of odds(40)) log(a); // 1, 3, 5, 7, ... 37, 39
```

### for ~ of, 전개 연산자, 구조 분해, 나머지 연산자

제너레이터는 이터러블/이터레이터 프로토콜을 따르므로, for ~ of 문이나 전개 연산자, 구조분해, 나머지 연산자 등 자바스크립트에서 이터러블/이터레이터 프로토콜을 따르는 다양한 헬퍼 함수나, 라이브러리와 함께 사용할 수 있다.

```jsx
// 위 odds 함수를 활용해 다양한 헬퍼 함수로 활용될 수 있다.
log(...odds(10); // 1,3,4,7,9
log([...odds(5), odds(10)]); // [1, 3, 5, 1, 3, 5, 7, 9]

const [head, ...tail] = odds(5);
log(head); // 1
log(tail); // [3, 5]

const [a, b, ...rest] = odds(10);
log(a); // 1
log(b); // 3
log(rest); // [5, 7, 9]
```
