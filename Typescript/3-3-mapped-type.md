﻿# 맵드 타입에 대하여

### 맵드 타입(Mapped Type)이란?

맵드 타입이란 기존에 정의되어 있는 타입을 새로운 타입으로 변환해주는 문법을 의미한다.
마치 자바스크립트 map() API 함수를 타입에 적용한 것과 같은 효과를 가진다.

`변환 전(기존 타입)`

```tsx
{
  name: string;
  email: string;
}
```

`변환 후(새 타입)`

```tsx
{
  name: number;
  email: number;
}
```

### 자바스크립트 map 함수란?

자바스크립트의 `map` API는 배열을 다룰 때 유용한 자브스크립트 내장 API이다. 간단하게 코드를 보자

```tsx
var arr = [
  { id: 1, title: "함수" },
  { id: 2, title: "변수" },
  { id: 3, title: "인자" },
];
var result = arr.map(function (item) {
  return item.title;
});
console.log(result); // ['함수', '변수', '인자']
```

위 코드는 3개의 객체를 요소로 가진 배열 `arr`에 `.map()` API를 적용한 코드이다. 배열의 각 요소를 순회하여 객체(id, title)에서 문자열로 변환하였다.

### 맵드 타입의 기본 문법

맵드 타입은 위에서 살펴본 자바스크립트의 map 함수를 타입에 적용했다고 보면 된다.
이를 위해서는 아래와 같은 형태의 문법을 사용해야 한다.

```tsx
{ [ P in K ] : T }
{ [ P in K ] ? : T }
{ readonly [ P in K ] : T }
{ readonly [ P in K ] ? : T }
```
