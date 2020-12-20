// 인터페이스(Interface)
// 인터페이스(Interface)는 타입스크립트 여러 객체를 정의하는 일종의 규칙이며 구조이다.
// 아래와 같이 `interface` 키워드와 함께 사용한다.
/* interface IUser {
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

// 콜론: , 콤마, 혹은 기호를 사용하지 않을 수도 있다.
interface IUser {
  name: string,
  age: number,
  isAdult: boolean,
}
// Or
interface Iuser {
  name: string;
  age: number;
}
// Or
interface Iuser{
  name: string
  age: number
}

//다음과 같이 속성에 ? 를 사용하면 선택적 속성으로 정의할 수 있다.
// 선택적 속성(Optional properties)이란 간단히 표현하면 '필수가 아닌 속성으로 정의'하는 방법을 말하는데 Optional 파트에서 별도로 자세히 알아본다.
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

// 1) 읽기 전용 속성(Readonly properties)
// readonly 키워드를 사용하면 초기화된 값을 유지해야 하는 **읽기 전용 속성을 정의**할 수 있다.
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

// 만약 모든 속성이 readonly일 경우 유틸리티(Utility)나 단언(Assertion) 타입을 활용할 수 있다.
// All readonly properties
interface IUser1 {
  readonly name: string;
  readonly age: number;
}
let user1: IUser1 = {
  name: "Vicky",
  age: 31,
};
user1.age = 32; // Error
user1.name = "Wonny"; // Error

// Readonly Utility
interface IUser2 {
  name: string;
  age: number;
}
let user2: Readonly<IUser2> = {
  name: "Vicky",
  age: 31,
};
user2.age = 32; // Error
user2.name = "Wonny"; // Error

// Type assertion
let user3 = {
  name: "Vicky",
  age: 31,
} as const;
user3.age = 32; // Error
user3.name = "Wonny"; // Error

// 2) 함수타입

// 함수 타입을 인터페이스로 정의하는 경우, 호출 시그니처(Call signature)라는 것을 사용한다.
// 호출 시그니처는 다음과 같이 함수의 매개변수(parameter)와 반환 타입을 지정한다.
interface IName {
  (PARAMETER: PARAM_TYPE): RETURN_TYPE; // 호출 시그니처(Call signature)
}
*/
// 간단한 예시를 살펴보자. 인터페이스 IGetUser를 통해 함수 타입을 정의했으며,
// 이는 name 매개 변수를 하나 가지고(이름이 일치할 필요는 없다.) IUser 타입을 반환해야 한다.
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
