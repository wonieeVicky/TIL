## Utility Types

이번에는 타입스크립트의 유틸리티 타입을 분석해본다.

### Partial 타입 분석

Partial 유틸리티는 타이핑 코드를 모두 optional한 속성으로 바꿔준다.
따라서 아래의 코드가 정상 동작한다.

```tsx
interface Profile {
  name: string;
  age: number;
  married: boolean;
}

const vicky: Profile = {
  name: "vicky",
  age: 33,
  married: false,
};

const filteredVicky: Partial<Profile> = {
  name: "vicky",
  age: 33,
};
```

그럼 이 Partial 유틸리티 자체는 어떻게 동작할까?
일단 보기 전에 비스무리하게 만들어본다. 들어오는 타입이 어떤 것이든 optional하게 구현하면 된다.

```tsx
type P<T> = {
  [P in keyof T]?: T[P];
};

// P<Profile> 는 아래와 같아질 것이다.
interface Profile {
  name?: string;
  age?: number;
  married?: boolean;
}
```

이런 느낌이 될 것이다. 실제 `lib.es5.d.ts`에서 확인한 Partial도 비슷하게 타이핑 되어있다.

```tsx
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### Pick 타입 분석

Partial은 모든 속성을 optional하게 해주기 때문에 딱히 좋은 기능이라고 할 수 없다.
아무 것도 안넣어도 성립하는 마법.. 따라서 잘 사용하지 않고 Pick, Omit을 자주 활용하게 된다.

Omit과 Pick의 예시를 한번 보자.

```tsx
interface Profile {
  name: string;
  age: number;
  married: boolean;
}

const vicky: Pick<Profile, "name" | "age"> = {
  name: "vicky",
  age: 33,
};

const vicky: Omit<Profile, "married"> = {
  name: "vicky",
  age: 33,
};
```

Pick은 정확히 사용할 타입만 명시하는 유틸리티이고, Omit은 특정 속성을 제외하고 나머지를 가져오는 타입이다. Omit의 경우 많은 속성 가운데 소수의 타입을 제외할 때 자주 사용한다.

위 역할을 하는 Pick 타입을 직접 만들어보자..

```tsx
// custom Pick
type P<T, S extends keyof T> = {
  [P in S]: T[P];
};

const vicky: P<Profile, "name" | "age"> = {
  name: "vicky",
  age: 33,
};
```

위와 같이 T의 key 중에 S가 속하게 되고, 이 키 값을 기준으로 기존 T에서 Key 값에 대한 type value를 가져오도록 구성하면 된다. 실제 문서와 거의 동일하다.

```tsx
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

매우 흡사하다.

### Omit, Exclude, Extract 타입 분석

Omit을 알기 전에 Exclude를 알아야 한다.

```tsx
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

Exclude는 위 정의와 같이 T 타입에서 U 타입을 뺀 것이다. Extract는 정반대다.
즉 Exclude는 제외, Extract는 추출의 의미를 가진다.

- Exclude는 T가 U의 부분집합이면 없애고, 아니면 남겨준다.
- Extract는 T가 U의 부분집합이면 남기고, 아니면 없앤다.

```tsx
type Animal = "Cat" | "Dog" | "Human";

type Mammal = Exclude<Animal, "Human">; // type Mammal = "Cat" | "Dog"
type Human = Extract<Animal, "Human">; // type Human = "Human"
```

```tsx
interface Profile {
  name: string;
  age: number;
  married: boolean;
}

type A = Exclude<keyof Profile, "married">; // type A = "name" | "age"
```

위와 같은 코드가 있다면 A 타입은 `name` 혹은 `age`를 나타낸다.
(`keyof Profile = “name” | “age” | “married”`)

즉 위 타입 A로 아래와 같은 Pick 타입 구현이 가능해진다.

```tsx
const testVicky: Pick<Profile, Exclude<keyof Profile, "married">> = {
  name: "vicky",
  age: 33,
};
```

즉 위 코드는 O라는 커스텀 타이핑을 하여 Omit 역할을 하게 하면 아래와 같다.

```tsx
type O<T, S extends keyof any> = Pick<T, Exclude<keyof T, S>>;
const OmitVicky: O<Profile, "married"> = {
  name: "vicky",
  age: 33,
};
```

즉 Omit은 Pick과 Exclude를 활용하여 만들어내는 타입이다.
`S extends keyof any` 라는 의미는 S가 string | number | symbol 타입이라는 제약조건을 건 것이다.

이 제약조건을 넣지 않으면 Profile 등의 interface obj를 넣을 수도 있게 된다.

### Required, Record, NonNullable 타입 분석

Required 타입은 optional 속성을 필수값으로 바꿔주는 타입이다.

```tsx
interface Profile {
  name?: string;
  age?: number;
  married?: boolean;
}

const vicky: Required<Profile> = {
  name: "vicky",
  age: 33,
  married: false,
};
```

모든 속성을 필수값으로 바꿔주므로 하나의 속성이라도 제외되면 에러가 발생한다.
위 Required 속성을 실제 구현하면 아래와 같다.

```tsx
type R<T> = {
  [key in keyof T]-?: T[key];
};

