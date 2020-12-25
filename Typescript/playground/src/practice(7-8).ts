// 7. 타입 별칭
// 하나 이상의 타입을 조합해 새로운 타입 조합 만들기 (각 타입들을 참조하는 별칭 만들기)
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
