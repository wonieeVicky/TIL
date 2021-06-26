# TS 프로젝트 구성 및 기본 설정 추가

### NPM 초기화 및 TS 프로젝트 라이브러리 설치

`package.json`

```json
{
  "name": "project",
  "version": "1.0.0",
  "description": "최종 프로젝트 폴더입니다",
  "main": "app.js",
  "scripts": {
    "build": "tsc"
  },
  "author": "Vicky",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^4.3.4"
  }
}
```

### 타입스크립트 설정 파일 생성 및 기본 값 추가

`tsconfig.json`

```json
{
  "compilerOptions": {
    "allowJs": true,
    "target": "ES5",
    "outDir": "./built",
    "moduleResolution": "Node"
  },
  "include": ["./src/**/*"] // src 이하 모든 파일을 타입스크립트 체크를 하겠다.
}
```

### JS 파일을 TS 파일로 포맷 변환 후 tsc 컴파일 테스트

- `src/app.js` → `src/app.ts`
  - ts 변환 시 IDE에서 자동으로 타입 에러를 훑어 경고해준다.
- app.ts를 컴파일 테스트 해본다.

  ```bash
  $ npm run build
  ```

  - 컴파일 에러 시 터미널에 타입 에러 내역이 반환되며, `built/app.js`로 변환된 파일을 확인할 수 있다.

    타입 에러가 발생해도 자바스크립트 build가 되는 이유?
    타입 에러가 발생한다고 해서 무조건 런타임 과정의 에러가 발생하는 것이 아니므로 빌드는 그대로 진행된다. 즉, 타입 에러와 런타임 에러는 서로 독립적인 관계이다.

    만약 변환해야 할 자바스크립트 파일이 너무 많다면?
    타입체크 시 js파일도 허용하는 옵션인 compilerOptions의 allowJS를 true로 설정해두었으므로 타입 체크를 할 파일만 ts로 변환하고 나머지는 js로 두어 점진적으로 적용해나가도록 한다.

### TS 컴파일 옵션 추가 설정

`tsconfig.json` 파일 시작 bracket `{`에 빨간 밑줄이 존재한다. IDE 가이드를 보면 [전역 값 Promise를 찾을 수 없다.]는 에러메시지가 발생하는데 이를 구글링해서 찾아보면 compilerOptions에 lib 이라는 키값 설정이 필요함을 알 수 있다. 따라서 아래와 같이 추가로 설정해준다.

```json
{
  "compilerOptions": {
    "lib": ["ES2015", "DOM", "DOM.Iterable"], // 추가
    "allowJs": true,
    "target": "ES5",
    "outDir": "./built",
    "moduleResolution": "Node"
  },
  "include": ["./src/**/*"]
}
```
