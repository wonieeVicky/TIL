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
