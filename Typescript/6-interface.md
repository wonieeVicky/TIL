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

### 1) 읽기 전용 속성(Readonly properties)

`readonly` 키워드를 사용하면 초기화된 값을 유지해야 하는 **읽기 전용 속성을 정의**할 수 있다.

```tsx
interface IUser {
  readonly name: string;
  age: Number;
}

// 초기화(initialize)
let user: IUser = {
  name: "Vicky",
  age: 31,
};

user.age = 32; // Ok
user.name = "Wonny"; // Error - TS2540: Cannot assign to 'name' because it is a read-only property.
```

만약 모든 속성이 `readonly`일 경우 [유틸리티(Utility)](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlyt)나 단언(Assertion) 타입을 활용할 수 있다.

```tsx
// All readonly properties
interface IUser {
  readonly name: string;
  readonly age: number;
}
let user: IUser = {
  name: "Vicky",
  age: 31,
};
user.age = 32; // Error
user.name = "Wonny"; // Error

// Readonly Utility
interface IUser {
  name: string;
  age: number;
}
let user: Readonly<IUser> = {
  name: "Vicky",
  age: 31,
};
user.age = 32; // Error
user.name = "Wonny"; // Error

// Type assertion
let user = {
  name: "Vicky",
  age: 31,
} as const;
user.age = 32; // Error
user.name = "Wonny"; // Error
```

### 2) 함수 타입

함수 타입을 인터페이스로 정의하는 경우, 호출 시그니처(Call signature)라는 것을 사용한다.  
호출 시그니처는 다음과 같이 함수의 매개변수(parameter)와 반환 타입을 지정한다.

```tsx
interface IName {
  (PARAMETER: PARAM_TYPE): RETURN_TYPE; // 호출 시그니처(Call signature)
}
```

간단한 예시를 살펴보자. 인터페이스 `IGetUser`를 통해 함수 타입을 정의했으며,  
이는 `name` 매개 변수를 하나 가지고(이름이 일치할 필요는 없다.) `IUser` 타입을 반환해야 한다.

```tsx
interface IUser {
  name: string;
}
interface IGetUser {
  (name: string): IUser;
}
// 매개 변수의 이름이 인터페이스와 일치할 필요는 없다.
// 또한 타입 추론을 통해 매개 변수를 순서에 맞게 암시적 타입으로 제공할 수 있다.
const getUser: IGetUser = function (n) {
  // n is name: string
  // Find user logic
  // ..
  return user;
};
getUser("Vicky");
```
