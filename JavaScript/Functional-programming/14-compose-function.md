## 안전한 합성에 대하여

### map으로 합성하기

안전한 함수 합성에 대해 알아보자.
아래와 같은 함수가 있다고 했을 떄, 두 함수의 합성은 1 처럼 할 수 있다.

```jsx
const f = (x) => x + 10;
const g = (x) => x - 5;

const fg = (x) => f(g(x)); // 함수 합성
console.log(fg(10)); // 15
console.log(fg()); // NaN
```

그런데 위 두 번쨰 콘솔처럼 fg 함수의 인자에 아무 것도 들어가지 않으면 NaN 이 반환된다.
만약 인자 값이 있을 수도, 없을 수도 있을 떄 함수를 중첩해서 사용하면서도 문제가 안생기고 효율적이게 만들 수 있는 방법은 어떤 게 있을까?

먼저 map으로 합성하는 방법이 있다.

```jsx
// 이터러븦 프로그래밍 방식으로 변환
_.go(10, fg, console.log); // 15

// map을 이용해 모나드(배열) 형태의 함수 합성을 아래와 같이 만들 수 있다.
_.go([10], L.map(fg), _.each(console.log)); // 15
_.go([], L.map(fg), _.each(console.log)); // 아무 일도 일어나지 않는다.
```

위처럼 map을 이용해 인자를 처리하면 만약 빈 데이터이더라도 에러를 뱉지않고 아무것도 반환되지 않는 정상적인 결과를 도출한다.

### find 대신 L.filter 써보기

우리가 흔히 사용하는 `find` 함수도 다시 생각해볼 필요가 있다. 아래와 같은 코드가 있다고 하자.

```jsx
const users = [
  { name: "AA", age: 35 },
  { name: "BB", age: 26 },
  { name: "CC", age: 28 },
  { name: "DD", age: 32 },
  { name: "EE", age: 34 },
];

const user = _.find((u) => u.name == "BB", users);
console.log(user); // {name: 'BB', age: 26}
```

만약 어느날 users 배열에 BB가 사라지면 결과는 어떻게 되는가? undefined가 도출된다.
게다가 user.name이라도 찾는다면 Uncaught TypeError가 뿜어져 나올 것임
이를 개선하기 위한 방법은 아래와 같은 간단한 방법이 있다.

```jsx
const users = [
  { name: "AA", age: 35 },
  // { name: "BB", age: 26 },
  { name: "CC", age: 28 },
  { name: "DD", age: 32 },
  { name: "EE", age: 34 },
];

const user = _.find((u) => u.name == "BB", users);
if (user) {
  console.log(user); // 아예 실행되지 않음
  console.log(user.name); // 아예 실행되지 않음
}
// 혹은 try ~ catch로 묶어준다.
try {
  const user = _.find((u) => u.name == "BB", users);
  console.log(user); // undefined
  console.log(user.name); // 아예 실행되지 않음
} catch (e) {}
```

하지만 이를 좀 더 발전시켜 함수형으로 구현하면 아래와 같이 만들 수 있다.

```jsx
_.each(
  console.log,
  L.take(
    1,
    L.filter((u) => u.name == "BB", users)
  )
);
```

여기에 더해 똑같은 일을 하지만 한 표현식으로 우아하게 개선하는 방법이 있다. (BB값이 없어도 u.age 값 미존재에 대한 오류가 발생하지 않음)

```jsx
_.go(
  users,
  L.filter((u) => u.name == "BB"), // 지연평가를 하므로 불필요한 순회를 하지 않음
  L.map((u) => u.age),
  L.take(1),
  _.each(console.log)
);
```

`find` 함수를 사용해 `undefined`가 도출되는 상태보다는 위처럼 filter와 map을 잘 합성해서 값 유무에 영향을 받지 않는 함수 합성을 하는 것이 바람직하다. 위 함수는 find와 동일한 시간복잡도를 가지며, 완전한 함수 합성을 연속적으로 실행할 수 있는 함수다.
