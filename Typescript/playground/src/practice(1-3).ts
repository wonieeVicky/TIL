// 1-prepare-environment-for-using-typescript
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
