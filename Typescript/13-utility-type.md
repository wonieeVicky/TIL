## TS 전역 유틸리티 타입(Utility Types)

타입스크립트에서 제공하는 여러 전역 유틸리티 타입이 있다.
이해를 돕기 위한 간단한 예제와 함께, 더 자세한 내용은 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)를 참고한다.

> 타입 변수 T는 타입(Type), U는 또 다른 타입, K는 속성(Key)을 의미하는 약어이다.
> 이해를 돕기 위해 타입 변수를 T는 TYPE 또는 TYPE1, U는 TYPE2, K는 KEY로 명시했다.

### 1) Partial

`TYPE` 의 모든 속성을 선택적(`?`)으로 변경한 새로운 타입을 반환한다.

> 'Optional > 속성과 메소드' 파트 참고

```tsx
Partial<TYPE>
```

```tsx
interface IUser {
  name: string;
  age: number;
}

const userA: IUser = {
  // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'IUser'.
  name: "A",
};
const userB: Partial<IUser> = {
  nmae: "B",
};
```

위 예제의 Partial<IUser>는 아래와 같이 이해할 수 있다.

```tsx
interface INewType {
  name?: string;
  age?: number;
}
```

### 2) Required

`TYPE`의 모든 속성을 필수로 변경한 새로운 타입을 반환한다.

```tsx
Required<TYPE>
```

```tsx
interface IUser {
  name?: string;
  age?: number;
}
const userA: IUser = {
  name: "A",
};
const userB: Required<IUser> = {
  // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'Required<IUser>'.
  name: "B",
};
```

위 `Required<IUser>`은 아래와 같이 이해할 수 있다.

```tsx
interface IUser {
  name: string;
  age: number;
}
```

### 3) Readonly

TYPE의 모든 속성을 읽기 전용(readonly)으로 변경한 새로운 타입을 반환한다.

'인터페이스 > 읽기 전용 속성' 참고

```tsx
Readonly<TYPE>
```

```tsx
interface IUser {
  name: string;
  age: number;
}

const userA: IUser = {
  name: "A",
  age: 12,
};
userA.name = "aa";

const userB: Readonly<IUser> = {
  name: "B",
  age: 13,
};
userB.name = "BB"; // TS2540: Cannot assign to 'name' because it is a read-only property.
```

위 예제의 `Readonly<IUser>`는 다음과 같이 이해할 수 있다.

```tsx
interface INewType {
  readonly name: string;
  readonly age: number;
}
```

### 4) Record

`KEY`을 속성(Key)으로, `TYPE` 을 그 속성값의 타입(Types)으로 지정하는 새로운 타입을 반환한다.

```tsx
Record<KEY, TYPE>
```

```tsx
type TName = "vicky" | "wonny";
const developers: Record<TName, number> = {
  vicky: 32,
  wonny: 31,
};
```

위 예제의 `Record<TName, number>`는 아래와 같이 이해할 수 있다.

```tsx
interface INewType {
  vicky: number;
  wonny: number;
}
```

### 5) Pick

`TYPE`에서 `KEY`로 속성을 선택한 새로운 타입을 반환한다.
`TYPE`은 속성을 가지는 인터페이스나 객체 타입이어야 한다.

```tsx
Pick<TYPE, KEY>
```

```tsx
interface IUser {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}
type TKey = "name" | "email";
const user: Pick<IUser, TKey> = {
  name: "Vicky",
  email: "hwfongfing@gmail.com",
  age: 22, // TS2322: Type '{ name: string; email: string; age: number; }' is not assignable to type 'Pick<IUser, TKey>'.
};
```

위 예제의 `Pick<IUser, TKey>`는 아래와 같이 이해할 수 있다.

```tsx
interface INewType {
  name: string;
  email: string;
}
```

### 6) Omit

위에서 살펴본 `Pick`과 반대로, `TYPE`에서 `KEY`로 속성을 생략하고 나머지를 선택한 새로운 타입을 반환한다. `TYPE`은 속성을 가지는 인터페이스나 객체 타입이어야 한다.

```tsx
Omit<TYPE, KEY>
```

```tsx
interface IUser {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}
type TKey = "name" | "email";
const user: Omit<IUser, TKey> = {
  age: 32,
  isValid: true,
  name: "Vicky", // TS2322: Type '{ age: number; isValid: true; name: string; }' is not assignable to type 'Pick<IUser, "age" | "isValid">'.
};
```

위 예제의 Omit<IUser, TKey>은 아래와 같이 이해할 수 있다.

```tsx
interface INewType {
  // name: string,
  age: number;
  // email: string,
  isValid: boolean;
}
```

### 7) Exclude

유니언 `TYPE1`에서 유니언 `TYPE2`를 제외한 새로운 타입을 반환한다.

```tsx
Exclude<TYPE1, TYPE2>
```

```tsx
type T = string | number;
const a: Exclude<T, number> = "only string";
const b: Exclude<T, string> = "123"; // TS2322: Type '123' is not assignable to type 'string'.
const c: T = "string";
const d: T = 1235;
```

### 8) Extract

유니언 TYPE1에서 유니언 TYPE2를 추출한 새로운 타입을 반환한다.

```tsx
Extract<TYPE1, TYPE2>
```

```tsx
type T = string | number;
type U = number | boolean;

const a: Extract<T, U> = 123;
const b: Extract<T, U> = "only number"; // TS2322: Type '"Only number"' is not assignable to type 'number'.
```

### 9) NonNullable

유니언 TYPE에서 Null과 undefined를 제외한 새로운 타입을 반환한다.

```tsx
NonNullable<TYPE>
```

```tsx
type T = string | number | undefined;
const a: T = undefined;
const b: NonNullable<T> = null; // TS2322: Type 'null' is not assignable to type 'string | number'.
```
