﻿# 명시적인 any 선언하기

### 명시적인 any 선언하기

- 프로젝트 테스트 코드가 통과하는지 확인한다.
- 타입스크립트 설정 파일에 `noImplicitAny: true`를 추가한다.

  `tsconfig.json`

  ```json
  {
    "compilerOptions": {
      // ...
      "noImplicitAny": true // true 설정 시 타입 정의가 최소 any라도 정의되어야 함
    }
    // ...
  }
  ```

  ```bash
  $ npm run dev

  > project@1.0.0 build
  > tsc

  src/app.ts:2:12 - error TS7006: Parameter 'selector' implicitly has an 'any' type.

  2 function $(selector) {
               ~~~~~~~~
  // ..
  Found 40 errors. // 각종 에러들이 쏟아진다.
  ```

### 함수 파라미터에 any 타입 정의하기

- 가능한 타입을 적용할 수 있는 모든 곳에 타입을 적용한다.

  - 라이브러리를 쓰는 경우 DefinitelyTyped에 `@types` 관련 라이브러리를 찾아 설치한다.
  - 만약, 타입을 정하기 어려운 곳이 있으면 명시적으로라도 `any`를 선언한다.

    `src/app.ts`

    ```tsx
    // utils
    function $(selector: string) {
      return document.querySelector(selector);
    }
    function getUnixTimestamp(date: any) {
      return new Date(date).getTime();
    }
    // ...
    ```

- 테스트 코드가 통과하는지 확인한다.

### 화살표 any 함수에 타입 추가하기

`src/app.ts`

아래와 같이 화살표 함수 내 파라미터에도 any 타입을 추가한다.

```tsx
// ...
function setDeathsList(data: any) {
  const sorted = data.sort((a: any, b: any) => getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date));
  sorted.forEach((value: any) => {
    // ..
  });
}
```

덧붙여, innterText 영역에도 에러가 발생하여 DOM 변수 호출 단계에서 명시적 형변환을 해주었다.

```tsx
// ..
// DOM
const confirmedTotal = $(".confirmed-total") as HTMLElement;
const deathsTotal = $(".deaths") as HTMLElement;
const recoveredTotal = $(".recovered") as HTMLElement;
const lastUpdatedTime = $(".last-updated-time") as HTMLElement;
//..
```
