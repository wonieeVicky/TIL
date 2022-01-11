## 이터러블 프로그래밍(리스트 프로세싱, Lisp)

### 홀수 n개 더하기

아래는 list의 홀수 n개를 꺼내 각 값의 제곱값을 모두 더하는 `명령형 함수`의 예이다.

```jsx
// 명령형으로 작성한 홀수 n개 제곱값 더하기
function f1(limit, list) {
  let acc = 0;
  for (const a of list) {
    if (a % 2) {
      const b = a * a;
      acc += b;
      if (--limit === 0) break;
    }
  }
  console.log(acc);
}

f1(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 앞에서 3개를 꺼내 각 값들의 제곱을 모두 더한다.
```

f1 함수가 쉬운 함수로 보이지만 사실 우리가 표현하는 프로그래밍의 전부라고 할 수 있다.
자료구조를 다루고, 순회를 하면서, 반복을 하고 제어를 하면서 break 문을 사용하여 시간복잡도를 효율적으로 운용하고, 변수에 할당하고 스코프로 누적된 값을 관리하고 반환하는 기능을 모두 담고 있는 함수라는 것이다.

그렇다면 f1 함수를 동일한 효율을 가진 함수형 프로그래밍 코드 혹은 iterable programming, 리스트 프로세싱(Lisp)으로 표현하면 어떻게 할 수 있을까? 먼저 이터러블 프로그래밍이란 기존에 변수에 값을 할당하고, 제어하던 모든 명령형 코드들이 함수형으로 추상화되어 있는 것이라고 할 수 있다.

먼저 위 코드의 if는 filter로 추상화할 수 있다.

```jsx
function f2(limit, list) {
  let acc = 0;
  for (const a of L.filter((a) => a % 2, list)) {
    const b = a * a;
    acc += b;
    if (--limit === 0) break;
  }
  console.log(acc);
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35
```

`filter` 함수는 아래와 같이 도출되는 함수이다.

```jsx
var it = L.filter((a) => a % 2, [1, 2, 3, 4]);
console.log([...it]); // [1,3];

// 혹은
var it = L.filter((a) => a % 2, [1, 2, 3, 4]);
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

다음으로는 값 변화 후 변수 할당(`const b = a * a`)을 `map` 함수로 추상화할 수 있다.

```jsx
function f2(limit, list) {
  let acc = 0;
  for (const a of L.map(
    (a) => a * a,
    L.filter((a) => a % 2, list)
  )) {
    acc += a;
    if (--limit === 0) break;
  }
  console.log(acc);
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35
```

다음으로는 break 문을 `take` 함수로 변경한다.

```jsx
function f2(limit, list) {
  let acc = 0;
  for (const a of L.take(
    limit,
    L.map(
      (a) => a * a,
      L.filter((a) => a % 2, list)
    )
  )) {
    acc += a;
  }
  console.log(acc);
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35
```

`take`함수는 아래와 같이 도출되는 함수이다.

```jsx
var it = L.take(2, [1, 2, 3, 4]);
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: undefined, done: true}
```

이제 도출된 값의 축약과 합산을 `reduce` 함수로 처리해준다.

```jsx
const add = (a, b) => a + b;
function f2(limit, list) {
  console.log(
    _.reduce(
      add, // 5. 축약 및 합산을 reduce로
      L.take(
        limit, // 4. break를 take로
        L.map(
          (a) => a * a, // 3. 값 변화 후 변수 할당을 map으로
          L.filter((a) => a % 2, list) // 2. if를 filter로
        )
      )
    )
  );
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35
```

이처럼 함수형 프로그래밍을 이용하면 기존의 명령형 코드보다 훨씬 더 순차적으로 처리되도록 추상화되어있는 것을 확인할 수 있다. 여기에서 go함수를 사용해 더욱 절차를 명시적으로 표현해줄 수 있는데 아래의 코드를 보자.

```jsx
const add = (a, b) => a + b;
function f2(limit, list) {
  _.go(
    list,
    L.filter((a) => a % 2),
    L.map((a) => a * a),
    L.take(limit),
    _.reduce(add),
    console.log
  );
}
f2(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 35
```

### while을 range로 + effect를 each로

while 문은 iterable programming 관점에서 range로 해석할 수 있다. while 문은 break 조건이 있는 반복문 코드를 의미한다. 코드를 통해 확인해보자

아래와 같이 0부터 9까지 순회하는 while 문 함수가 있다고 하자

```jsx
function f3(end) {
  let i = 1;
  while (i < end) {
    console.log(i); // 1, 3, 5, 7, 9
    i += 2;
  }
}
f3(10);
```

위 코드는 `range` 함수와 `each` 함수의 조합으로 변경할 수 있다.
each 함수는 인자로 전달된 값을 그대로 반환하며, 값에 효과(effect)를 줄 때 구분자로 활용한다.

```jsx
function f4(end) {
  //	_.each(console.log, L.range(1, end, 2)); // 0 ~ 9
  _.go(L.range(1, end, 2), _.each(console.log));
}
f4(10);
```

range 함수는 아래와 같이 도출되는 함수이다.

```jsx
const it = L.range(3);
console.log(it.next()); // {value: 0, done: false}
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: undefined, done: true}

const it2 = L.range(1, 5, 2);
[...it2]; // [1, 3, 5]
```

### 추억의 별 그리기

보통 알고리즘을 공부하면서 많이 해보는 추억의 별그리기를 Lisp을 활용해 이터러블 프로세싱으로 구현해보자 : )
\*, **, \***, \***\*, \*\*\***가 순차적으로 나오도록 Lisp으로 구현하면 아래와 같다.

```jsx
_.go(
  L.range(1, 6),
  L.map(L.range),
  L.map(L.map((_) => "*")),
  L.map(_.reduce((a, b) => `${a}${b}`)),
  _.reduce((a, b) => `${a}\n${b}`),
  console.log
);

// *
// **
// ***
// ****
// *****
```

위 코드는 아래와 같이 변경할 수도 있다.

```jsx
_.go(
  L.range(1, 6),
  L.map((s) =>
    _.go(
      L.range(s),
      L.map((_) => "*"),
      _.reduce((a, b) => `${a}${b}`)
    )
  ),
  _.reduce((a, b) => `${a}\n${b}`),
  console.log
);
```

가장 위 map을 중첩하여 처리한 코드를 좀 더 발전시켜나가면 아래와 같이 변경할수도 있다. 😮

```jsx
const join = (sep) => _.reduce((a, b) => `${a}${sep}${b}`); // join 함수 별도 분리
_.go(
  L.range(1, 6),
  L.map(L.range),
  L.map(L.map((_) => "*")),
  L.map(join("")),
  join("\n"),
  console.log
);
```

### 추억의 구구단

함수형 프로그래밍에서는 추억의 구구단도 i++, j++, if문, 타이밍 처리 등을 아래와 같이 선언적으로 구현할 수 있다.

```jsx
const join = (sep) => _.reduce((a, b) => `${a}${sep}${b}`);
_.go(
  L.range(2, 10),
  L.map((a) =>
    _.go(
      L.range(1, 10),
      L.map((b) => `${a}x${b}=${a * b}`),
      join("\n")
    )
  ),
  join("\n\n"),
  console.log
);

// 2x1=2
// 2x2=4
// 2x3=6
// 2x4=8
// 2x5=10
// 2x6=12
// 2x7=14
// 2x8=16
// 2x9=18
// ..
```

위와 같은 연습들을 통해 이터러블 프로그래밍으로 구현하는 방법에 익숙해지도록 노력해보자
