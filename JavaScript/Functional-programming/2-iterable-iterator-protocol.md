# ES6에서의 순회와 Iterable, Iterator Protocol

### 가. 기존과 달라진 ES6에서의 리스트 순회

- _들어가기에 앞서.._

  함수형 프로그래밍 뿐만 아니라 실무에서 리스트 순회는 매우 중요하다.
  ES6에서는 리스트 순회 사용법에 대한 많은 변화가 있었는데, 어떠한 규약을 통해 리스트 순회가 이루어지는지 상세히 알아보자.

- for 문

  - `for ~ i++` : 기존 ES5에서 리스트 순회는 아래의 방법처럼 했다.

  ```jsx
  const list = [1, 2, 3];
  const str = "abc";

  for (var i = 0; i < list.length; i++) {
    log(list[i]); // 1, 2, 3
  }
  // 유사배열 또한 동일한 방법으로 순회
  for (var i = 0; i < str.length; i++) {
    log(str[i]); // a, b, c
  }
  ```

  - `for ~ of` : ES6에서는 `for ~ of` 문법을 이용해 더 명시적으로 리스트 순회를 할 수 있다.
    - 어떻게 순회하는지를 구체적으로 명령적으로 기술하기 보다는 보다 선언적으로 간결하게 순회한다.

  ```jsx
  const list = [1, 2, 3];
  const str = "abc";

  for (const a of list) {
    log(a); // 1, 2, 3
  }
  for (const a of str) {
    log(a); // a, b, c
  }
  ```

### 나. Array, Set, Map을 통해 알아보는 이터러블 / 이터레이터 프로토콜

- _들어가기에 앞서..._

  자바스크립트에는 Array, Set, Map라는 내장 값들을 가지고 있다.
  이 값들은 모두 for ~ of 문으로 순회할 수 있는데, 이는 모두 이터러블/이터레이터 프로토콜 때문이다.

- Symbol.iterator 란?

  - Symbol은 ES6에서 추가된 타입으로 객체의 키로 사용될 수 있다.

    ```jsx
    const arr = [1, 2, 3];
    log(arr[Symbol.iterator]); // values() { [native code] }

    arr[Symbol.iterator] = null; // arr[Symbol.iterator]를 null로 비우면
    for (const a of arr) log(a); // Uncaught TypeError: arr is not iterable ..
    ```

    - 위 for ~ of 문에서 에러가 발생하는 것을 통해 for ~ of 문이 단순히 배열을 순회하는 것이 아닌 Symbol.iterator과 연관되어 순회하고 있는 것을 추측할 수 있다. (Array, Map, Set 포함)

- Iterable / Iterator Protocol
  - Iterable: iterator를 리턴하는 [Symbol.iterator]()를 가진 값
  - Iterator: { value, done } 객체를 리턴하는 next()를 가진 값
  - Iterable / Iterator Protocol: iterable을 for ~ of, 전개 연산자 등과 함께 동작하도록 한 규약
- _들어가기에 앞서..._
- Array를 통해 알아본 for ~ of

  ```jsx
  const arr = [1, 2, 3]; // Array iterable
  let iter1 = arr[Symbol.iterator](); // Array Iterator
  iter1.next(); // {value: 1, done: false}

  // Iterable / Iterator Protocol로 for ~ of 문에서 동작
  // value의 값을 리턴하다가 done이 true가 되는 순간에 순회를 멈춘다.
  for (const a of iter1) log(a); // 2, 3 - next()로 인해 위에서 한번 호출했으므로
  ```

- Set을 통해 알아본 for ~ of

  ```jsx
  const set = new Set([1, 2, 3]); // Set iterable
  set; // Set {1, 2, 3}
  set[n]; // undefined

  // 일반적인 Array와 다른 방식으로 for ~ of 문이 동작한다는 것을 알 수 있다.
  // Symbol.iterator는 어떤 객체의 키로 사용될 수 있다.
  let iter2 = set[Symbol.iterator](); // Set Iterator
  // Iterable / Iterator Protocol로 for ~ of 문에서 동작
  for (const a of iter2) log(a); // 1, 2, 3
  ```

