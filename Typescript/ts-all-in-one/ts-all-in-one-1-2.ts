interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}

const a: Array<number> = [1, 2, 3];
a.forEach((v) => console.log(v)); // v를 number로 알아서 추론
["1", "2", "3"].forEach((v) => console.log(v)); // v를 string로 알아서 추론
[true, false, true].forEach((v) => console.log(v)); // v를 boolean로 알아서 추론
[1, "2", true].forEach((v) => console.log(v)); // v를 number | string | boolean로 알아서 추론

const numArr = [1, 2, 3].map((v) => v + 1);
