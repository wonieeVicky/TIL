# 구조분해 할당

## 6-1. 객체 구조분해 할당

개발할 때 속성 이름을 변수로 만들어주는 상황이 꽤 자주 등장한다.  
예를 들어 아래와 같은 객체가 있다고 하자

```jsx
const example = { a: 123, b: { c: 135, d: 146 } };
const a = example.a;
const d = example.b.d;
```

위와 같이 각 속성 이름을 변수로 만들어주는 상황을 비구조화 할당으로 간단히 처리할 수 있다.

```jsx
const example = { a: 123, b: { c: 135, d: 146 } };
const {
  a,
  b: { c, d: data },
} = example;
console.log(a); // 123
console.lod(c); // 135
console.log(data); // 146, 다른 변수로 선언도 가능하다!
```

## 6-2. 배열 구조분해 할당

배열 또한 개발할 때 배열 데이터를 변수로 만들어주는 상황이 자주 등장한다.

```jsx
const arr = [1, 2, 3, 4, 5];
const x = arr[0];
const y = arr[1];
const z = arr[4];
```

위와 같은 방식을 비구조화 할당으로 역시나 간단히 처리할 수 있다.

- 각 배열 인덱스와 변수가 대응된다.

```jsx
const [x, y, , , z] = arr;
console.log(x); // 1
console.log(z); // 5
```

## 6-3. 비구조화 할당에서 하는 실수

- 아래 candyMachine을 보면 this를 사용함. this를 사용하는 곳에서 비구조화 할당을 하면 문제가 생긴다.
  - this는 함수를 호출할 때 어떻게 호출되었냐에 따라 결정되기 때문이다.

```jsx
var candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getCandy: function () {
    this.status.count--;
    return this.status.count;
  },
};
var getCandy = candyMachine.getCandy;
var count = candyMachine.status.count;
```

- var getCandy와 var count에 주목
  - candyMachine부터 시작해서 속성을 찾아 들어가야 한다.

```jsx
const {
  getCandy,
  status: { count },
} = candyMachine;
```

- const { 변수 } = 객체; 로 객체 안의 속성을 변수명으로 사용 가능
  - 단, getCandy()를 실행했을 때 결과가 candyMachine.getCandy와는 달라질 수 있다.
- count처럼 속성 안의 속성도 변수명으로 사용 가능하다.
