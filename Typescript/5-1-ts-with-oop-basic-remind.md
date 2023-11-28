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
   * Object(객체) Type: function, array...
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
