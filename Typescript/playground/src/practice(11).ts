// 11. Optional(?)
// 1) 선택적 매개 변수(Optional Parameter)
// 타입 선언 시 사용하는 선택적 매개 변수(Optional Parameter)
function add(x: number, y?: number): number {
  return x + (y || 0);
}
const sum = add(2);
console.log(sum);

// 위 코드는 아래와 정확히 같다.
// ? 키워드는 | undefined과 같음
function add(x: number, y: number | undefined): number {
  return x + (y || 0);
}
const sum = add(2, undefined);
console.log(sum);

// 2) 속성(properties)과 메소드(methods)
// 속성과 메소드 타입 선언 시에도 ? 키워드를 쓸 수 있음
interface IUser {
  name: string;
  age: number;
  isAdult?: boolean;
}
let user1: IUser = {
  name: "Vicky",
  age: 31,
  isAdult: true,
};
let user2: IUser = {
  name: "Vicky",
  age: 31,
};
// Type이나 Class 에서도 사용 가능
interface IUser {
  name: string;
  age: number;
  isAdult?: boolean;
  validate?(): boolean;
}
type TUser = {
  name: string;
  age: number;
  isAdult?: boolean;
  validate?(): boolean;
};
abstract class CUser {
  abstract name: string;
  abstract age: number;
  abstract isAdult?: boolean;
  abstract validate?(): boolean;
}
