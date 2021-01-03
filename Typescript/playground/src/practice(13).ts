// TS 전역 유틸리티 타입(Utility Types)
// 1) Partial
interface IUser {
  name: string;
  age: number;
}
const userA: IUser = {
  name: "A", // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'IUser'.
};

const userB: Partial<IUser> = {
  name: "v",
};

// 2) Required
interface IUser {
  name?: string;
  age?: number;
}
const userA: IUser = {
  name: "A",
};
const userB: Required<IUser> = {
  // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'Required<IUser>'.
  name: "B",
};

// 3) Readonly
interface IUser {
  name: string;
  age: number;
}

const userA: IUser = {
  name: "A",
  age: 12,
};
userA.name = "aa";

const userB: Readonly<IUser> = {
  name: "B",
  age: 13,
};
userB.name = "BB"; // TS2540: Cannot assign to 'name' because it is a read-only property.

// 4) Record
type TName = "vicky" | "wonny";
const developers: Record<TName, number> = {
  vicky: 32,
  wonny: 31,
};

// 5) Pick
interface IUser {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}
type TKey = "name" | "email";
const user: Pick<IUser, TKey> = {
  name: "Vicky",
  email: "hwfongfing@gmail.com",
  age: 22, // TS2322: Type '{ name: string; email: string; age: number; }' is not assignable to type 'Pick<IUser, TKey>'.
};

// 6) Omit
interface IUser {
  name: string;
  age: number;
  email: string;
  isValid: boolean;
}
type TKey = "name" | "email";
const user: Omit<IUser, TKey> = {
  age: 32,
  isValid: true,
  name: "Vicky", // TS2322: Type '{ age: number; isValid: true; name: string; }' is not assignable to type 'Pick<IUser, "age" | "isValid">'.
};

// 7) Exclude
type T = string | number;
const a: Exclude<T, number> = "only string";
const b: Exclude<T, string> = "123"; // TS2322: Type '123' is not assignable to type 'string'.
const c: T = "string";
const d: T = 1235;

// 8) Extract
type T = string | number;
type U = number | boolean;

const a: Extract<T, U> = 123;
const b: Extract<T, U> = "only number"; // TS2322: Type '"Only number"' is not assignable to type 'number'.

// 9) NonNullable
type T = string | number | undefined;
const a: T = undefined;
const b: NonNullable<T> = null; // TS2322: Type 'null' is not assignable to type 'string | number'.
