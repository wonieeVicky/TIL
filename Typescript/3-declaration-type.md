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

### 5) 튜플: Tuple

- Tuple 타입은 배열과 매우 유사하나 정해진 타입의 고정된 길이(length)배열을 표현한다.

```tsx
// Tuple 타입은 배열과 매우 유사하나 정해진 타입의 고정된 길이(length)배열을 표현한다.
let tuple: [string, number];
tuple = ["a", 1];
tuple = ["a", 1, 2]; // Error - TS2322
tuple = [1, "a"]; // Error - TS2322
```

- 데이터를 개별 변수로 지정하지 않고, 단일 tuple 타입으로 지정해 사용할 수 있다.

```tsx
// variable
let userId: number = 1234;
let userName: string = "vicky";
let isValid: boolean = true;

// tuple
let user: [number, string, boolean] = [1234, "vicky", true];
console.log(user[0]); // 1234
console.log(user[1]); // vicky
console.log(user[2]); // true
```

- 위 방식을 활용해 다음과 같은 Tuple 타입의 배열(2차원 배열)을 사용할 수 있다.

```tsx
let users: [number, string, boolean][];
// or
// let users: Array<[number, string, boolean]>;
users = [
  [1, "choi", true],
  [2, "sun", true],
  [3, "jin", false],
];
```

- 또한 값으로 타입을 대신할 수도 있다.

```tsx
let tuple_2: [1, number];
tuple_2 = [1, 2];
tuple_2 = [1, 3];
tuple_2 = [2, 3]; // Error - TS2322: '2' 형식은 '1' 형식에 할당할 수 없다.
```

- Tuple은 **정해진 타입의 고정된 길이 배열**을 표현하지만, 이는 할당(Assign)에 국한된다. 곧 `push()` 나 `splice()`등을 통해 값을 넣는 행위는 막을 수 없다.

```tsx
let tuple_3: [string, number];
tuple_3 = ["a", 1];
tuple_3 = ["b", 2];
tuple_3.push(3);
console.log(tuple_3); // ['b', 2, 3];
tuple_3.push(true); // Error - TS2345: boolean 형식의 인수는 string, number 형식의 매개 변수에 할당될 수 없다.
```

- 배열에서 사용한 것과 같이 `readonly` 키워드로 읽기 전용 튜플을 생성할 수도 있다.

```tsx
let a: readonly [string, number] = ["hello", 123];
a[0] = "world"; // Error - TS2540: 읽기 전용 속성이므로 '0'에 할당할 수 없다.
```
