// interface Profile {
//   name: string;
//   age: number;
//   married: boolean;
// }

// // custom Pick
// type P<T, S extends keyof T> = {
//   [P in S]: T[P];
// };

// const vicky: Profile = {
//   name: "vicky",
//   age: 33,
//   married: false,
// };

// const PartialVicky: Partial<Profile> = {
//   name: "vicky",
//   age: 33,
// };

// const PickVicky: Pick<Profile, "name" | "age"> = {
//   name: "vicky",
//   age: 33,
// };

// type Animal = "Cat" | "Dog" | "Human";
// type Mammal = Exclude<Animal, "Human">;

// type Human = Extract<Animal, "Human">;

// type A = Exclude<keyof Profile, "married">;

// type O<T, S extends keyof any> = Pick<T, Exclude<keyof T, S>>;
// const OmitVicky: O<Profile, "married"> = {
//   name: "vicky",
//   age: 33,
// };

// interface Profile {
//   readonly name?: string;
//   readonly age?: number;
//   readonly married?: boolean;
// }
// type Name = Profile["name"];

// type R<T> = {
//   -readonly [key in keyof T]-?: T[key];
// };

// const vicky: R<Profile> = {
//   name: "vicky",
//   age: 33,
//   married: false,
// };

// vicky.name = "vicky";

// interface Obj {
//   [key: string]: number;
// }
// const obj: Obj = { a: 3, b: 5, c: 7 };

// type R<T extends keyof any, S> = {
//   [key in T]: S;
// };
// const recordObj: R<string, number> = { a: 3, b: 5, c: 7 };

// type A = string | null | undefined | boolean | number;
// type N<T> = T extends null | undefined ? never : T;
// type B = N<A>; // type B = string | number | boolean

// function zip(x: number, y: string, z: boolean): { x: number; y: string; z: boolean } {
//   return { x, y, z };
// }

// type R<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;
// type P<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
// type Params = P<typeof zip>; // type Params = [number, string, boolean]
// type Return = ReturnType<typeof zip>; // type Return = { x: number; y: string; z: boolean }
// type First = Params[0]; // number

// class A {
//   a: string;
//   b: number;
//   c: boolean;

//   constructor(a: string, b: number, c: boolean) {
//     this.a = a;
//     this.b = b;
//     this.c = c;
//   }
// }

// const d = new A("vicky", 33, true);
// type D = ConstructorParameters<typeof A>; // type D = [a: string, b: number, c: boolean] - 생성자의  파라미터
// type I = InstanceType<typeof A>; // type I = Test

// const e: A = new A("woniee", 32, true); // 인스턴스(new)

// const F = "Hello world";
// const G: Lowercase<typeof F> = "hello world"; // type e = "hello world"

// Promise는 Promise<결괏값> 타입으로 표현함
// const p1 = Promise.resolve(1)
//   .then((a) => a + 1)
//   .then((a) => a + 1)
//   .then((a) => a.toString()); // Promise<number> => Promise<number> => Promise<number> => Promise<string>
// const p2 = Promise.resolve(2); // Promise<number>
// const p3 = new Promise((res, _) => setTimeout(res, 1000)); // Promise<unknown>

// Promise.all([p1, p2, p3]).then((result) => console.log(result)); // ['3', 2, unknown]

// const arr = [1, 2, 3] as const;
// type Arr = keyof typeof arr; // type Arr = keyof readonly [1, 2, 3]
// const key1: Arr = "2"; // Ok
// const key2: Arr = "3"; // Error

// // type Result = Awaited<Promise<Promise<Promise<number>>>>; // type Result = number
// type Result = Awaited<{ then(onfulfilled: (v: number) => number): any }>; // thenable

function bindTest(this: Window | typeof obj, param: string) {
  console.log(this); // window
}

const obj = { name: "vicky" };
const b = bindTest.bind(obj);
// b(); // vicky

type T = ThisParameterType<typeof bindTest>; // type T = Window | { name: string; }
type NoThis = OmitThisParameter<typeof bindTest>; // type NoThis = (param: string) => void

const vicky = {
  name: "vicky",
  sayHello(this: { name: string }) {
    console.log(`hi ${this.name}`);
  },
};

const sayHello = vicky.sayHello; // const sayHello: (this: { name: string; }) => void
const sayHi = vicky.sayHello.bind({ name: "wonny" }); // const sayHi: () => void
sayHi(); // hi wonny

function addd(a: number, b: number, c: number, d: number, e: number, f: number) {
  return a + b + c + d + e + f;
}

const add1 = addd.bind(null);
add1(1, 2, 3, 4, 5, 6);

const add2 = addd.bind(null, 1); // 매개변수에 값을 넣어줌, a = 1
add2(2, 3, 4, 5, 6);

const add3 = addd.bind(null, 1, 2); // a = 1, b = 2
add3(3, 4, 5, 6);

const add4 = addd.bind(null, 1, 2, 3);
add4(4, 5, 6);

const add5 = addd.bind(null, 1, 2, 3, 4);
add5(5, 6);

const add6 = addd.bind(null, 1, 2, 3, 4, 5);
add6(6);
