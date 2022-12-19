// const a = 5;
// const b: number = 5;
// const c: boolean = true;
// const d: undefined = undefined;
// const e: null = null;
// const f: symbol = Symbol.for("abc");
// const g: bigint = 1000000n;
// const h: any = "any";
// const i: any = true;

// /* function add(a: number, b: number): number {
//   return a + b;
// } */

// // type Add = (x: number, y: number) => number;
// interface Add {
//   (x: number, y: number): number;
// }
// const add: Add = (a, b) => a + b;

// const obj: {
//   x: number;
//   y: number;
// } = { x: 1, y: 2 };

// const arr: string[] = ["a", "b", "c"];
// const arr2: Array<number> = [123, 456, 789];

// // 길이가 고정되었을 때 튜플로 정의
// const arr3: [number, number, string] = [1, 2, "3"];

// function add4(x: number, y: number): number;
// function add4(x, y) {
//   return x + y;
// }

// let test = 123;
// test = "hello" as unknown as number;

// try {
//   const array: string[] = [];
//   array.push("hello");
// } catch (error) {
//   error;
// }

// // const head = document.querySelector("#head")!

// // console.log(head);
// // head.innerHTML = "hello";

// const head = document.querySelector("#head");
// if (head) {
//   head.innerHTML = "hello";
//   console.log(head);
// }

// const aa: string = "hello";
// const bb: String = "hell";

// function cc(a1: string, b1: string) {}
// // cc(aa, bb);

// type World = "world" | "hell";
// type Greeting = `hello ${World}`;
// // const GreetingResult: Greeting = "";

// function rest(a, ...args: string[]) {
//   console.log(a, args); // [1,2,3]
// }

// rest(1, "2", "3");

// const tuple: [string, number] = ["1", 1];
// // tuple[2] = "hello"; // Error
// tuple.push("hello");

// // enum은 JavaScript 변환 시 사라진다.
// const enum EDirection {
//   Up = 3,
//   Down,
//   Left = "hello",
//   Right = "vicky",
// }

// // object는 JavaScript 변환 시 유지된다.
// const ODirection = {
//   Up: 3,
//   Down: 1,
//   Left: "hello",
//   Right: "vicky",
// } as const;

// const e_up = EDirection.Up; // 3
// const e_down = EDirection.Down; // 4
// const e_left = EDirection.Left; // hello
// const e_right = EDirection.Right; // vicky

// const o_up = ODirection.Up; // 3
// const o_down = ODirection.Down; // 4
// const o_left = ODirection.Left; // hello
// const o_right = ODirection.Right; // vicky

// function walk(dir: EDirection) {}
// // It requires an extra line to pull out the keys
// type Direction = typeof ODirection[keyof typeof ODirection];
// function run(dir: Direction) {}

// walk(EDirection.Up);
// run(ODirection.Up);

// const testObj = { a: "123", b: 123, c: true } as const;
// type Key = typeof testObj[keyof typeof testObj];

// type A = { a: string };
// const aaa: A = { a: "123" };

// interface B {
//   a: string;
// }
// const bbb: B = { a: "123" };

// type TypeUnion = string | number;
// const txtUnion: TypeUnion = 123;

// type TypeUnionObj = { hello: "world" } | { vicky: "choi" };
// const unionObj1: TypeUnionObj = { hello: "world" };
// const unionObj2: TypeUnionObj = { vicky: "choi" };
// const unionObj3: TypeUnionObj = { hello: "world", vicky: "choi" };

// type TypeIntersectionObj = { hello: "world" } & { vicky: "choi" };
// const intersectionObj1: TypeIntersectionObj = { hello: "world", vicky: "choi" };
// const intersectionObj2: TypeIntersectionObj = { hello: "world" }; // Error

// type Animal = { breath: true };
// type Mamal = Animal & { breed: true };
// type Human = Mamal & { think: true };

// const vicky: Human = { breath: true, breed: true, think: true };

// interface AnimalInterface {
//   breath: true;
// }

// interface MamalInterface extends Mamal {
//   breed: true;
// }

// const baduc: MamalInterface = { breath: true, breed: true };

// interface SameInterface {
//   talk: () => void;
// }
// interface SameInterface {
//   eat: () => void;
// }
// interface SameInterface {
//   shit: () => void;
// }

// const same: SameInterface = {
//   talk: () => {},
//   eat: () => {},
//   shit: () => {},
// };

// interface Props {}
// type Type = string | number;
// enum Hello {
//   Left,
//   Right,
// }

// const a: Props = {};

// type A = string | number; // 넓은 타입
// type B = string; // 좁은 타입
// type AB = A | B;

