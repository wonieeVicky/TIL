﻿## 시간을 이터러블로 다루기

### range와 take의 재해석

range와 take 함수는 아래와 같은 일을 도출해낸다.

```jsx
_.go(
  _.range(10), // 0부터 9까지의 배열
  _.take(3), // 앞에서 3개만 자르기
  console.log
); // [0, 1, 2]
```

위 함수를 이터러블로 다루면 아래와 같이 할 수 있다.

```jsx
_.go(
  L.range(10), // 0부터 9까지의 이터러블, 최대 10번 일어날 일이 예약된다. 10개의 배열을 만들겠다가 아닌 계획을 의미함
  L.take(3), // 최대 3개의 값을 필요로 하고, 최대 3번의 일을 수행한다.
  console.log
); // takeLazy{<suspended>}
```

위 range와 take의 함수는 성격이 약간 다르다.

```jsx
_.go(
  L.range(Infinity), // 몇 번 일어날지는 알 수 없다.
  L.take(3), // 최대 3개의 값을 필요로하고, 최대 3번의 일을 수행하도록 최적화 한다.
  _.each(console.log)
); // 0, 1, 2
```

만약 range함수에 Infinity가 들어가게 된다면, 몇 번 일어날지 알수 없으며, 그러한 값에 take 함수로 3번의 제한을 두게되는 프로그래밍을 할 수 있게 된다. 실제 console.log로 찍히는 값은 일반 함수나 지연평가 함수나 똑같기 때문에 크게 와닿지 않을 수 있으나, 지연평가의 경우 실행의 흐름이 수직으로 흐르기 때문에, `L.range(1) → L.take(1) → console.log → L.range(2) → L.take(2) → console.log → ...` 훨씬 효율적이라고 볼 수 있다.

```jsx
_.go(
  L.range(1, 10),
  L.map(_.delay(1000)),
  L.filter((a) => a % 2),
  L.map((_) => new Date()),
  L.take(3), // 전략적으로 _.take, L.take를 나눠쓸 수 있음
  _.each(console.log)
);
// Sat Feb 05 2022 23:42:01 GMT+0900 (한국 표준시)
// Sat Feb 05 2022 23:42:03 GMT+0900 (한국 표준시)
// Sat Feb 05 2022 23:42:05 GMT+0900 (한국 표준시)

// L.take를 쓸면 스케줄러처럼 값이 모두 이후에 평가되도록 처리할 수 있음
// _.take를 쓰면 앞선 일들을 모두 모아낸 후 3개를 뽑아낼 수 있음 즉, 전략적으로 코드를 짤 수 있다.
```

위 코드처럼 시점을 이터러블 프로그래밍 사고로 바라보면 시점에 따른 다양한 액션을 구현할 수 있으므로, 더 많은 로직을 구성하고 만드는 언어로서 핸들링할 수 있게 된다.

### takeWhile, takeUntil

`takewhile`, `takeUntil`은 동적으로 일어나는 일들을 더욱 효과적으로 제어할 수 있다.
조건에 따라 함수들이 어떻게 일을 하는지 알아보자

```jsx
_.go(
  [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  L.takeWhile((a) => a), // 값이 true일 때만 전달해주는 역할을 함
  _.each(console.log)
); // 1, 2, 3, 4, 5, 6, 7, 8
```

`takeWhile`은 위처럼 값이 `true`일 때만 값을 전달해주는 역할을 수행한다.

```jsx
_.go(
  [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  L.takeUntil((a) => a), // 값이 true인 경우 멈추게된다.
  _.each(console.log)
); // 1

_.go(
  [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0],
  L.takeUntil((a) => !a),
  _.each(console.log)
); // 1, 2, 3, 4, 5, 6, 7, 8, 0

_.go(
  [0, false, undefined, null, 10, 20, 30],
  _.takeUntil((a) => a),
  _.each(console.log)
); // 0, false, undefined, null, 10
```

반면 `takeUntil`은 값이 `true`인 경우를 만나면 해당 값까지 반환한 뒤 멈추는 역할을 수행한다.

### 자동차 경주 - 할 일들을 이터러블(Lisp)으로 바라보기

실제 일어나야 하는 일을 조절하는 것을 이터러블 프로그래밍으로 구현해보자

```jsx
// track이 있고, 자동차 경주를 한다. - 각 조를 의미
const track = [
  { cars: ["철수", "영희", "철희", "영수"] },
  { cars: ["하든", "커리", "듀란트", "탐슨"] },
  { cars: ["폴", "어빙", "릴라드", "맥컬럼"] },
  { cars: ["스파이더맨", "아이언맨"] },
  { cars: [] },
];
```

만약 길이가 4인 조만 꺼내어 각 조의 멤버에게 출발! 을 외치고 싶다면 어떻게 할까?

```jsx
_.go(
  L.range(Infinity), // 언제 끝날지는 모르지만 연속적으로 yield를 한다. (계속 리스트가 추가되는 경우)
  L.map((i) => track[i]), // 트랙을 꺼낸다.
  L.map(({ cars }) => cars), // cars 배열만 꺼낸다.
  L.map(_.delay(2000)), // 2초에 한번씩 동작한다.
  L.takeWhile(({ length: l }) => l == 4), // 길이가 4인 것만 꺼낸다.
  L.flat, // 철수, 영희, 철희, 영수.. 배열을 풀어서 반환함
  L.map((car) => `${car} 출발!`),
  _.each(console.log)
);
// 2초 후
// 철수 출발!
// 영희 출발!
// 철희 출발!
// 영수 출발!

// 2초 후
// 하든 출발!
// 커리 출발!
// 듀란트 출발!
// 탐슨 출발!

// 2초 후
// 폴 출발!
// 어빙 출발!
// 릴라드 출발!
// 맥컬럼 출발!
```

만약 길이가 4보다 처음 작을 때까지 일을 반복해야 한다면 `takeWhile` 대신 `takeUntil`을 사용한다.

```jsx
_.go(
  L.range(Infinity), // 언제 끝날지는 모르지만 연속적으로 yield를 한다. (계속 리스트가 추가되는 경우)
  L.map((i) => track[i]), // 트랙을 꺼낸다.
  L.map(({ cars }) => cars), // cars 배열만 꺼낸다.
  L.map(_.delay(2000)), // 2초에 한번씩 동작한다.
  L.takeUntil(({ length: l }) => l < 4), // 길이가 4보다 처음 작을 때까지 반복한다.
  L.flat, // 철수, 영희, 철희, 영수.. 배열을 풀어서 반환함
  L.map((car) => `${car} 출발!`),
  _.each(console.log)
);

// 2초 후
// 철수 출발!
// 영희 출발!
// 철희 출발!
// 영수 출발!

// 2초 후
// 하든 출발!
// 커리 출발!
// 듀란트 출발!
// 탐슨 출발!

// 2초 후
// 폴 출발!
// 어빙 출발!
// 릴라드 출발!
// 맥컬럼 출발!

// 2초 후
// 스파이더맨 출발!
// 아이언맨 출발!
```

위처럼 대기, 조건 등에 따른 일어날 일들에 대해 다양하게 핸들링이 가능해진다!