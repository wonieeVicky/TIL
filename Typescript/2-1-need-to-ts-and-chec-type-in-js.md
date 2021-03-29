# 타입스크립트의 필요성, JS에서 타입 체크하기

## 타입스크립트란?

자바스크립트에 타입을 부여한 언어. 자바스크립트의 확장된 언어
타입스크립트는 자바스크립트와 달리 브라우저에서 실행하려면 파일을 한번 변환(compile)해주어야 한다.

## 타입스크립트 왜 써야할까?

자바스크립트는 `에러의 사전 방지`와 IDE 상에서의 `코드 가이드 및 자동 완성`을 통해 개발 생산성을 향상시켜줌

### 자바스크립트에서 타입스크립트처럼 코딩하는 방법

JS Doc과 ts-check 기능을 통해 자바스크립트 파일에서 타입을 검증해나가는 방식을 사용할 수 있다.

1. JS Doc을 이용해서 파라미너타 프로퍼티에 대한 타입을 지정해줄 수 있다.

   ```jsx
   /**
    *
    * @typedef {object} Address
    * @property {string} street
    * @property {string} city
    */

   /**
    *
    * @typedef {object} User
    * @property {string} name
    * @property {string} email
    * @property {Address} address
    */

   /**
    * @returns {Promise<User>}
    */
   function fetchUser() {}
   ```

2. `// @ts-check`를 최상단에 선언하여 해당 JS파일에서 타입체크를 하도록 할 수도 있다.

   ```jsx
   // @ts-check

   /**
    *
    * @param {number} a 첫번째 숫자
    * @param {number} b 두번째 숫자
    */
   function sum(a, b) {
     return a + b;
   }
   sum(10, '20');
   ```

위와 같은 방법이 있지만 매 함수나 기능마다 타입을 선언할 경우 방대한 코드량이 발생. 타입스크립트를 사용해서 타입 정의에 대한 코드를 import, recycle, extension 등을 하면 훨씬 코드량이 줄어들고, 가독성이 높은 코드를 설계할 수 있다.

## 타입스크립트 시작하기

타입스크립트 프로젝트를 시작하는 기본적인 방법을 알아본다. 이러한 것들을 설정하기에 앞서 웹팩에 대한 사용방법을 어느정도는 숙지하고 있는 것이 좋다. ([웹팩 핸드북](https://joshua1988.github.io/webpack-guide/guide.html) 참조)

```bash
$ cd getting-started
$ npm i typescript -g // 글로벌로 typescript 설치
$ tsc index.ts
```

위와 같이 index.ts를 TSC로 동작시키면 동일한 path 선상에 index.ts의 타입 검증을 마치고 변환(compile)된 index.js 파일이 추가된다.

타입스크립트 사용 시 각종 설정은 `tsconfig.json`에서 해주면 된다.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true, // @ ts-check
    "noImplicitAny": true // 모든 타입에 최소 any는 넣도록 가이드
  }
}
```

이외의 설정에 대한 정보는 [TypeScript 공식문서](https://www.typescriptlang.org/docs/handbook/compiler-options.html)에서 확인해본다.
또 타입스크립트가 target 브라우저에 맞춰 어떻게 컴파일이 되는지 간단한 확인이나 테스트가 필요할 경우 [TypeScript Playground](https://www.typescriptlang.org/play)에서 시도해보면 좋다.
