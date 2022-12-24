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
// interface Arr<T> {
//   // filter<S extends T>(callback: (v: T) => v is S): S[]; // S는 T의 부분집합임을 제네릭으로 표현
//   // some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
//   some(callback: (value: T, index: number) => boolean): boolean;
// }

// const a: Arr<number> = [1, 2, 3];
// const b = a.some((v) => !(v % 2));

// const c: Arr<number | string> = [1, "2", 3, "4", 5];
// const d = c.some((v) => typeof v === "string"); // ["2", "4"]

// const predicate = (v: string | number) => typeof v === "number";
// const e = c.some(predicate); // [1, 3, 5]

// 공변성, 반공변성.. 함수 간에 서로 대입

// function a(x: string | number): number {
//   return +x;
// }

// type B = (x: string) => number;
// const b: B = a;

// let d: 5 = 5;
// let e = 5;

// overloading
// declare function overAdd(x: number, y: number, z?: number): number;
// declare function overAdd(x: number, y: number): number;
// declare function overAdd(x: string, y: string): string;
// declare function overAdd(x: number, y: number, z: number): number;

// overAdd(1, 2);
// overAdd(2, 3, 4);
// overAdd("1", "2");

// class A {
//   add(x: number, y: number): number;
//   add(x: string, y: string): string;
//   add(x: any, y: any) {
//     return x + y;
//   }
// }

// const c = new A().add(1, 2); // number
// const d = new A().add("가", "나"); // string

interface Axios {
  get: () => void;
}

// axios 라이브러리를 쓰면 기본 Error 타입에 response 객체가 추가되므로
// 아래와 같이 interface를 확장해서 커스텀한 뒤 사용한다.
class CustomError extends Error {
  response?: {
    data: any;
  };
}
declare const axios: Axios;

(async () => {
  try {
    await axios.get();
  } catch (err: unknown) {
    if (err instanceof CustomError) {
      const customError = err as CustomError;
      console.error(customError.response?.data);
      customError.response?.data; // Error
    }
  }
})();

const a = <T = unknown>(v: T): T => v;
const c = a(3);
