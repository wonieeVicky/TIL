const a = 5;
const b: number = 5;
const c: boolean = true;
const d: undefined = undefined;
const e: null = null;
const f: symbol = Symbol.for("abc");
const g: bigint = 1000000n;
const h: any = "any";
const i: any = true;

/* function add(a: number, b: number): number {
  return a + b;
} */

// type Add = (x: number, y: number) => number;
interface Add {
  (x: number, y: number): number;
}
const add: Add = (a, b) => a + b;

const obj: {
  x: number;
  y: number;
} = { x: 1, y: 2 };

const arr: string[] = ["a", "b", "c"];
const arr2: Array<number> = [123, 456, 789];

// 길이가 고정되었을 때 튜플로 정의
const arr3: [number, number, string] = [1, 2, "3"];

function add4(x: number, y: number): number;
function add4(x, y) {
  return x + y;
}

let test = 123;
test = "hello" as unknown as number;

try {
  const array: string[] = [];
  array.push("hello");
} catch (error) {
  error;
}

// const head = document.querySelector("#head")!

// console.log(head);
// head.innerHTML = "hello";

const head = document.querySelector("#head");
if (head) {
  head.innerHTML = "hello";
  console.log(head);
}

const aa: string = "hello";
const bb: String = "hell";

function cc(a1: string, b1: string) {}
// cc(aa, bb);

type World = "world" | "hell";
type Greeting = `hello ${World}`;
// const GreetingResult: Greeting = "";

function rest(a, ...args: string[]) {
  console.log(a, args); // [1,2,3]
}

rest(1, "2", "3");

const tuple: [string, number] = ["1", 1];
// tuple[2] = "hello"; // Error
tuple.push("hello");

// enum은 JavaScript 변환 시 사라진다.
const enum EDirection {
  Up = 3,
  Down,
  Left = "hello",
  Right = "vicky",
}

// object는 JavaScript 변환 시 유지된다.
const ODirection = {
  Up: 3,
  Down: 1,
  Left: "hello",
  Right: "vicky",
} as const;

const e_up = EDirection.Up; // 3
const e_down = EDirection.Down; // 4
const e_left = EDirection.Left; // hello
const e_right = EDirection.Right; // vicky

const o_up = ODirection.Up; // 3
const o_down = ODirection.Down; // 4
const o_left = ODirection.Left; // hello
const o_right = ODirection.Right; // vicky

function walk(dir: EDirection) {}
// It requires an extra line to pull out the keys
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}

walk(EDirection.Up);
run(ODirection.Up);

const testObj = { a: "123", b: 123, c: true } as const;
type Key = typeof testObj[keyof typeof testObj];

type A = { a: string };
const aaa: A = { a: "123" };

interface B {
  a: string;
}
const bbb: B = { a: "123" };

type TypeUnion = string | number;
const txtUnion: TypeUnion = 123;

type TypeUnionObj = { hello: "world" } | { vicky: "choi" };
const unionObj1: TypeUnionObj = { hello: "world" };
const unionObj2: TypeUnionObj = { vicky: "choi" };
const unionObj3: TypeUnionObj = { hello: "world", vicky: "choi" };

type TypeIntersectionObj = { hello: "world" } & { vicky: "choi" };
const intersectionObj1: TypeIntersectionObj = { hello: "world", vicky: "choi" };
const intersectionObj2: TypeIntersectionObj = { hello: "world" }; // Error

type Animal = { breath: true };
type Mamal = Animal & { breed: true };
type Human = Mamal & { think: true };

const vicky: Human = { breath: true, breed: true, think: true };

interface AnimalInterface {
  breath: true;
}

interface MamalInterface extends Mamal {
  breed: true;
}

const baduc: MamalInterface = { breath: true, breed: true };

interface SameInterface {
  talk: () => void;
}
interface SameInterface {
  eat: () => void;
}
interface SameInterface {
  shit: () => void;
}

const same: SameInterface = {
  talk: () => {},
  eat: () => {},
  shit: () => {},
};

interface Props {}
type Type = string | number;
enum Hello {
  Left,
  Right,
}

const a: Props = {};
