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

type A = Exclude<keyof Profile, 'married'> // type A = "name" | "age"
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
