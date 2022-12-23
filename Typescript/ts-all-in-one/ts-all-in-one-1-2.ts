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
  forEach(callback: (item: T, index: number) => void): void;
}

const a: Arr<number> = [1, 2, 3];

a.forEach((item) => {
  console.log(item);
  item.toFixed(1);
});

const b: Arr<string> = ["1", "2", "3"];

b.forEach((item) => {
  console.log(item);
  item.charAt(3);
});

const c: Arr<string | number> = [1, "2", "3"];

b.forEach((item) => {
  console.log(item);
  item.charAt(3);
});
