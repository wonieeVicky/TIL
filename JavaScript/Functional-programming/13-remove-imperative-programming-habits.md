## 명령형 습관 지우기 + reduce 절제하기

### reduce + 복잡한 함수 + acc < map + 간단한 함수 + reduce

함수형 프로그래밍을 구현하면서 reduce를 자유자재로 사용할 수 있게되면서, 모든 함수를 reduce로 구현하는 습관을 가지게 된다. 이는 명령형 코딩 습관이 남아있기 때문이기도 하다. reduce를 통해 모두 구현하면 보조함수 또한 복잡해지게 된다. 이러한 관점에 대해 더 알아보자.

아래와 같은 users 데이터에 모든 나이를 합산하는 코드를 짜본다.

```jsx
const users = [
  { name: "AA", age: 35 },
  { name: "BB", age: 30 },
  { name: "CC", age: 25 },
  { name: "DD", age: 34 },
  { name: "EE", age: 38 },
];
_.reduce((total, u) => total + u.age, 0, users); // 162
```

위 코드는 users가 어떻게 생겼는지를 분석해서 그 데이터에 맞춰 보조함수를 만들게 된다. 또한 시작값을 합산하여 결과를 도출해내는 구조이다. 그러나 더 좋은 구조는 시작값이 없는 함수라고 할 수 있다.

```jsx
// 가령 예를들면 아래와 같다. 시작값이 없음
_.reduce((a, b) => a + b, [1, 2, 3]); // 6
```

위처럼 같은 데이터 형이 올 때에는 시작값을 별도로 주지 않을 수 있다. 즉, 보조함수에서 복잡하게 처리하는 것보다 reduce에 넣기 전에 모든 데이터를 한가지 형으로 존재하도록 해주면 복잡한 형태가 나오지 않게 되는 것이다. 이를테면 아래와 같이 만들 수 있다.

```jsx
_.reduce(
  (a, b) => a + b,
  L.map((u) => u.age, users)
);

// 좀 더 발전시키면 아래와 같이 할 수도 있다.
const add = (a, b) => a + b; // 인자를 모두 더하는 보조함수
const ages = L.map((u) => u.age); // 나이만 뽑는 보조함수

_.reduce(add, ages(users)); // 162
```

위처럼 add로 함수를 분리할 수 있는 것은 하나의 형으로 정리되었기 때문이다.  
만약 명령형으로 작성된 위 reduce 함수의 `(total, u) => total + u.age;` 를 별도 함수로 분리한다면, 함수명을 짓기도 애매하고, 재사용될 것이라는 기대를 갖기에도 어렵다.

즉, 여러가지 코드를 만들어갈 때 `reduce` 함수 하나에 복잡도를 높이는 것보다, `map`과 함께 사용해서 `reduce`의 축약 함수를 더 간단하고 단순하게 만드는 방식으로 처리하는 것이 `Lisp`으로 프로그래밍하는 더 바람직한 방법이라고 할 수 있다.

### reduce 하나보다 map + filter + reduce

조금 더 복잡한 Reduce 함수를 만들어보자. 만약 user의 age가 30 이상 유무에 따라 분기처리를 한다면 아래와 같이 처리할 수 있다.

```jsx
_.reduce((total, u) => (u.age >= 30 ? total : total + u.age), 0, users); // 25
```

위 함수는 3항 연산자를 사용해 조금 더 간결해보이는 코드일 뿐 실제 로직은 복잡도가 개선되지 않았다. 사이사이의 로직으로 인해 에러에 대해 좀 더 신경써서 코딩을 해야하는 단점이 있는 것이다. 이때 `map`, `filter`함수를 섞어서 사용하면 훨씬 로직을 가볍게 만들 수 있다.

```jsx
const add = (a, b) => a + b; // 인자를 모두 더하는 보조함수

console.log(
  _.reduce(
    add,
    L.map(
      (u) => u.age,
      L.filter((u) => u.age < 30, users)
    )
  )
);

// 혹은
console.log(
  _.reduce(
    add,
    L.filter(
      (n) => n < 30,
      L.map((u) => u.age, users)
    )
  )
);
```

### query

query, queryToObject 를 사용해서 reduce 안의 보조함수를 간소화하는 것에 대한 중요성을 살펴보자.
아래와 같은 `obj1` 객체를 문자열 쿼리 로 변환하는 함수를 만들어보고자 한다.

```jsx
const obj1 = {
  a: 1,
  b: undefined,
  c: "CC",
  d: "DD",
};
// a=1&c=CC&d=DD 형태로 만드는 함수를 만들어보자
```

명령형으로 구현하면 아래와 같이 만들 수 있다.

```jsx
function query1(obj) {
  let res = "";
  for (const k in obj) {
    // console.log(k); // a, b, c, d
    const v = obj[k];
    if (v === undefined) continue; // undefined는 skip
    if (res != "") res += "&";
    res += k + "=" + v; //
  }
  return res;
}
console.log(query1(obj1)); // a=1&c=CC&d=DD
```

위의 함수를 함수형으로 변환해보면 아래와 같이 바꿀 수 있다.

```jsx
function query2(obj) {
  return Object.entries(obj).reduce((query, [k, v], i) => {
    if (v === undefined) return query;
    return `${query}${i > 0 ? "&" : ""}${k}=${v}`;
  }, "");
}
console.log(query2(obj1)); // a=1&c=CC&d=DD
```

위 reduce 함수에서 i를 의존하여 if문 조건 분기를 치는 건 아무래도 복잡한 감이 있다고 볼 수 있다.
