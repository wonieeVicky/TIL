## 모듈(Module)

타입스크립트의 모듈을 이해하기 위해선 자바스크립트 모듈에 대한 이해가 선행되어야 한다.
타입스크립트 공식 문서의 많은 부분이 이 자바스크립트 모듈에 대한 설명을 포함하고 있는데, 여기서는 타입스크립트가 가지는 모듈 개념의 차이점에 대해서만 살펴본다.

### 1) 내보내기(export)

자바스크립트 모듈 [내보내기]는 MDN 문서([여기 클릭](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export)) 참고하자

타입스크립트는 일반적인 변수나 함수, 클래스 뿐만 아니라 다음과 같이 인터페이스나 타입 별칭도 모듈로 내보낼 수 있다.

```tsx
// myTypes.ts
// 인터페이스 내보내기
export interface IUser {
  name: string;
  age: number;
}
// 타입 별칭 내보내기
export type MyType = string | number;
```

### 2) 가져오기(import)

자바스크립트 모듈 [가져오기]는 MDN 문서([여기 클릭](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import)) 참고하자

```tsx
import { IUser, MyType } from "./myTypes";
const user: IUser = {
  name: "Vicky",
  age: 31,
};
const something: MyType = true; // Error - TS2322: Type 'true' is not assignable to type 'MyType'.
```

### 3) 다양한 형식으로 내보내기, 가져오기

타입스크립트는 CommonJS / AMD / UMD 모듈을 위해 `export = ABC;` , `import ABC = require('abc');`와 같은 내보내기와 가져오기 문법을 제공한다. 또한, ES6 모듈의 `export default` 같이 하나의 모듈에서 하나의 객체만 내보내는 Default Export 기능을 제공한다.

결국 타입스크립트에서 CommonJS / AMD / UMD 모듈은 다음과 같이 가져올 수 있다. 추가로, 컴파일 옵션에서 `"esModuleInterop": true` 를 제공하면, ES6 모듈의 Default import 방식도 같이 사용할 수 있다.

```tsx
// CommonJS/AMD/UMD
import ABC = require("abc");
// or
import * as ABC from "abc";
// or `"esModuleInterop": true`
import ABC from "abc";
```
