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
