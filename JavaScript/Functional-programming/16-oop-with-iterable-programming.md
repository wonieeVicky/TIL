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