// type objA = { name: string }; // 속성이 좁을수록 넓은 타입
// type objB = { age: number }; // 속성이 좁을수록 넓은 타입

// type objAB = objA | objB;
// type objC = objA & objB; // name, age 속성을 가짐

// const ab: objAB = { name: "vicky" };
// const obj = { name: "vicky", age: 33, married: false };
// const c: objC = obj;

// void 두 가지 사용법
// function a(): void {
//   return;
//   return undefined;
//   // return null
//   // return 3;
// }

// const b = a();

// interface Human {
//   talk: () => void;
// }

// const human: Human = {
//   talk() {
//     return "vicky";
//   },
// };

// const human2 = human.talk() as unknown as number;
// const human3 = <number>(<unknown>human.talk());
// console.log(`${human3}`);

// function test(callback: () => void): void {}
// test(() => {
//   return "3";
// });

// declare function forEach(arr: number[], callback: (el: number) => void): void;
// let target: number[] = [];

// forEach([1, 2, 3], (el) => {
//   target.push(el);
// });
// forEach([1, 2, 3], (el) => {
//   return target.push(el);
// });

// interface Human {
//   talk: () => void;
// }

// const human: Human = {
//   talk() {
//     return 123;
//   },
// };
// const b = human.talk() as unknown as number;
// b.toString();

// try {
//   // something that might throw an error
// } catch (Error) {
//   (Error as Error).message;
// }

function numOrStr(a: number | string) {
  if (typeof a === "string") {
    return a.charAt(3);
  }
  if (typeof a === "number") {
    a.toFixed(1);
  }
}

function numOrNumArray(a: number | number[]) {
  // number[]
  if (Array.isArray(a)) {
    return a.push(3);
  }
  // number
  return a.toFixed(1);
}
numOrNumArray([1, 2]);
numOrNumArray(123);

// class A {
//   aaa() {}
// }
// class B {
//   bbb() {}
// }

// function aOrb(params: A | B) {
//   if (params instanceof A) {
//     params.aaa();
//   }
//   if (params instanceof B) {
//     params.bbb();
//   }
// }

// aOrb(A());
// aOrb(new A());

// type A = { type: "a"; aaa: string };
// type B = { type: "c"; bbb: string };
// type C = { type: "c"; ccc: string };

// function typeCheck(a: A | B | C) {
//   // a 객체 안에 bbb 속성이 있을 경우
//   if ("bbb" in a) {
//     return a.bbb;
//   }
//   if ("ccc" in a) {
//     return a.ccc;
//   }
// }

// type Human = { type: "human"; talk: () => {} };
// type Dog = { type: "dog"; bow: () => {} };
// type Cat = { type: "cat"; meow: () => {} };

// function reply(a: Human | Dog | Cat) {
//   if ("talk" in a) {
//     a.talk();
//   }
// }

// interface Cat {
//   meow: number;
// }
// interface Dog {
//   bow: number;
// }

// // is: 타입을 구분해주는 커스텀 함수를 직접 만든다.
// function catOrDog(a: Cat | Dog): a is Dog {
//   // 타입 판별을 직접한다.
//   if ((a as Cat).meow) {
//     return false;
//   }
//   return true;
// }
// const cat: Cat | Dog = { meow: 3 };

// function pet(a: Cat | Dog) {
//   if (catOrDog(a)) {
//     console.log(a.bow); // Ok
//     console.log(a.meow); // Error
//   }
// }

// pet(cat);

// const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
//   input.status === "rejected";
// const isFullfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
//   input.status === "fulfilled";

// // PromiseSettledResult - PromiseRejectedResult or PromiseFulfilledResult

// const promises = await Promise.allSettled([Promise.resolve("a"), Promise.resolve("b")]);
// const errors = promises.filter(isRejected);

// export {};

// {}, Object는 모든 타입을 의미한다고 외우자(null과 undefined는 제외) - unknown과 비슷
// 실제 객체 타이핑은 object를 써야 한다.
// 하지만 객체 타이핑 시 object는 최대한 지양, interface, type, class를 사용한다.

// const x: {} = "hello"; // Ok
// const y: Object = "hi"; // Ok
// const xx: object = "hii"; // Error
// const yyy: object = { hello: "world" }; // Ok
// const z: unknown = "hi"; // unknown = {} | null | undeinfed 를 의미함

// if (z) {
//   // null, undefined는 if문에서 걸러짐
//   z;
// }

interface A {
  readonly a: string;
  b: string;
}

// aaa.a = 123;
type B = "Human" | "Mammal" | "Animal";
type IndexedType = { [key in B]: B };
const aaa: IndexedType = { Human: "Human", Mammal: "Mammal", Animal: "Animal" };
