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

### 10) Parameters

함수 `TYPE`의 매개변수 타입을 새로운 튜플(Tuple) 타입으로 반환한다.

```tsx
Parameters<TYPE>
```

```tsx
function fn(a: string | number, b: boolean) {
  return `[${a}, ${b}]`;
}
const a: Parameters<typeof fn> = ["vicky", 123]; // TS2322: Type 'number' is not assignable to type 'boolean'.
```

위 예제의 `Parameters<typeof fn>`은 아래와 같이 이해할 수 있다.

```tsx
[string | number, boolean];
```

### 11) ConstructorParameters

클래스 `TYPE`의 매개변수 타입을 새로운 튜플 타입으로 반환한다.

```tsx
ContructorParameters<TYPE>
```

```tsx
class User {
  constructor(public name: string, private age: number) {}
}
const neo = new User("Vicky", 32);
const a: ConstructorParameters<typeof User> = ["Vicky", 31];
const b: ConstructorParameters<typeof User> = ["Wonny"]; // TS2741: Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

위 예제의 ConstructorParameters<typeof User>는 아래와 같이 이해할 수 있다.

```tsx
[string, number];
```

### 12) ReturnType

함수 TYPE의 반환(Return) 타입을 새로운 타입으로 반환한다.

```tsx
ReturnType<TYPE>
```

```tsx
function fn(str: string) {
  return str;
}
const a: ReturnType<typeof fn> = "only string";
const b: ReturnType<typeof fn> = 1234; // TS2322: Type '123' is not assignable to type 'string'.
```

### 13) InstanceType

클래스 TYPE의 인스턴스 타입을 반환한다.

```tsx
InstanceType<TYPE>
```

```tsx
class User {
  constructor(public name: string) {}
}
const vicky: InstanceType<typeof User> = new User("vicky");
```

### 14) ThisParameterType

함수 `TYPE`의 명시적 `this` 매개변수 타입을 새로운 타입으로 반환한다.  
함수 `TYPE`의 명시적 `this` 매개변수가 없는 경우 알 수 없는 타입(Unknown)을 반환한다.

> [함수 > this > 명시적 this] 참고

```tsx
ThisParameterType<TYPE>
```

```tsx
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertype
function toHex(this: Number) {
  return this.toString(16);
}
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

위 예제에서 함수 `toHex`의 명시적 `this` 타입은 `Number`이고, 그 타입을 참고해서 함수 `numberToString`의 매개변수 `n`의 타입을 선언한다. 따라서 `toHex`에 다른 타입의 this가 바인딩 되는 것을 방지할 수 있다.

### 15) OmitThisParameter

함수 TYPE의 명시적 this 매개변수를 제거한 새로운 타입을 반환한다.

```tsx
OmitThisParameter<TYPE>
```

```tsx
function getAge(this: typeof cat) {
  return this.age;
}

// 기존 데이터
const cat = {
  age: 12, // number
};
getAge.call(cat); // 12

// 새로운 데이터
const dog = {
  age: "13", // string
};
getAge.call(dog); // TS2345: Argument of type '{ age: string; }' is not assignable to parameter of type '{ age: number; }'.
```

위 예제에서 데이터 `cat`을 기준으로 설계한 함수 `getAge`는 일부 다른 타입을 가지는 새로운 데이터 `dog`를 `this`로 사용할 수 없다. 하지만 `OmitThisParameter`를 통해 명시적 `this`를 제거한 새로운 타입의 함수를 만들 수 있으므로, `getAge`를 직접 수정하지 않고 데이터 `dog`를 사용할 수 있다.

```tsx
const getAgeForDog: OmitThisParameter<typeof getAge> = getAge;
getAgeForDog.call(dog); // '13'
```

> this.age에는 이제 어떤 값도 들어갈 수 있으므로 주의하자

### 16) ThisType

`TYPE`의 `this` 컨텐스트(Context)를 명시하고 별도의 타입을 반환하지 않는다.

```tsx
ThisType<TYPE>
```

```tsx
interface IUser {
  name: string;
  getName: () => string;
}

function makeVicky(methods: ThisType<IUser>) {
  return { name: "vicky", ...methods } as IUser;
}

const vicky = makeVicky({
  getName() {
    return this.name;
  },
});
vicky.getName(); // vicky
```

함수 `makeVicky`의 인수로 사용되는 메소드 `getName`은 내부에서 `this.name`을 사용하고 있기 때문에 `ThisType`을 통해 명시적으로 `this` 컨텍스트를 설정해준다. 단, `ThisType`은 별도의 타입을 반환하지 않기 때문에 `makeVicky` 반환 값(`{ name: 'vicky', ...methods }`)에 대한 타입이 정상적으로 추론(Inference)되지 않는다. 따라서 `as IUser`와 같이 따로 타입을 단언(`Assertions`)해야 `vicky.getName()`을 정상적으로 호출할 수 있다.
