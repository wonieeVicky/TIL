## lib.es5.d.ts 분석

> lib.es5.d.ts 훌륭한 예시는 가까이에 있다. 자주보고 익히자

### forEach, map 제네릭 분석

제네릭 사용에 대한 예시를 살펴보면서 분석해보자

```tsx
interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
}
```

위 forEach 함수에 대한 타입 정의를 찾아보면 `lib.es5.d.ts`로 연결되고, 거기에서 찾은 forEach 타이핑은 위와 같음
위와 같이 제네릭으로 함수 타입이 정의되어 있기 때문에 아래와 같은 코드가 모두 가능해진다.

```tsx
const a: Array<number> = [1, 2, 3];
a.forEach((v) => console.log(v)); // v를 number로 알아서 추론

["1", "2", "3"].forEach((v) => console.log(v)); // v를 string로 알아서 추론
[true, false, true].forEach((v) => console.log(v)); // v를 boolean로 알아서 추론
[1, "2", true].forEach((v) => console.log(v)); // v를 number | string | boolean로 알아서 추론
```

[](4-2-ts-all-in-one-basic.md)
코드 작성 시에는 타입이 불분명한 상태에서 실제 사용 시 타입을 설정할 수 있어서 좋다.
근데 제네릭을 굳이 설정하지 않고 모두 타이핑을 해도 되지 않을까? [기본 문법 정리](4-2-ts-all-in-one-basic.md) 에서 논의했던 내용이므로 넘어감

다음, map도 알아보자.

```tsx
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}

[1, 2, 3].map((v) => v.toString());
```

map 타입에 대해 가지고 왔다. 이해하는 과정을 따라가보자.

위 공식에서 T는 숫자 배열이므로 number가 됨

즉, `map<U>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any): U[];`

다음으로는 v.toString[]이 string 으로 값을 도출한다는 것을 의미하므로 U는 string 타입이 된다.

`map<string>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any): string[];`

위와 같은 과정으로 이해하면 제네릭도 충분히 이해할 수 있는 것임

![위 과정을 이해하면 stringArr 변수가 string[]로 추론되는 것을 이해할 수 있게된다.](../img/221220-1.png)

![](../img/221220-2.png)

### filter 제네릭 분석

filter 타입도 분석해본다. 실제 filter타입에 대한 타입 정의를 찾아보면 아래와 같이 두 개를 찾을 수 있다.

```tsx
interface Array<T> {
  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
}
```

같은 함수가 여러가지 방법으로 사용되는 경우 타입을 여러번 선언할 수도 있다. filter가 타입을 제대로 못찾는 경우도 있다.

```tsx
const filtered = [1, 2, 3, 4, 5].filter((v) => v % 2);
```

먼저 잘 찾는 경우에 대한 위 예시를 보자

`filter<S extends number>(predicate: (value: number, index: number, array: number[]) => value is number, thisArg?: any): number[];`

위와 같이 T 타입의 제네릭에 `number` 타입이 들어간 경우라고 보면 된다.

![](../img/221222-1.png)

위와 같은 문자열만 추출하는 filter 함수가 있다고 하자. filtered 변수는 `(string | number)[]` 타입으로 추론된다. typeof string를 해도 동일

이럴 때는 어떻게 개선할 수 있을까? 저 내부 filter 구현 함수를 별도로 타이핑해주면 된다.

```tsx
const predicate = (value: string | number): value is string => typeof value === "string";
const filtered = ["1", 2, "3", 4, 5].filter(predicate); // ["1", "3"] string[]
```

위와 같이 predicate 함수에 value is string이라고 직접 명시해준다.

![원하는 대로 string[]로 반환](../img/221222-1.png)

다양한 타이핑 방법으로 지정할 수도 있겠지만 형식조건자가 지정되어 에러가 날 확률이 높다.

```tsx
predicate: (value: T, index: number, array: T[]) => value is S
```

