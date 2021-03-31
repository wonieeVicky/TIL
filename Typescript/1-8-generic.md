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
toArray('1', '2'); // Error - TS2345: Argument of type '"1"' is not assignable to parameter of type 'number'.
```

조금 더 범용적으로 만들기 위해 유니언 방식으로 사용해보자  
이제 String 타입을 인수로 받을 수 있지만, 가독성이 떨어지고 새로운 문제도 발생했다.  
세 번째 호출을 보면 의도치 않게 `Number`와 `String` 타입을 동시에 받을 수 있게 되었다.

```tsx
function toArray(a: number | string, b: number | string): (number | string)[] {
  return [a, b];
}
toArray(1, 2); // only Number
toArray('1', '2'); // only String
toArray(1, '2'); // Number & String
```

이번에는 **Generic**을 사용한다. 함수 이름 우측에 <T>를 작성해 시작한다.  
T는 타입 변수(Type variavle)로 사용자가 제공한 타입으로 변환된 식별자를 뜻한다.  
이제 세 번째 호출은 의도적으로 Number나 String 타입을 동시에 받을 수 있다. (혹은 유니언을 사용하지 않으면 에러가 발생한다.)

> 타입 변수는 매개 변수처럼 원하는 이름으로 지정할 수 있다.

```tsx
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}
toArray<number>(1, 2);
toArray<string>('1', '2');
toArray<string | number>(1, '2');
toArray<number>(1, '2'); // Error
```

타입 추론을 활용해 사용 시점에 타입을 제공하지 않을 수도 있다.

```tsx
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}
toArray(1, 2);
toArray('1', '2');
toArray(1, '2'); // Error
```

### 1) 제약 조건(Constraints)

인터페이스나 타입 별칭을 사용하는 제네릭을 작성할 수도 있다.  
아래는 별도의 제약 조건(Constraints)이 없어서 모든 타입이 허용되는 예시이다.

```tsx
interface MyType<T> {
  name: string;
  value: T;
}
const dataA: MyType<string> = {
  name: 'Data A',
  value: 'Hello world',
};
const dataB: MyType<number> = {
  name: 'Data B',
  value: 1234,
};
const dataC: MyType<boolean> = {
  name: 'Data C',
  value: true,
};
const dataD: MyType<number[]> = {
  name: 'Data D',
  value: [1, 2, 3, 5],
};
```

### 2) 조건부 타입(Conditional Types)

제약 조건과 다르게 '타입 구현' 영역에서 사용하는 `extends`는 삼항 연산자(Conditional ternary operator)를 사용할 수 있다. 이를 조건부 타입(Conditional Types)라고 하며 아래와 같은 문법을 가진다.

```tsx
T extends U ? X : Y
```

```tsx
type U = string | number | boolean;

// type 식별자 = 타입 구현
type MyType<T> = T extends U ? string : never;

// interface 식별자 { 타입 구현 }
interface IUser<T> {
  name: string;
  age: T extends U ? number : never;
}
```

```tsx
interface IUser<T extends boolean> {
  name: string;
  // `T`의 타입이 `true`인 경우 `string` 반환, 아닌 경우 `number` 반환.
  age: T extends true ? string : number;
  isString: T;
}

const str: IUser<true> = {
  name: 'Neo',
  age: '12', // String
  isString: true,
};
const num: IUser<false> = {
  name: 'Lewis',
  age: 12, // Number
  isString: false,
};
```

아래와 같이 삼항 연산자를 연속해서 사용할 수도 있다.

```tsx
type MyType<T> = T extends string
  ? 'Str'
  : T extends number
  ? 'Num'
  : T extends boolean
  ? 'Boo'
  : T extends undefined
  ? 'Und'
  : T extends null
  ? 'Nul'
  : 'obj';
```

### 3) infer

infer 키워드를 사용해 타입 변수의 타입 추론(Inference) 여부를 확인할 수 있다.

> U가 추론 가능한 타입이면 참, 아니면 거짓

```tsx
T extends infer U ? X : Y
```

유용하진 않다. 기본 구조는 위의 조건부 타입과 같다.

아래의 타입 변수 `R` 은 `MyType<number>`에서 받은 타입 `number`가 되고 `infer` 키워드를 통해 타입 추론이 가능한지 확인한다. `number` 타입은 당연히 타입 추론이 가능하므로 `R`을 반환한다. (만약 `R`을 타입 추론 할 수 없다면 null이 반환된다.)

결과적으로 `MyType<number>`는 `number`를 반환하고 변수 `a`는 `123`을 할당할 수 있다.

```tsx
type MyType<T> = T extends infer R ? R : null;
const a: MyType<number> = 123;
```

조금 더 복잡하지만 유용한 예제를 보자. ReturnType은 함수의 반환 값이 어떤 타입인지 반환한다.

> 아래의 ReturnType은 이미 TS 유틸리티 타입에 선언되어 있는 함수이다.  
> (‘TS 유틸리티 타입 > ReturnType’ 파트 참고)

```tsx
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

function fn(num: number) {
  return num.toString();
}
const a: ReturnType<typeof fn> = 'Hello';
```

위 예제에서 typeof fn은 (num: number) ⇒ string으로 반환 타입은 string이다. 따라서 R은 string이고 역시 infer 키워드를 통해 타입 추론이 가능하므로 R을 반환한다. 즉, string을 반환한다.

infer 키워드에 대한 더 자세한 내용은 공식 문서의 [Type inference in conditional types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types) 파틑를 참고한다.

- infer 키워드는 제약 조건 extends가 아닌 조건부 타입 extends 절에서만 사용 가능
- infer 키워드는 같은 타입 변수를 여러 위치에서 사용 가능
  - 일반적인 공변성(co-variant) 위치에서는 유니언 타입으로 추론
  - 함수 인수인 반공변성(contra-variant) 위치에서는 인터섹션 타입으로 추론
- 여러 호출 시그니처(함수 오버로드)의 경우 마지막 시그니처에서 추론
