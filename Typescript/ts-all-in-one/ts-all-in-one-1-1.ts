const a: string = "5";
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

const obj: { x: number; y: number } = { x: 1, y: 2 };

const arr: string[] = ["a", "b", "c"];
const arr2: Array<number> = [123, 456, 789];

// 길이가 고정되었을 때 튜플로 정의
const arr3: [number, number, string] = [1, 2, "3"];
