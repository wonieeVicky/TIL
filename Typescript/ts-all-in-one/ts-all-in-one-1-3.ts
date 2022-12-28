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

type A = string | null | undefined | boolean | number;
type N<T> = T extends null | undefined ? never : T;
type B = N<A>; // type B = string | number | boolean