const vicky: R<Profile> = {
  name: "vicky",
  age: 33,
  married: false,
};
```

`-?`는 modifier로 optional을 모두 제거하라는 의미를 가진다. (반대로 `+?`도 있으나 굳이 쓸 필요가 없다)

위 vicky 객체에 name은 쉽게 수정할 수 있다. 하지만 수정하지 못하게 하려면? `Readonly`를 쓴다.

```tsx
const vicky: Readonly<Profile> = {
  name: "vicky",
  age: 33,
  married: false,
};

// 혹은
type R<T> = {
  readonly [key in keyof T]-?: T[key];
};

const vicky: R<Profile> = {
  name: "vicky",
  age: 33,
  married: false,
};

vicky.name = "woniee"; // Error!
```

아래와 같이 `-readonly`라고 쓰면 readonly 속성을 제외하라는 의미가 된다.

```tsx
interface Profile {
  readonly name?: string;
  readonly age?: number;
  readonly married?: boolean;
}

type R<T> = {
  -readonly [key in keyof T]-?: T[key];
};

const vicky: R<Profile> = {
  name: "vicky",
  age: 33,
  married: false,
};

vicky.name = "vicky"; // Ok
```

Record 타입은 사용하고자 하는 타입을 간단히 적어놓은 것이다. (`IObj` 같은 느낌)

```tsx
interface Obj {
  [key: string]: number;
}

// 아래 둘은 같은 타입을 가진다.
const obj: Obj = { a: 3, b: 5, c: 7 };
const recordObj: Record<string, number> = { a: 3, b: 5, c: 7 };
```

Record 타입을 직접 만들면 아래와 같다.

```tsx
type R<T extends keyof any, S> = {
  [key in T]: S;
};
const recordObj: R<string, number> = { a: 3, b: 5, c: 7 };
```

NonNullable 타입은 키에 적용되는 타입이다. nullable 하지 않은 값만 가져온다.

```tsx
type A = string | null | undefined | boolean | number;
type B = NonNullable<A>; // type B = string | number | boolean
```

NonNullable은 아래와 같이 삼항 연산자로 만들 수 있음

```tsx
type N<T> = T extends null | undefined ? never : T;
type B = N<A>; // type B = string | number | boolean
```

실제는 아래와 같이 되어 있다.

```tsx
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T & {};
```

T가 `undefined`, `null`이면 `&`에서 아예 걸러지기 때문에 위와 같이 간단히 적을 수 있음

### infer 타입 분석

먼저 Parameters, ReturnType 타입에 대해 알아보자.
Parameters는 인자에 대한 타입을, ReturnType은 리턴 값에 대한 타입을 추론해서 가져올 수 있다.

```tsx
function zip(x: number, y: string, z: boolean): { x: number; y: string; z: boolean } {
  return { x, y, z };
}

type Params = Parameters<typeof zip>; // type Params = [number, string, boolean]
type Return = ReturnType<typeof zip>; // type Return = { x: number; y: string; z: boolean }
type First = Params[0]; // number
```

Params, Return 타입 변수에 담기는 값은 튜플로 담기므로 배열의 index로 해당 타입에 접근할 수 있다.
실제 예시를 만들어보자

```tsx
type P<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type Params = P<typeof zip>; // type Params = [number, string, boolean]
type First = Params[0]; // number
```

`<T extends (...args: any) => any>` 의 의미는 T는 무조건 함수여야 한다는 뜻임

infer는 타입스크립트가 알아서 추론한다는 의미를 가진다.

- `추론 조건 ? 추론 성공 시의 값 : 추론 실패 시의 값`
- `T extends (...args: infer P) => any ? P : never;`
  - 매개변수에 추론 값이 있으면 그걸 쓰고, 없으면 쓰지 않는다는 의미를 가진다.

만약 리턴타입에 대한 값 추론을 하려면 어떻게 만들면 될까?

```tsx
type R<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;
type Return = R<typeof zip>; // type Return = { x: number; y: string; z: boolean }
```

이번에는 instanceType과 ContructorParameters에 대해 알아본다.
이는 생성자를 대상으로 사용하는 타입이다.

```tsx
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R
  ? R
  : any;
```

위 타입은 아래와 같이 사용함

```tsx
class A {
  a: string;
  b: number;
  c: boolean;

  constructor(a: string, b: number, c: boolean) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

const d = new A("vicky", 33, true);
type D = ConstructorParameters<typeof A>; // type D = [a: string, b: number, c: boolean] - 생성자의  파라미터
type I = InstanceType<typeof A>; // type I = Test

const e: A = new A("woniee", 32, true); // 인스턴스(new)
```

위의 메서드를 앎으로서 더 다양한 타입 확장이 가능해진다.
공부할 때는 구현이 어떤 원리로 되어있는지 집중하는 것이 좋다.

이 외에도 `Uppercase`, `Lowercase`, `Capitalize`, `Upcapitalize`, `ThisType` 등이 있다.
위 코드는 대거 intrinsic 타입 형태로 만들어져있다. (타입스크립트에서 별도의 커스텀 코드로 구현)
