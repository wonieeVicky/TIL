## 기본 문법 정리

### 타입스크립트는 변수, 매개변수, 리턴값에 타입을 붙이는 것

타입스크립트는 기본적으로 아래의 타입을 제공한다.

```tsx
const a: string = "5";
const b: number = 5;
const c: boolean = true;
const d: undefined = undefined;
const e: null = null;
const f: symbol = Symbol.for("abc");
const g: bigint = 1000000n;
const h: any = "any";
const i: any = true;
```

타입스크립트의 최종적 목적은 any 타입을 사용하지 않는 것이다.
함수도 타이핑할 수 있다. 기본적인 포맷 참고

```tsx
function add(a: number, b: number): number {
  return a + b;
}

// 함수형은 타입을 아래 형식으로 적는다.
const add: (x: number, y: number) => number = (a, b) => a + b;
```

`(x: number, y: number) => number` 화살표 함수를 타이핑할 때 type alias를 사용할 수 있다.

```tsx
// 1. type alias 정의
type Add = (x: number, y: number) => number;

// 2. interface type 정의
interface Add {
  (x: number, y: number): number;
}

// 아래처럼 적용한다.
const add: Add = (a, b) => a + b;
```

객체도 아래와 같이 타입을 정의할 수 있다.

```tsx
const obj: { x: number; y: number } = { x: 1, y: 2 };
```

배열도 가능

```tsx
// 표현 방법 1
const arr: string[] = ["a", "b", "c"];

// 표현 방법 2
const arr2: Array<number> = [123, 456, 789];

// 표현 방법 3 - 길이가 고정되었을 때 튜플로 정의
const arr3: [number, number, string] = [1, 2, "3"];
const arr4: [number, number, string] = [1, 2, "3", 4]; // error, 소스에 4개 요소가 있지만, 대상에서 3개만 허용합니다.
```

바뀌지 않는 값은 정확하게 적어줄 수도 있다.

```tsx
const f: 5 = 5;
const g: 5 = 6; // error
```
