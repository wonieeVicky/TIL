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

// 3) 클래스 타입
// 인터페이스로 클래스를 정의하는 경우, `implements` 키워드를 사용한다.
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

// 기본적인 사용법은 어렵지 않으나 만약 정의한 클래스를 인수로 사용하는 경우 다음과 같은 문제가 발생할 수 있다.
// 아래의 예제에서 인터페이스 `ICat`은 호출 가능한 구조가 아니기 때문이다.
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

// 이를 위해 구성 시그니처(Construct signature)를 제공할 수 있다.
// 구성 시그니처는 위에서 살펴본 호출 시그니처와 비슷하지만, new 키워드를 사용해야 한다.
interface IName {
  new (PARAMETER: PARAM_TYPE): RETURN_TYPE; // Construct signature
}

// 위 예제를 아래와 같이 수정한다. ICatConstructor 라는 구성 시그니처를 가지는
// 호출 가능한 인터페이스를 정의하면, 문제없이 동작하는 것을 확인할 수 있다.
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

// 조금 어렵게 느껴진다. 비슷하지만 좀 더 재미있는 예제를 보자
// 에러가 발생하는 부분을 확인하고 내용을 이해했다면 충분하다.
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
*/
// 4) 인덱싱 가능 타입(Indexable types)
// 우리는 인터페이스를 통해 특정 속성(메소드 등)의 타입을 정의할 순 있지만,
// 수많은 속성을 가지거나 단언할 수 없는 임의의 속성이 포함되는 구조에서는 기존의 방식만으론 한계가 있다.
// 이런 상황에서 유용한 인덱스 시그니처(Index signature)에 대해 살펴보자
interface INAME {
  [INDEXER_NAME: INDEXER_TYPE]: RETURN_TYPE; // Index signature
}

// 배열(객체)에서 위치를 가리키는 숫자(문자)를 인덱스(index)라고 하며,
// 각 배열 요소(객체 속성)에 접근하기 위하여 인덱스를 사용하는 것을 인덱싱(indexing)이라고 한다.
// (배열을 구성하는 각각의 값은 배열 요소(element)라고 한다)

// - 숫자로 인덱싱하는 예제
// 인터페이스 `ITem`은 인덱스 시그니처를 가지고 있으며, 그 `ITem`을 타입(인터페이스)으로 하는 `item`이 있고,
// 그 `item`을 `item[0]`이나 `item[1]`과 같이 숫자로 인덱싱할 때 반환되는 값은 `'a'`나 `'b'`같은 문자여야 한다.
// `item`을 `item['0']`과 같이 문자로 인덱싱하는 경우 에러가 발생한다.
interface ITem {
  [itemIndex: number]: string;
}
let item: ITem = ["a", "b", "c"]; // Indexable type
console.log(item[0]); // 'a' is string
console.log(item[1]); // 'b' is string
console.log(item["0"]); // Error - TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.
// 인덱싱 결과의 반환 타입으로 유니온을 사용하면 다음과 같이 활용할 수도 있다.
interface ITem {
  [itemIndex: number]: string | boolean | number[];
}
let item: ITem = ["Hello", false, [1, 2, 3]];
console.log(item[0]); // Hello
console.log(item[1]); // false
console.log(item[2]); // [1, 2, 3]

// - 문자로 인덱싱하는 예제
// 인터페이스 `IUser`는 인덱스 시그니처를 가지고 있으며, 그 `IUser`를 타입(인터페이스)로 하는 `user`가 있고,
// 그 `user`를 `user['name']`, `user['email']` 또는 user['isValid']와 같이 문자로 인덱싱할 때
// 반환되는 값은 `'Vicky'`나 `'hwfongfing@gmail.com'`과 같은 문자 혹은 `true`와 같은 불린이어야 한다.
// 또한, `user[0]`과 가은 숫자로 인덱싱하는 경우나 `user['0']`과 같이 문자로 인덱싱하는 경우 모두 인덱싱 전에 숫자가 문자열로 변환되기 때문에 아래와 같이 값을 반환할 수 있다.
interface IUser {
  [userProp: string]: string | boolean;
}
let user: IUser = {
  name: "Vicky",
  email: "hwfongfing@gmail.com",
  isValid: true,
  0: false,
};
console.log(user["name"]); // "Vicky"
console.log(user["email"]); // "hwfongfing@gmail.com"
console.log(user["isValid"]); // true
console.log(user[0]); // false is boolean
console.log(user[1]); // undefined
console.log(user[2]); // false is boolean

//인덱스 시그니처를 사용하면 아래와 같이 인터페이스에 정의되지 않은 속성들을 사용할 때 유용하다.
// 단, 해당 속성이 인덱스 시그니처에 정의된 반환 값을 가져야 함을 주의해야 한다.
// 다음 예제에서 isAdult 속성을 정의된 string이나 number 타입을 반환하지 않기 때문에 에러가 발생한다.
interface IUser {
  [userProp: string]: string | number;
  name: string;
  age: number;
}
let user: IUser = {
  name: "Vicky",
  age: 31,
  email: "hwfongfing@gmail.com",
  isAdult: true, // // Error - TS2322: Type 'true' is not assignable to type 'string | number'.
};
console.log(user["name"]); // Vicky
console.log(user["age"]); // 31
console.log(user["email"]); // "hwfongfing@gmail.com"
