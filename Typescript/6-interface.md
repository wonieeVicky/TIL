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

}

### 3) 클래스 타입

인터페이스로 클래스를 정의하는 경우, `implements` 키워드를 사용한다.

```tsx
interface IUser {
  name: string;
  getName(): string;
}
class User implements IUser {
  constructor(public name: string) {}
  getName() {
    return this.name;
  }
}
const vicky = new User("Vicky");
vicky.getName(); // Vicky
```

기본적인 사용법은 어렵지 않으나 만약 정의한 클래스를 인수로 사용하는 경우 다음과 같은 문제가 발생할 수 있다. 아래의 예제에서 인터페이스 `ICat`은 호출 가능한 구조가 아니기 때문이다.

```tsx
interface ICat {
  name: string;
}

class Cat implements ICat {
  constructor(public name: string) {}
}

function makeKitten(c: ICat, n: string) {
  return new c(n); // Error - TS2351: This expression is not constructable. Type 'ICat' has no construct signatures.
}

const kitten = makeKitten(Cat, "Lucy");
console.log(kitten);
```

이를 위해 구성 시그니처(Construct signature)를 제공할 수 있다. 구성 시그니처는 위에서 살펴본 호출 시그니처와 비슷하지만, `new` 키워드를 사용해야 한다.

```tsx
interface IName {
  new (PARAMETER: PARAM_TYPE): RETURN_TYPE; // Construct signature
}
```

위 예제를 아래와 같이 수정한다. ICatConstructor 라는 구성 시그니처를 가지는  
호출 가능한 인터페이스를 정의하면, 문제없이 동작하는 것을 확인할 수 있다.

```tsx
interface ICat {
  name: string;
}
interface ICatConstructor {
  new (name: string): ICat;
}

class Cat implements ICat {
  constructor(public name: string) {}
}

function makeKitten(c: ICatConstructor, n: string) {
  return new c(n); // ok
}
const kitten = makeKitten(Cat, "Lucy");
console.log(kitten);
```

조금 어렵게 느껴진다. 비슷하지만 좀 더 재미있는 예제를 보자  
에러가 발생하는 부분을 확인하고 내용을 이해했다면 충분하다.

```tsx
interface IFullName {
  firshName: string;
  lastName: string;
}
interface IFullNameConstructor {
  new (firstName: string): IFullName;
}

function makeSon(c: IFullNameConstructor, firstName: string) {
  return new c(firstName);
}
function getFullName(son: IFullName) {
  return `${son.firshName}${son.lastName}`;
}

// Anderson family
class Anderson implements IFullName {
  public lastName: string;
  constructor(public firshName: string) {
    this.lastName = "Anderson";
  }
}

const tomas = makeSon(Anderson, "Tomas");
const jack = makeSon(Anderson, "Jack");
getFullName(tomas); // Tomas Anderson
getFullName(jack); // Jack Anderson

// Smith family?
class Smith implements IFullName {
  public lastName: string;
  constructor(public firshName: string, agentCode: number) {
    this.lastName = `Smith ${agentCode}`;
  }
}
const smith = makeSon(Smith, 7); // Error - TS2345: Argument of type 'typeof Smith' is not assignable to parameter of type 'IFullNameConstructor'.
getFullName(smith);
```