- Map을 통해 알아본 for ~ of

  ```jsx
  const map = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]); // Map Iterable
  let iter3 = map[Symbol.iterator](); // Map Iterator
  iter3.next(); // {value: Array(2), done: false}
  // iter3.next(); // {value: Array(2), done: false}
  // iter3.next(); // {value: Array(2), done: false}
  // iter3.next(); // {value: undefined, done: true}
  for (const a of map) log(a); // ['b', 2], ['c', 3] - next()로 인해 위에서 한번 호출했으므로

  let mapKeys = map.keys(); // MapIterator {'a', 'b', 'c'}
  // mapKeys.next(); // {value: 'a', done: false}
  // mapKeys.next(); // {value: 'b', done: false}
  // mapKeys.next(); // {value: 'c', done: false}
  for (const a of map.keys()) log(a); // a, b, c
  for (const a of map.values()) log(a); // 1, 2, 3
  for (const a of map.entries()) log(a); // ['a', 1], ['b', 2], ['c', 3]
  ```

### 다. 사용자 정의 이터러블/이터레이터 프로토콜 정의

사용자 정의 이터러블을 구현하면서 이터레이터에 대한 이해도를 높여보자.

```jsx
// 사용자 정의 이터러블이 wellFormed iterator를 반환할 수 있도록 하기 위해서는
// 자기자신 또한 iterator면서 자기 자신을 리턴하도록 해주어야한다. (return this)
// 그래야 중간에 for of문에 들어가더라도 이전까지 진행되었던 자기의 상태에서 계속해서
// next()를 할 수 있도록 만들어두어야 wellformed iterator인 것이다.
const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i === 0 ? { done: true } : { value: i--, done: false };
      },
      [Symbol.iterator]() {
        return this;
      }, // 자기 자신을 리턴하도록 해서 어디에서든 진행상태를 기억하고 next 할 수 있도록 함
    };
  },
};
let iterator = iterable[Symbol.iterator]();
// log(iterator.next()); // {value: 3, done: false}
// log(iterator.next()); // {value: 2, done: false}
// log(iterator.next()); // {value: 1, done: false}
// log(iterator.next()); // {done: true}

for (const a of iterator) log(a); // 3, 2, 1
```

```jsx
const arr2 = [1, 2, 3];
let iter2 = arr2[Symbol.iterator]();
// iter2.next(); // {value: 1, done: false}
log(iter2[Symbol.iterator]() === iter2); // true
// Iterator가 자기 자신을 반환하는 Symbol.iterator 메서드를 가지고 있을 때
// wellFormed iterator, wellFormed Iterable라고 할 수 있다.
for (const a of iter2) log(a); // 2, 3
```

```jsx
for (const a of document.querySelectorAll("*")) log(a);
const all = document.querySelectorAll("*");
let iter3 = all[Symbol.iterator]();
log(iter3.next());
log(iter3.next());
log(iter3.next());
```

- 이터러블/이터레이터 프로토콜은 ES6만이 아니라 여러 환경에서 따르는 규약이다.

  - 오픈소스 라이브러리(이를테면 `immutable.js`) 혹은 자바스크립트에서 순회가 가능한 형태를 가진 값들도 점차 이터러블/이터레이터 프로토콜을 따르고 있다. 브라우저를 구동시키는 Web.api도 이터러블/이터레이터 프로토콜을 따르고 있다.

  ```jsx
  // document.querySelectorAll('*')은 일반 Array가 아니다.
  // nodeList가 모인 유사배열이지만, 이터러블/이터레이터 프로토콜로 인해 for ~ of문에서 동작한다.
  for (const a of document.querySelectorAll("*")) log(a);

  const all = document.querySelectorAll("*"); // nodeList iterable
  let iter3 = all[Symbol.iterator]();
  log(iter3.next()); // {value: html, done: false}
  log(iter3.next()); // {value: head, done: false}
  log(iter3.next()); // {value: link, done: false}
  ```

### 라. 전개 연산자

전개연산자도 마찬가지로 이터러블/이터레이터 프로토콜 규약을 따른다.

```jsx
const a = [1, 2]; // array iterable
const arr = [1, 2, 3];
const set = new Set([1, 2, 3]);
const map = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);

// a[Symbol.iterator] = null; // a is not iterable
log([...a, ...[3, 4]]); // [1, 2, 3, 4]
log([...a, ...arr, ...set, ...map.keys()]); // [1, 2, 1, 2, 3, 1, 2, 3, "a", "b", "c"]
```

위와 같이 ES6에서 이터러블 프로토콜은 매우 중요하다. 이터러블 프로토콜을 정확히 이해하고, 이터러블의 추상을 정확히 다룰 수 있으면 자바스크립트에서 그 값들을 잘 활용하고 다룰 수 있게 된다.
