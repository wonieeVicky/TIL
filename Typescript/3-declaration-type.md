## 3. 타입 선언

알아두면 유용한 타입스크립트 기초 핵심 - velopert님 글 참조 ([링크](https://velog.io/@velopert/typescript-basics))
한눈에 보는 타입스크립트 - HEROPY Tech 글 참조 ([링크](https://heropy.blog/2020/01/27/typescript/))

### 1) 불린: Boolean

단순한 참(true), 거짓(false) 값을 나타낸다.

```tsx
let isBoolean: boolean;
let isDone: boolean = false;
```

### 2) 숫자: Number

모든 부동 소수점 값을 사용할 수 있다. ES6에 도입된 2진수 및 8진수 리터럴도 지원

```tsx
let num: number;
let integer: number = 6;
let float: number = 3.14;
let hex: number = 0xf00d; // 61453
let binary: number = 0b1010; // 10
let octal: number = 0o744; // 484
let infinity: number = Infinity;
let nan: number = NaN;
```

### 3) 문자열: String

문자열 값을 나타낸다. 작은 따옴표('), 큰 따옴표(") 뿐만 아니라 ES6 템플릿 문자열도 지원

```tsx
let str: string;
let red: string = "Red";
let green: string = "Green";
let myColor: string = `My color is ${red}`;
let yourColor: string = "Your color is" + green;
```

### 4) 배열: Array

- 순차적으로 값을 가지는 일반 배열을 나타낸다. 배열은 아래와 같이 두 가지 방법으로 타입을 선언할 수 있다.
  - 문자열만 가지는 배열
  - 숫자만 가지는 배열

```tsx
// 문자열만 가지는 배열
let fruits_type1: string[] = ["apple", "banana", "mango"];
let fruits_type2: Array<string> = ["apple", "banana", "mango"];

// 숫자만 가지는 배열
let oneToSeven_type1: number[] = [1, 2, 3, 4, 5, 6, 7];
let oneToSeven_type2: Array<number> = [1, 2, 3, 4, 5, 6, 7];
```

- 유니언 타입(다중 타입)의 '문자열과 숫자를 동시에 가지는 배열'도 선언할 수 있다.

```tsx
// 유니언 타입(다중 타입)의 '문자열과 숫자를 동시에 가지는 배열'도 선언 가능
let unionArray_type1: (string | number)[] = ["apple", 1, 2, "banana", 3];
let unionArray_type2: Array<string | number> = ["apple", 1, 2, "banana", 3];
```

- 배열이 가지는 항목의 값을 단언할 수 없다면 `any` 를 사용한다.

```tsx
let someArr: any[] = [0, 1, {}, [], "str", false];
```

- 인터페이스(Interface)나 커스텀 타입(Type)을 사용할 수도 있다.

```tsx
interface IUser {
  name: string;
  age: number;
  isValid: boolean;
}
let userArr: IUser[] = [
  {
    name: "Vicky",
    age: 31,
    isValid: true,
  },
  {
    name: "Woniee",
    age: 30,
    isValid: false,
  },
  {
    name: "Hannah",
    age: 26,
    isValid: true,
  },
];
```

- 유효하지 않지만, 다음과 같이 특정한 값으로 타입을 대신해 작성할 수도 있다.
  ~~실제 vscode에서 에러를 뿜는다. 뭐지?~~

```tsx
let array = 10[];
array = [10];
array.push(10);
array.push(11); // Error - TS2345
```

- 읽기 전용 배열을 생성할 수 있다. `readonly` 키워드나 `ReadonlyArray` 타입을 사용하면 된다.

```tsx
let arrA: readonly number[] = [1, 2, 3, 4];
let arrB: ReadonlyArray<number> = [0, 9, 8, 7];

arrA[0] = 123; // 'readonly number[]' 형식의 인덱스 시그니처는 읽기만 허용된다.
arrA.push(123); // 'readonly number[]' 형식에 'push' 속성이 없다.
arrB[0] = 123; // 'readonly number[]' 형식의 인덱스 시그니처는 읽기만 허용된다.
arrB.push(123); // 'readonly number[]' 형식에 'push' 속성이 없다.
```
