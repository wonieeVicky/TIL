## ?(Optional)

`?` 키워드를 사용하는 여러 선택적(Optional) 개념에 대해 살펴보자.

### 1) 매개변수

우선, 타입을 선언할 때 선택적 매개 변수(Optional Parameter)를 지정할 수 있다.
아래의 예제를 보면 ? 키워드를 통해 y를 선택적 매개 변수로 지정했다.
따라서 y가 받을 인수가 없어도 에러가 발생하지 않는다.

```tsx
function add(x: number, y?: number): number {
  return x + (y || 0);
}
const sum = add(2);
console.log(sum);
```

위 예제는 정확히 아래의 예제와 같다. 즉, `?` 키워드 사용은 `| undefined`를 추가하는 것과 같다.

```tsx
function add(x: number, y: number | undefined): number {
  return x + (y || 0);
}
const sum = add(2, undefined);
console.log(sum);
```

### 2) 속성과 메소드(Properties and Methods)

`?`키워드를 속성(Properties)과 메소드(Methods) 타입 선언에도 사용할 수 있다. 다음은 인터페이스 파트에서 살펴봤던 예제이다. `isAdult`를 선택적 속성으로 선언하면서 더 이상 에러가 발생하지 않는다.

```tsx
interface IUser {
  name: string;
  age: number;
  isAdult?: boolean;
}
let user1: IUser = {
  name: "Vicky",
  age: 31,
  isAdult: true,
};
let user2: IUser = {
  name: "Vicky",
  age: 31,
};
```

Type이나 Class에서도 사용할 수 있다.

```tsx
interface IUser {
  name: string;
  age: number;
  isAdult?: boolean;
  validate?(): boolean;
}
type TUser = {
  name: string;
  age: number;
  isAdult?: boolean;
  validate?(): boolean;
};
abstract class CUser {
  abstract name: string;
  abstract age: number;
  abstract isAdult?: boolean;
  abstract validate?(): boolean;
}
```

### 3) 체이닝(Chaining)

아래 예제는 `str` 속성이 `undefined`일 경우 `toString` 메소드를 사용할 수 없기 때문에 에러가 발생한다.
`str` 속성이 문자열이라는 것을 단언하면 문제를 해결할 수 있지만, 더 간단하게 선택적 체이닝(Optional Chaining) 연산자 `?.` 를 사용할 수 있다.

자세한 사용법은 MDN 문서([여기 클릭](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining)) 참고하자

```tsx
obj?.prop;
obj?.[expr];
obj?.[index];
func?.(args);
```

```tsx
// Error - TS2532: Object is possibly 'undefined'.
function toString(str: string | undefined) {
  return str.toString();
}
// Type Assertion
function toString(str: string | undefined) {
  return (str as string).toString();
}
// Optional Chaining
function toString(str?: string) {
  return str?.toString();
}
```

특히 `&&` 연산자를 사용해 각 속성을 Nullish 체크(`null`이나 `undefined`를 확인)하는 부분에서 유용하다.

```tsx
// before
if (foo && foo.bar && foo.bar.baz) {
}
// after
if (foo?.bar?.bax) {
}
```

### 4) Nullish 병합 연산자

일반적으로 논리 연산자 ||를 사용해 Falsy 체크(0, "", NaN, null, undefined를 확인)하는 경우가 많다. 여기서 0이나 ""값을 유효 값으로 사용하는 경우 원치 않는 결과가 발생할 수 있는데, 이럴 떄 유용한 Nullish 병합(Nullish Coalescing) 연산자 ??를 타입스크립트에서 사용할 수 있다.

자세한 사용법은 MDN 문서([여기 클릭](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)) 참고하자

```tsx
const foo = null ?? "hello nullish";
console.log(foo); // hello nullish

const bar = false ?? true;
console.log(bar); // false

const baz = 0 ?? 12;
console.log(baz); // 0
```
