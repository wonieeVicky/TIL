## 제네릭(Generic)

Generic은 재사용을 목적으로 함수나 클래스의 선언 시점이 아닌, **사용 시점에 타입을 선언**할 수 있다.

> 타입을 인수로 받아서 사용한다고 이해하면 쉽다.

아래의 예제는 toArray 함수가 인수로 받은 값을 배열로 반환하도록 작성되었다.  
매개 변수가 Number 타입만 허용하기 때문에 String 타입을 인수로 하는 함수 호출에서 에러가 발생한다.

```tsx
function toArray(a: number, b: number): number[] {
  return [a, b];
}
toArray(1, 2);
toArray("1", "2"); // Error - TS2345: Argument of type '"1"' is not assignable to parameter of type 'number'.
```

조금 더 범용적으로 만들기 위해 유니언 방식으로 사용해보자  
이제 String 타입을 인수로 받을 수 있지만, 가독성이 떨어지고 새로운 문제도 발생했다.  
세 번째 호출을 보면 의도치 않게 `Number`와 `String` 타입을 동시에 받을 수 있게 되었다.

```tsx
function toArray(a: number | string, b: number | string): (number | string)[] {
  return [a, b];
}
toArray(1, 2); // only Number
toArray("1", "2"); // only String
toArray(1, "2"); // Number & String
```

이번에는 Generic을 사용한다. 함수 이름 우측에 <T>를 작성해 시작한다.  
T는 타입 변수(Type variavle)로 사용자가 제공한 타입으로 변환된 식별자를 뜻한다.  
이제 세 번째 호출은 의도적으로 Number나 String 타입을 동시에 받을 수 있다. (혹은 유니언을 사용하지 않으면 에러가 발생한다)

> 타입 변수는 매개 변수처럼 원하는 이름으로 지정할 수 있다.

```tsx
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}
toArray<number>(1, 2);
toArray<string>("1", "2");
toArray<string | number>(1, "2");
toArray<number>(1, "2"); // Error
```

타입 추론을 활용해 사용 시점에 타입을 제공하지 않을 수 있다.

```tsx
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}
toArray(1, 2);
toArray("1", "2");
toArray(1, "2"); // Error
```
