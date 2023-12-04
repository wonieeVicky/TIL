## 타입스크립트 리마인드

### TypeScript 는..

Microsoft에서 만든 프로그래밍 언어. 2년간 개발 후 2012/12 릴리즈

Open-source language이며, 자바스크립트 언어의 대체제임

TypeScript는 JavaScript를 베이스로 하는 언어

JavaScript는 dynamically typed 언어로 런타임 에러를 발생시킴

- Prototype-based, Constructor Functions, ES6(class-like)

TypeScript는 statically typed 언어로 compile error를 발생시킴. runtime 이전에 에러를 잡을 수 있다

- class, interface, generics, types를 활용할 수 있어서 OOP를 더 구체적으로 구현할 수 있다.

client-side, server-side에서 모두 사용 가능함 → 어떻게? 타입스크립트 코드를 transcompile해서 쓴다.

- compiler는 ts 자체 제공 compiler나 babel을 활용함

### 왜 배워야 하는가?

1. type 때문에
   - JavaScript는 런타임에서 타입이 결정되므로(dynamically typed) 위험함.
     그러나 TypeScript는 컴파일 시 타입이 결정되므로(statically typed) 즉각적인 에러를 알 수 있다
   - 타입이 언제 결정되느냐에 따라 나뉘는 개발언어
     - dynamically typed
       - python, ruby, lua, php, js
     - statically typed → compiler가 존재
       - ts, scala, java, kotlin, swift, go, c, c++
   - 타입이 없으면 가독성(readability)이 떨어지고, 유지보수가 어렵다.
   - 타입이 있으면 실시간으로 에러 검사를 받을 수 있으므로 안정적 유지보수 및 확장이 가능하다.
2. OOP(객체 지향 프로그래밍) 를 할 수 있어서
   - modern programming paradigm 중 하나
   - OOP는 객체를 위주로 프로그래밍을 해나감. 객체 위주로 코드를 모듈화(modularity) 가능. 원하는 곳에 모듈화를 재사용(reusability)할 수 있으며, 객체 단위의 확장성(extensible) 또한 존재하며, 이를 통해 기존 코드의 문제 해결이나 새로운 기능 추가가 쉽게 가능하므로 유지보수성(maintainability)이 높음
   - 타입을 보장받음으로써 생산성이 높아지고, 양질의 서비스 제공, 빠른 작업 가능

### setup

