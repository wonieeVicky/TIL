// 1-prepare-environment-for-using-typescript
const message: string = "hello world";
console.log(message);

// 2-basic-type
// 1) 기본 타입
let count = 0; // 숫자
count += 1;
// count = "갑자기 문자열"; // 에러 발생!

const msg: string = "hello world"; // 문자열
const done: boolean = true; // 불리언 값

const numbers: number[] = [1, 2, 3]; // 숫자 배열
const messages: string[] = ["hello", "world"]; // 문자열 배열

// messages.push(1); // 문자열인데, 숫자를 넣으면 안된다

let mightBeUndefined: string | undefined = undefined; // string or undefined
let nullableNumber: number | null = null; // number or null

let color: "red" | "orange" | "yellow" = "red"; // red, orange, yellow 중에 하나
color = "yellow";
// color = "green"; // 에러 발생!

// 2) 타입 지정
function add(a: number, b: number) {
  return a + b;
}
const sum: number = add(1, 2);
console.log(sum); // 3
