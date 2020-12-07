## 1. 타입스크립트 사용 환경 준비하기

알아두면 유용한 타입스크립트 기초 핵심 - velopert님 글 참조 ([링크](https://velog.io/@velopert/typescript-basics))

### 1) 환경준비

```powershell
$ mkdir ts-playground
$ cd ts-playground
$ yarn init -y # 또는 npm init -y
$ yarn global add typescript # 글로벌 설치, 폴더 내 설치는 npx tsc --init
$ tsc --init
```

**tsconfig.json**

타입스크립트 설정파일은 `tsconfig.json`에 만들어진다. 프로젝트 내에 타입스크립트를 설치하면 자동 생성된다. `tsconfig.json` 에 기본적으로 설정되어 있는 속성은 아래와 같다. (더 자세한 옵션은 [여기](https://aka.ms/tsconfig.json)에서 확인)

- target

  컴파일된 코드가 어떤 환경에서 실행될 지 정의한다.
  es6 문법 사용 후 target을 es5로 한다면 일반 function 함수로 변환해준다.

- module

  컴파일된 코드가 어떤 모듈 시스템을 사용할지 정의한다.
  common일 경우 `export default Sample` 시 `export.default = helloWorld`로 변환, es2015로 설정할 경우 `export default Sample` 그대로 유지

- strict

  모든 타입 체킹 옵션을 활성화 해준다.

- esModuleInterop

  `commonjs` 모듈 형태로 이루어진 파일을 es2015 모듈 형태로 불러올 수 있게 해준다.

- outDir (선택)

  컴파일된 파일들이 저장되는 경로 지정

```powershell
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```

### 2) 타입스크립트 파일 만들기

**src/practice.ts**

```tsx
const message: string = "hello world";
console.log(message);
```

타입스크립트는 `*.ts` 확장자를 사용한다.
아래 message 값에 `:string` 이라는 선언을 통해 해당 상수 값이 문자열이라는 것을 명시
만약 해당 값을 문자열이 아닌 다른 설정을 했을 경우 에디터 상에서 오류가 나타난다.

![https://github.com/wonieeVicky/TIL/blob/main/img/201207.png]`(https://github.com/wonieeVicky/TIL/blob/main/img/201207.png)`

### 3) 타입스크립트 컴파일하기

코드 작성 후 해당 프로젝트의 디렉터리에서 터미널로 `tsc` 입력 (또는 `npx tsc`)

**dist/practice.js**

```tsx
"use strict";
var message = "hello world";
console.log(message);
```

우리가 ts 파일에서 명시한 값의 타입은 컴파일 과정에서 모두 사라진다.

보통 프로젝트 시 `typescript` 패키지를 사용하여 컴파일하고 싶을 때는 아래와 같이 한다.
(일반적으로 타입스크립트를 사용하는 프로젝트는 로컬로 설치한 `typescript` 패키지를 사용하여 컴파일 한다.)

**terminal**

```powershell
$ yarn add typescript # 또는 npm install --save typescript
```

**package.json** 내 build 스크립트 생성

```tsx
{
  "name": "ts-playground",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "ts-node": "^8.4.1",
    "typescript": "^3.6.3"
  },
  "scripts": {
    "build": "tsc"
  }
}
```

추후 빌드 시 `yarn build` (또는 `npm run build`) 라고 입력한다.