- vscode 내 Implicit Project config: Strict Null Checks 활성화
- [공식문서](https://www.typescriptlang.org/download) 항상 검토
- 컴파일러 툴 추가

  - `index.html`

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="main.ts"></script>
        <title>Document</title>
      </head>

      <body></body>
    </html>
    ```

  - `main.ts`

    ```tsx
    console.log('hello world');

    class Car {
      engine: number;
      constructor(engine: number) {
        this.engine = engine;
      }
    }
    ```

    - Live Server로 브라우저에 띄워보면 에러 발생
      - Refused to execute script from 'http://127.0.0.1:5500/Typescript/ts-with-oop/main.ts' because its MIME type ('video/mp2t') is not executable.
      - JavaScript 코드로 변환해주어야 한다.
        ```bash
        > tsc main.ts
        ```
      - main.js 변환 완료 → index.html에 연결하면 정상 동작한다.
      - 매번 main.js로 변환 시 불편하므로 watch 모드를 키면 더 쉽게 사용 가능
        ```bash
        > tsc main.ts -w
        ```
    - 즉각적인 compiler 실행은 ts-node를 설치하여 해결한다.

    ```bash
    > npm i -g ts-node
    > npx ts-node main.ts
    hello world
    ```

### 타입은 왜 필요한가?

프로그래밍은 INPUT + OPERATION + OUTPUT 으로 구성됨
이때 INPUT으로 받아온 DATA를 변수에 담아둔 뒤 OPERATION을 실행한다.

변수는 여러가지 값을 담을 수 있으므로 이를 타입으로 지정해주면 기능을 추론하는데 큰 도움이 된다.
또, 프로그램 동작의 안정성을 높여준다.

## 기본 타입 리마인드

### number, string, boolean, undefined, null

```tsx
{
  /**
   * Javascript
   * Primitive(원시) Type: number, string, boolean, bigint, symbol, null, undefined
   */

  // number
  // const num1: number = 'vicky'; // error
  const num2: number = 0.3;
  const num3: number = 3;

  // string
  const str1: string = 'hello';

  // boolean
  const bool1: boolean = true;

  // undefined - 값이 있는지 없는지 아무것도 결정되지 않은 상태
  let name: undefined; // 💩
  name = 'vicky'; // error

  let age: number | undefined; // 이렇게 주로 사용한다.
  age = 13; // ok
  age = undefined; // ok

  // null - 값이 없음을 명시적으로 표현
  let person: null; // 💩
  person = null; // ok
  person = 1; // error
  function find(): number | undefined {
    return undefined;
  }

  let person2: string | null; // 이렇게 주로 사용한다.
  person2 = 'vicky'; // ok
  person2 = null; // ok
}
```

### unknown, any, void, never, object

```tsx
{
  /**
   * Javascript
   * unknown, any, void, never ..
   * Object(객체) Type: function, array...
   */

  // unknown - 💩 어떤 데이터가 담길지 알 수 없음을 의미
  let notSure: unknown = 0;
  notSure = 'vivivi'; // ok
  notSure = true; // ok

  // any - 💩, 어떤 것이든 담을 수 있음을 의미
  let anything: any = 0;
  anything = 'hello'; // ok
  anything = true; // ok

  // void - 함수에서 아무것도 리턴하지 않을 때 사용
  function test(): void {
    console.log('test');
    return;
  }
  let unusable: void = undefined; // 💩

  // never - 함수에서 절대 리턴하지 않을 때 사용
  // 예상치 못한 에러가 발생 시 호출시키는 함수라고 정의했을 떄
  // 이 함수는 리턴할 계획이 없다는 것을 명시적으로 표현
  function throwError(message: string): never {
    // message -> server (log)
    throw new Error(message);
    // while(true) {}
    // return; // error
  }
  let neverEnding: never; // 💩

  // object - 원시 타입을 제외한 모든 object 타입을 할당할 수 있다.
  let obj: object; // 💩
  obj = [1, 2, 3]; // ok
  function acceptSomeObject(obj: object) {}
  acceptSomeObject({ name: 'vicky' }); // ok
  acceptSomeObject({ animal: 'dog' }); // ok
}
```

### 함수에서 타입 이용하기(JS → TS)

```tsx
{
  // JavaScript 💩
  function jsAdd(num1, num2) {
    return num1 + num2;
  }
  // TypeScript ✨
  function tsAdd(num1: number, num2: number): number {
    return num1 + num2;
  }

  // JavaScript 💩
  function jsFetchNum(id) {
    // code ...
    // code ...
    return new Promise((resolve, reject) => {
      resolve(100);
    });
  }
  // TypeScript ✨
  function jsFetchNumber(id: string): Promise<number> {
    // code ...
    // code ...
    return new Promise((resolve, reject) => {
      resolve(100);
    });
  }
}
```

코드만 보고도 이해가 되도록..

### 함수 타입 이용(spread, default, optional)

함수를 활용할 수 있는 팁에 대해 알아보자

```tsx
// JavaScript ✨ => TypeScript
// Optional parameter - 물음표를 붙여서 사용
function printName(firstName: string, lastName?: string) {
  console.log(firstName);
  console.log(lastName);
}
printName('Vicky', 'Jobs');
// Vicky
// Jobs
printName('Wonny');
// Wonny
// undefined
printName('Anna', undefined);
// Anna
// undefined

function printName2(firstName: string, lastName: string | undefined) {
  console.log(firstName);
  console.log(lastName);
}
printName2('Vicky', 'Jobs');
printName2('Wonny'); // type error!
printName2('Anna', undefined);

// Default parameter - 기본값을 설정
function printMessage(message: string = 'default message') {
  console.log(message);
}
printMessage(); // default message
printMessage('hello'); // hello

// Rest parameter - 배열 형태로 전달
function addNumbers(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b);
}
console.log(addNumbers(1, 2, 3)); // 6
console.log(addNumbers(1, 2, 3, 4, 5)); // 15

console.log(addNumbers(1)); // 1
```

### 배열과 튜플에 대하여..

기본적인 배열 타입정의

```tsx
// Array
const fruits: string[] = ['🍅', '🍌'];
const scores: Array<number> = [1, 3, 4];

// 일관성있게 타이핑 - string[] 타입으로 사용
function printArray(fruits: readonly string[]) {
  fruits.push('🍓'); // error - readonly 값은 변경할 수 없음
}
```

튜플은 배열이긴 배열인데 서로 다른 타입을 가질 수 있는 배열을 의미

```tsx
// Tuple -> 권장하지 않음, 값을 보지 않는 이상 알 수 없음
// interface, type alias, class로 대체해서 사용한다.
let student: [string, number];
student = ['name', 123]; // ok
student[0]; // name
student[1]; // 123

