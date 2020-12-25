// 7. 타입 별칭
// 하나 이상의 타입을 조합해 새로운 타입 조합 만들기 (각 타입들을 참조하는 별칭 만들기)
/* type MyType = string;
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

// 8. 제네릭(Generic)
// 사용 시점에 타입을 선언하는 제네릭 타입
function toArray(a: number, b: number): number[] {
  return [a, b];
}
toArray(1, 2);
toArray("1", "2"); // Error - TS2345: Argument of type '"1"' is not assignable to parameter of type 'number'.

// 조금 더 범용적 사용을 위해 유니언 방식으로 사용하기
// 문제점: String 타입을 인수로 받을 수 있으나 가독성이 떨어지고
// 세번째 호출을 보면 의도치 않게 Number와 String 타입을 동시에 받을 수 있게됨
function toArray(a: number | string, b: number | string): (number | string)[] {
  return [a, b];
}
toArray(1, 2); // only Number
toArray("1", "2"); // only String
toArray(1, "2"); // Number & String

// 제네릭을 사용해 위 이슈를 개선해보자
function toArray<T>(a: T, b: T): T[] {
  return [a, b];
}
toArray<number>(1, 2);
toArray<string>("1", "2");
toArray<string | number>(1, "2");
toArray<number>(1, "2"); // Error

// 타입 추론을 활용하면 굳이 사용 시점에 타입을 제공하지 않을 수 있음
toArray(1, 2);
toArray("1", "2");
toArray(1, "2"); // Error
 

// 1) 제약 조건(Constraints) : 인터페이스나 타입 별칭을 사용하여 만들 수도 있다
interface MyType<T> {
  name: string;
  value: T;
}
const dataA: MyType<string> = {
  name: "Data A",
  value: "Hello world",
};
const dataB: MyType<number> = {
  name: "Data B",
  value: 1234,
};
const dataC: MyType<boolean> = {
  name: "Data C",
  value: true,
};
const dataD: MyType<number[]> = {
  name: "Data D",
  value: [1, 2, 3, 5],
};

// 2) 조건부 타입(Conditional Types)
// '타입 구현' 영역에서 사용하는 extends : 삼항 연산자를 사용할 수 있다.
// T extends U ? X : Y

type U = string | number | boolean;

// type 식별자 = 타입 구현
type MyType<T> = T extends U ? string : never;

// interface 식별자 { 타입 구현 }
interface IUser<T> {
  name: string;
  age: T extends U ? number : never;
}

// `T`는 `boolean` 타입으로 제한./*
interface IUser<T extends boolean> {
  name: string;
  age: T extends true ? string : number; // `T`의 타입이 `true`인 경우 `string` 반환, 아닌 경우 `number` 반환.
  isString: T;
}

const str: IUser<true> = {
  name: 'Neo',
  age: '12', // String
  isString: true,
};
const num: IUser<false> = {
  name: 'Lewis',
  age: 12, // Number
  isString: false,
};

// 삼항 연산자를 연속으로 사용한 사례
type MyType<T> = T extends string
  ? 'Str'
  : T extends number
  ? 'Num'
  : T extends boolean
  ? 'Boo'
  : T extends undefined
  ? 'Und'
  : T extends null
  ? 'Nul'
  : 'obj';


// 3) infer
// 타입 변수의 타입 추론(Inference) 여부를 확인할 수 있는 infer 키워드
// T extends infer U ? X : Y
type MyType<T> = T extends infer R ? R : null;
const a: MyType<number> = 123;

// 조금 더 유용하지만 복잡함
// ReturnType은 실제 TS 유틸리티 타입에 이미 선언되어있는 함수이다.
// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
function fn(num: number) {
  return num.toString();
}
const a: ReturnType<typeof fn> = 'Hello';
*/
