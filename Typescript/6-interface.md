## 인터페이스(Interface)

인터페이스(Interface)는 타입스크립트 여러 객체를 정의하는 일종의 규칙이며 구조이다.  
아래와 같이 `interface` 키워드와 함께 사용한다.

> 'IUser'에서 'I'는 Interface를 의미하는 별칭으로 사용했다.

```tsx
interface IUser {
  name: string;
  age: number;
  isAdult: boolean;
}

let user1: IUser = {
  name: "Neo",
  age: 123,
  isAdult: true,
};

// Error - TS2741: Property 'isAdult' is missing in type '{ name: string; age: number; }' but required in type 'IUser'.
let user2: IUser = {
  name: "Neo",
  age: 123,
};
```

세미 콜론`;` , 콤마`,` 혹은 기호를 사용하지 않을 수도 있다. (하지만 vscode에서 저장 시 autoFormat 기능이 활성화되어 있을 경우 자동으로 기호를 붙여준다)

```tsx
interface IUser {
  name: string;
  age: number;
  isAdult: boolean;
}
// Or
interface Iuser {
  name: string;
  age: number;
}
// Or
interface Iuser {
  name: string;
  age: number;
}
```

다음과 같이 속성에 `?` 를 사용하면 선택적 속성으로 정의할 수 있다. 선택적 속성(Optional properties)이란 간단히 표현하면 '필수가 아닌 속성으로 정의'하는 방법을 말하는데 Optional 파트에서 별도로 자세히 알아본다.

```tsx
interface IUser {
  name: string;
  age: number;
  isAdult?: boolean; // Optional property
}

// 'isAdult'를 초기화하지 않아도 에러가 발생하지 않는다.
let user: IUser = {
  name: "Vicky",
  age: 123,
};
```