// 피하는 방법
const [name, age] = student; // 명시적으로 알 수 있음

// Tuple 사용 예제
const [count, setCount] = useState(0); // useState는 리턴타입 사용 시 tuple을 사용함
// function useState<S>(initialState: S | (() => S)): [S,Dispatch<SetStateAction<S>>];
```

동적으로 리턴 시 class, alias 등으로 사용하기 어려운 경우 tuple 사용. 그 밖에는 다른 방식으로 표현하는 것을 추천함

### type alias

type alias는 새로운 타입을 정의하는 것이 아닌 정의된 타입에 대한 참조를 생성하는 것을 의미

```tsx
/**
 * Type Aliases
 * type aliases는 새로운 타입을 정의하는 것이 아니라 정의된 타입에 대한 참조를 생성한다.
 */
type Text = string;
const name: Text = 'vicky';
const address: Text = 'korea';

type Num = number;
type Student = {
  name: string;
  age: number;
};
const student: Student = {
  name: 'vicky',
  age: 33
};

/**
 * String Literal Types
 * 문자열을 타입으로 지정할 수 있다.
 */
type Name = 'name';
let vickyName: Name;
vickyName = 'name'; // ok
vickyName = 'json'; // Error

type JSON = 'json';
let json: JSON = 'json'; // ok
json = 'JSON'; // Error
```

String Literal Types는 언제 쓰일까?

### Union 타입

타입스크립트에서 굉장히 활용도가 높음

```tsx
/**
 * Union Types: OR (|)를 사용하여 타입을 정의할 수 있다.
 */
type Direction = 'left' | 'right' | 'up' | 'down';
function move(direction: Direction) {
  console.log(direction);
}
move('left'); // ok
move('right'); // ok
move('up'); // ok
move('down'); // ok

type TileSize = 8 | 16 | 32;
const tile: TileSize = 16; // ok
// const tile2: TileSize = 15; // Error
// const tile3: TileSize = 16.5; // Error

// function: login -> success, fail
type SuccessState = {
  response: {
    body: string;
  };
};
type FailState = {
  reason: string;
};
type LoginState = SuccessState | FailState;

function login(id: string, passworld: string): LoginState {
  // success
  return {
    response: {
      body: 'logged in!'
    }
  };
  // error
  return {
    reason: 'failed'
  };
}

// printLoginState(state)
// success -> 🎉 body
// fail -> 😭 reason

function printLoginState(state: LoginState): void {
  // response가 있는지 확인
  if ('response' in state) {
    console.log(`🎉 ${state.response.body}`);
  } else {
    console.log(`😭 ${state.reason}`);
  }
}
```

### ⭐️ Discriminated Union Type

```tsx
/**
 * Discriminated Union
 * Union 타입에 공통적인 프로퍼티를 두어 구분하는 방법을 활용하면 직관적 코딩이 가능함
 */
// function: login -> success, fail
type SuccessState = {
  result: 'success'; // Discriminated union
  response: {
    body: string;
  };
};
type FailState = {
  result: 'fail'; // Discriminated union
  reason: string;
};
type LoginState = SuccessState | FailState;

function login(id: string, passworld: string): LoginState {
  // success
  return {
    result: 'success', // 명시적으로 붙여줘야 타입에러가 발생하지 않음
    response: {
      body: 'logged in!'
    }
  };
  // error
  return {
    result: 'fail', // 명시적으로 붙여줘야 타입에러가 발생하지 않음
    reason: 'failed'
  };
}

// printLoginState(state)
// success -> 🎉 body
// fail -> 😭 reason

function printLoginState(state: LoginState): void {
  // key in value로 처리하지 않고 공통의 result 값을 바라보고 처리
  if (state.result === 'success') {
    console.log(`🎉 ${state.response.body}`);
  } else {
    console.log(`😭 ${state.reason}`);
  }
}
```

### intersection type

union과 전혀다른 intersection type에 대해 알아본다. 다양한 타입을 하나로 묶을 수 있음

```tsx
/**
 * Intersection Types: &
 */
type Student = {
  name: string;
  score: number;
};

type Worker = {
  employeeId: number;
  work: () => void;
};

// 학생이기도 하면서 일을 함
function internWork(person: Student & Worker) {
  console.log(person.name, person.employeeId, person.work());
}

// 모든 type이 포함되어야 한다.
internWork({
  name: 'vicky',
  score: 100,
  employeeId: 235,
  work: () => {}
});
```
