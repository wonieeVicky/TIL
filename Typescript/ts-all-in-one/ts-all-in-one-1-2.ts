// interface Array<T> {
//   forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
//   map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
//   filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
//   filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
// }

// const a: Array<number> = [1, 2, 3];
// a.forEach((v) => console.log(v)); // v를 number로 알아서 추론
// ["1", "2", "3"].forEach((v) => console.log(v)); // v를 string로 알아서 추론
// [true, false, true].forEach((v) => console.log(v)); // v를 boolean로 알아서 추론
// [1, "2", true].forEach((v) => console.log(v)); // v를 number | string | boolean로 알아서 추론

// const predicate = (value: string | number): value is string => typeof value === "string";
// const filtered = ["1", 2, "3", 4, 5].filter(predicate); // ["1", "3"] string[]

// type Arr = Array<number>;
interface Arr<T> {
  filter<S extends T>(callback: (v: T) => v is S): S[]; // S는 T의 부분집합임을 제네릭으로 표현
}

const a: Arr<number> = [1, 2, 3];
const b = a.filter((v): v is number => !(v % 2));

const c: Arr<number | string> = [1, "2", 3, "4", 5];
const d = c.filter((v): v is string => typeof v === "string"); // ["2", "4"]

const predicate = (v: string | number): v is number => typeof v === "number";
const e = c.filter(predicate); // [1, 3, 5]