위 predicate 함수 구조와 맞도록 최대한 구현해주어야 바람직한 결과를 반환받을 수 있음.

lib.es5.d.ts를 분석하는 것이 큰 도움이 된다. 타인이 만든 타입에 대해 볼 수 있고, 자바스크립트 사전을 보는 것 같은 느낌이 든다.

### forEach 타입 직접 만들기

이제 반대로 타입을 직접 만들어본다.

```tsx
const a: Arr = [1, 2, 3];

a.forEach((item) => {
  console.log(item);
});

const b: Arr = ["1", "2", "3"];

b.forEach((item) => {
  console.log(item);
});
```

간단한 여러 타입의 배열을 forEach 함수로 실행시킬 때 Arr 에 대한 타이핑을 한다면 어떻게 할 수 있을까?

```tsx
interface Arr<T> {
  forEach(callback: (item: T, index: number) => void): void;
  // forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
}

const a: Arr<number> = [1, 2, 3];

a.forEach((item) => {
  console.log(item);
  item.toFixed(1);
});

const b: Arr<string> = ["1", "2", "3"];

b.forEach((item) => {
  console.log(item);
  item.charAt(3);
});
```

위처럼 제네릭 T를 통해 설정한 타입이 데이터에 들어오는 것을 명시해주면 에러가 발생하지 않는다.
아래 주석이 실제 forEach 함수에 대한 타이핑 코드임. forEach 사용 시 index나 추가적인 thisArg 등을 사용하게 될 경우 타입을 추가해서 확장해주면 된다.

### map 타입 직접 만들기

map도 만들어본다. 가장 기본적인 내용으로만 구현해보면 아래와 같다

```tsx
interface Arr<T> {
  map(callback: (item: T, index: number) => T): T[];
}

const a: Arr<number> = [1, 2, 3];

a.map((item) => item + 1); // Ok
a.map((item) => item.toString()); // Error
```

위 숫자 리턴의 map 함수에서는 정상적으로 동작하지만, 두 번째 문자열을 반환하는 map 함수는 당연히 에러를 뱉는다.
즉, 반환값의 T가 잘못되었다는 의미임. 따라서 이를 아래와 같이 쓸 수 있다.

```tsx
interface Arr<T> {
  map<S>(callback: (item: T, index: number) => S): S[];
}
const a: Arr<number> = [1, 2, 3];

// or
interface Arr<T, S> {
  map(callback: (item: T) => S): S[];
}

const a: Arr<number, number> = [1, 2, 3];

// 어느 방법으로든 아래의 모든 경우를 수렴한다.
const b = a.map((item) => item + 1); // number[]
const c = a.map((item) => item.toString()); // string[]
const d = a.map((item) => !(item % 2)); // boolean[]

const e: Arr<string> = ["1", "2", "3"];
const f = e.map((item) => +item); // number[]
```

`map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];` 실제 map 타이핑 코드와 비교해보면 거의 비슷하다!

### filter 타입 직접 만들기

마지막으로 filter도 만들어본다. filter는 조금 어렵당

```tsx
interface Arr<T> {
  filter<S extends T>(callback: (v: T) => v is S): S[];
}

const a: Arr<number> = [1, 2, 3];
const b = a.filter((v): v is number => !(v % 2));

const c: Arr<number | string> = [1, "2", 3, "4", 5];
const d = c.filter((v): v is string => typeof v === "string"); // ["2", "4"]

const predicate = (v: string | number): v is number => typeof v === "number";
const e = c.filter(predicate); // [1, 3, 5]
```

`S`는 `T`의 부분 집합임을 제네릭으로 표현해서 완성했다.
`is`는 반환값에 대한 타입을 지정해주는 메서드이므로 `T`의 부분집합인 `S`가 반환값의 타입이라고 지정해줄 수 있음

다른 함수들도 이런 식으로 타입을 직접 만들어주는 연습을 하다보면 자연스럽게 실력을 쌓을 수 있다.
