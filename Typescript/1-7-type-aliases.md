## 타입 별칭(Type Aliases)

`type` 키워드를 사용해 새로운 타입 조합을 만들 수 있다.  
하나 이상의 타입을 조합해 별칭(이름)을 부여하며, 정확히는 조합한 각 타입들을 참조하는 별칭을 만드는 것이다.  
일반적인 경우 둘 이상의 조합으로 구성하기 위해 유니온을 많이 사용한다.

> TUser에서 T는 Type을 의미하는 별칭으로 사용한다.

```tsx
type MyType = string;
type YourType = string | number | boolean;
type TUser =
  | {
      name: string;
      age: number;
      isValid: boolean;
    }
  | [string, number, boolean];

let userA: TUser = {
  name: "Vicky",
  age: 31,
  isValid: true,
};
let userB: TUser = ["Wonny", 32, false];

function someFunc(arg: MyType): YourType {
  switch (arg) {
    case "s":
      return arg.toString(); // string
    case "n":
      return parseInt(arg); // number
    default:
      return true; // boolean
  }
}
```
