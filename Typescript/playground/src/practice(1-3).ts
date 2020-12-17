// 1-prepare-environment-for-using-typescript
/* const message: string = "hello world";
console.log(message);

// 2-assign-type-and-type-error
// 1) 타입 지정
function add(a: number, b: number) {
  return a + b;
}
const sum: number = add(1, 2);
console.log(sum); // 3

// 2) 타입 에러
let count = 0; // 숫자
count += 1;
// count = "갑자기 문자열"; // 에러 발생!

const msg: string = "hello world"; // 문자열
const done: boolean = true; // 불리언 값

const numbers: number[] = [1, 2, 3]; // 숫자 배열
const messages: string[] = ["hello", "world"]; // 문자열 배열

// messages.push(1); // 문자열인데, 숫자를 넣으면 안된다

let mightBeUndefined: string | undefined = undefined; // string or undefined
let nullableNumber: number | null = null; // number or null

let color: "red" | "orange" | "yellow" = "red"; // red, orange, yellow 중에 하나
color = "yellow";
// color = "green"; // 에러 발생!

// 3-declaration-type
// 1) 불린
let isBoolean: boolean;
let isDone: boolean = false;

// 2) 숫자
let num: number;
let integer: number = 6;
let float: number = 3.14;
let hex: number = 0xf00d; // 61453
let binary: number = 0b1010; // 10
let octal: number = 0o744; // 484
let infinity: number = Infinity;
let nan: number = NaN;

// 3) 문자열
let str: string;
let red: string = "Red";
let green: string = "Green";
let myColor: string = `My color is ${red}`;
let yourColor: string = "Your color is" + green;

// 4) 배열
// 문자열만 가지는 배열
let fruits_type1: string[] = ["apple", "banana", "mango"];
let fruits_type2: Array<string> = ["apple", "banana", "mango"];

// 숫자만 가지는 배열
let oneToSeven_type1: number[] = [1, 2, 3, 4, 5, 6, 7];
let oneToSeven_type2: Array<number> = [1, 2, 3, 4, 5, 6, 7];

// 유니언 타입(다중 타입)의 '문자열과 숫자를 동시에 가지는 배열'도 선언 가능
let unionArray_type1: (string | number)[] = ["apple", 1, 2, "banana", 3];
let unionArray_type2: Array<string | number> = ["apple", 1, 2, "banana", 3];

// 배열이 가지는 항목의 값을 단언할 수 없을 때 any 사용
let someArr: any[] = [0, 1, {}, [], "str", false];

// 인터페이스(interface)나 커스텀 타입(Type) 사용
interface IUser {
  name: string;
  age: number;
  isValid: boolean;
}
let userArr: IUser[] = [
  {
    name: "Vicky",
    age: 31,
    isValid: true,
  },
  {
    name: "Woniee",
    age: 30,
    isValid: false,
  },
  {
    name: "Hannah",
    age: 26,
    isValid: true,
  },
];

// 유용하지 않지만 특정한 값으로 타입을 대신해 작성도 가능하다.
// let array = 10[];
// array = [10];
// array.push(10);
// array.push(11); // Error - TS2345

// 읽기 전용 배열을 생성할 수도 있다. readonly 키워드나 ReadonlyArray 타입을 사용하면 된다.
let arrA: readonly number[] = [1, 2, 3, 4];
let arrB: ReadonlyArray<number> = [0, 9, 8, 7];
// arrA[0] = 123; // 'readonly number[]' 형식의 인덱스 시그니처는 읽기만 허용된다.
// arrA.push(123); // 'readonly number[]' 형식에 'push' 속성이 없다.
// arrB[0] = 123; // 'readonly number[]' 형식의 인덱스 시그니처는 읽기만 허용된다.
// arrB.push(123); // 'readonly number[]' 형식에 'push' 속성이 없다.

// 5) 튜플
// Tuple 타입은 배열과 매우 유사하나 정해진 타입의 고정된 길이(length)배열을 표현한다.
let tuple: [string, number];
tuple = ["a", 1];
// tuple = ["a", 1, 2]; // Error - TS2322
// tuple = [1, "a"]; // Error - TS2322

// 데이터를 개별 변수로 지정하지 않고, 단일 tuple 타입으로 지정해 사용할 수 있다.
// variable
let userId: number = 1234;
let userName: string = "vicky";
let isValid: boolean = true;
// tuple
let user: [number, string, boolean] = [1234, "vicky", true];
console.log(user[0]); // 1234
console.log(user[1]); // vicky
console.log(user[2]); // true

// 위 방식을 활용해 다음과 같은 Tuple 타입의 배열(2차원 배열)을 사용할 수 있다.
let users: [number, string, boolean][];
// or
// let users: Array<[number, string, boolean]>;
users = [
  [1, "choi", true],
  [2, "sun", true],
  [3, "jin", false],
];

// 역시 값으로 타입을 대신할 수도 있다.
let tuple_2: [1, number];
tuple_2 = [1, 2];
tuple_2 = [1, 3];
// tuple_2 = [2, 3]; // Error - TS2322: '2' 형식은 '1' 형식에 할당할 수 없다.

// Tuple은 정해진 타입의 고정된 길이 배열을 표현하지만 이는 할당(Assign)에 국한된다. 값을 넣는 행위는 불가함
let tuple_3: [string, number];
tuple_3 = ["a", 1];
tuple_3 = ["b", 2];
tuple_3.push(3);
console.log(tuple_3); // ['b', 2, 3];
// tuple_3.push(true); // Error - TS2345: boolean 형식의 인수는 string, number 형식의 매개 변수에 할당될 수 없다.

// 배열에 사용한 것과 같이 readonly 키워드를 사용해 읽기 전용 튜플을 생성할 수도 있다.
let a: readonly [string, number] = ["hello", 123];
a[0] = "world"; // Error - TS2540: 읽기 전용 속성이므로 '0'에 할당할 수 없다.

// 6) 열거형
// enum 타입은 기본적으로 0부터 시작하여 값은 1씩 증가
enum Week {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Week.Mon); // 1
// 수동으로 값을 변경할 수 있고, 값을 변경한 부분부터 다시 1씩 증가
enum Weeks {
  Sun,
  Mon = 22,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Weeks.Mon); // 23

// Enum타입은 역방향 매핑(Reverse Mapping)을 지원한다.
enum Week {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
console.log(Week);
console.log(Week.Sun); // 0
console.log(Week["Sun"]); // 0
console.log(Week[0]); // 'Sun'

// Enum 타입은 숫자 값 열거 뿐만 아니라 문자열 값으로 초기화도 가능하다.
// 이 방법은 역방향 매핑(Reverse Mapping)을 지원하지 않으며 개별적으로 초기화해야하는 단점이 있다.
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}
console.log(Color.Red); // red
console.log(Color["Green"]); // green

// 7) 모든 타입
// Any는 외부 자원을 활용해 개발 할 때 불가피하게 타입을 단언할 수 없는 경우 유용하게 쓰인다.
let any: any = 123;
any = "hello world";
any = true;
any = {};
any = null;

const list: any[] = [1, true, "anything", {}, []];

// 8) 알 수 없는 타입: Unknown
// Any와 같이 Unknown에는 어떤 타입의 값도 할당할 수 있지만, Unknown을 다른 타입에는 할당할 수 없다.
let a: any = 123;
let u: unknown = 123;
let v1: boolean = a;
let v2: any = u; // 알 수 없는 타입(unknown)은 모든 타입(any)에 할당할 수 있다.
let v3: number = u; // 알 수 없는 타입(unknown)은 모든 타입(any)을 제외한 다른 타입에 할당할 수 없다.
let v4: number = u as number; // 타입을 단언(Assertions)하면 할당할 수 있다.

// Unknown 타입의 경우 다양한 타입을 반환할 수 있는 API에서 유용할 수 있다.
interface IUser {
  name: string;
  age: number;
  isValid: boolean;
}

type Result =
  | {
      success: true;
      value: unknown;
    }
  | {
      success: false;
      error: Error;
    };

export default function getItems(user: IUser): Result {
  // Some logic...
  if (user.isValid) {
    return {
      success: true,
      value: ["Apple", "Banana"],
    };
  } else {
    return {
      success: false,
      error: new Error("Invalid user."),
    };
  }
}

// 9) 객체
let obj: object = {};
let arr: object = [];
let func: object = function () {};
let nullValue: object = null; // strict: true 일 경우 에러 발생!
let date: object = new Date();

// 보다 정확한 타입 지정을 위해 객체 속성(Properties)들에 대한 타입을 개별적으로 지정 가능
let userA: { name: string; age: number } = {
  name: "Vicky",
  age: 31,
};
let userB: { name: string; age: number } = {
  name: "vicky",
  age: false, // error
  email: "hwfongfing@gmail.com", // error
};

// 반복적으로 사용하기 위해서는 interface나 type을 사용하는 것이 좋다.
interface IUser {
  name: string;
  age: number;
}
let userA: IUser = {
  name: "VICKY",
  age: 31,
};
let userB: IUser = {
  name: "VICKY",
  age: false, // error
  email: "hwfongfing@gmail.com", // error
};

// 10) Null과 Undefined
// 기본적으로 Null과 Undefined는 모든 타입의 하위 타입으로, 각 타입에 할당할 수 있다.
// 심지어 서로의 타입에도 할당 가능하다. 단 strict: false일 때만 가능하다.
let num: number = undefined;
let str: string = null;
let obj: { a: 1; b: false } = undefined;
let arr: any[] = null;
let und: undefined = null;
let nul: null = undefined;
let voi: void = null;

// 다만 Void에는 Undefined를 할당할 수 있다.
let voi: void = undefined;

// 11) Void
// Void는 일반적으로 값을 반환하지 않는 함수에서 사용한다. :void 위치는 함수가 반환 타입을 명시하는 곳이다.
function Hello(msg: string): void {
  console.log(`Hello ${msg}`);
}

// 값을 반환하지 않는 함수는 실제 undefined를 반환한다.
function Hello(msg: string): void {
  console.log(`Hello ${msg}`);
}
const hi: void = Hello("word");
console.log(hi); // undefined

// Error - TS2355: A function whose declared type is neither 'void' nor 'any' must return a value.
function Hello(msg: string): undefined {
  console.log(`Hello ${msg}`);
}

// 12) never
// Never는 절대 발생하지 않을 값을 나타내며, 어떤 타입도 적용할 수 없다.
function error(message: string): never {
  throw new Error(message);
}
// 보통 아래와 같이 빈 배열을 타입으로 잘못 선언한 경우, Never를 볼 수 있다.
const never: [] = [];
never.push(3);

// 13) Union
// 2개 이상의 타입을 허용하는 경우, 이를 유니언(Union)이라고 한다.
// `|(vertical bar)`를 통해 타입을 구분하며, `()`는 선택사항이다.
let union: string | number;
union = "hello typescript!";
union = 123;
union = false; // Error - TS2322: Type 'false' is not assignable to type 'string | number'.
 
// 14) Intersection
// `&(ampersand)`를 사용해 2개 이상의 타입을 조합하는 경우, 이를 인터섹션이라고 한다. 인터섹션은 새로운 타입을 생성하지 않고, 기존의 타입들을 조합할 수 있기 때문에 유용하지만 자주 사용되는 방법은 아니다.
// 기존 타입들이 조합 가능하다면 인터섹션을 활용할 수 있다.
interface IUser {
  name: string,
  age: number
}
interface IValidation {
  isValid: boolean
}
const vicky: IUser = {
  name: 'vicky',
  age: 36,
  isValid: true; // Error TS2322: Type '{ name: string; age: number; isValid: boolean; }' is not assignable to type 'IUser'.
}
const neo: IUser & IValidation = {
  name: 'wonny',
  age: 31,
  isValid: true;
}

// 혹은 기존 타입(IUser, IValidation)과 비슷하지만, 정확히 일하는 타입이 없다면 새로운 타입을 생성해야 한다.
interface IUserNew {
  name: string,
  age: number,
  isValid: boolean
}
const evan: IUserNew = {
  name: 'Evan',
  age: 36,
  isValid: false
};
*/
// 15) 함수(Function)
// 화살표 함수를 이용해 타입을 지정할 수 있다. 인수의 타입과 반환 값의 타입을 입력한다.
// myFunc는 2개의 숫자 타입 인수를 가지고, 숫자 타입을 반환하는 함수
let myFunc: (arg1: number, arg2: number) => number;
myFunc = function (x, y) {
  return x + y;
};

// 인수가 없고, 반환도 없는 경우
let yourFunc: () => void;
yourFunc = function () {
  console.log("hello world!");
};
