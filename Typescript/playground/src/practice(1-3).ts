﻿// 1-prepare-environment-for-using-typescript
const message: string = "hello world";
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
tuple = ["a", 1, 2]; // Error - TS2322
tuple = [1, "a"]; // Error - TS2322

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
tuple_2 = [2, 3]; // Error - TS2322: '2' 형식은 '1' 형식에 할당할 수 없다.

// Tuple은 정해진 타입의 고정된 길이 배열을 표현하지만 이는 할당(Assign)에 국한된다. 값을 넣는 행위는 불가함
let tuple_3: [string, number];
tuple_3 = ["a", 1];
tuple_3 = ["b", 2];
tuple_3.push(3);
console.log(tuple_3); // ['b', 2, 3];
tuple_3.push(true); // Error - TS2345: boolean 형식의 인수는 string, number 형식의 매개 변수에 할당될 수 없다.

// 배열에 사용한 것과 같이 readonly 키워드를 사용해 읽기 전용 튜플을 생성할 수도 있다.
let a: readonly [string, number] = ["hello", 123];
a[0] = "world"; // Error - TS2540: 읽기 전용 속성이므로 '0'에 할당할 수 없다.
