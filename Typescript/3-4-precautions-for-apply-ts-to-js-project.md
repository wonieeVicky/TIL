- [존스 홉킨스 코로나 현황](https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6), [Postman API](https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest#27454960-ea1c-4b91-a0b6-0468bb4e6712), [Type Vue without Typescript](https://blog.usejournal.com/type-vue-without-typescript-b2b49210f0b) 를 참고하여 프로젝트 진행

### 자바스크립트 코드에 타입스크립트를 적용할 때 주의해야 할 점

- 기능적인 변경은 절대 하지 않을 것
- 테스트 커버리지가 낮을 땐 함부로 타입스크립트를 적용하지 않을 것
- 처음부터 타입을 엄격하게 적용하지 않을 것(점진적으로 strict 레벨을 증가시킨다)

### 자바스크립트 프로젝트에 타입스크립트를 적용하는 절차

- 자바스크립트 프로젝트에 타입스크립트를 적용하는 경우 아래의 절차를 따르면 도움이 된다.
  - TIP - TLDR
    1. 타입스크립트 환경 설정 및 ts 파일로 변환
    2. any 타입 선언
    3. any 타입을 더 적절한 타입으로 변경

### 1. 타입스크립트 프로젝트 환경 구성

- 프로젝트 생성 후 NPM 초기화 명령어로 `package.json` 파일을 생성한다.
- 프로젝트 폴더에서 `npm i typescript -D`로 타입스크립트 라이브러리를 설치한다.
- 타입스크립트 설정 파일 `tsconfig.json`을 생성하고 기본 값을 추가한다.

  ```json
  {
    "compilerOptions": {
      "allowJs": true,
      "target": "ES5",
      "outDir": "./built",
      "moduleResolution": "Node",
      "lib": ["ES2015", "DOM", "DOM.Iterable"]
    },
    "include": ["./src/**/*"], // src 이하 모든 파일을 타입스크립트 체크를 하겠다.
    "exclude": ["node_modules", "dist"]
  }
  ```

- 서비스 코드가 포함된 자바스크립트 파일을 자바스크립트 파일로 변환한다.
- 타입스크립트 컴파일 명령어 `tsc`로 타입스크립트 파일을 자바스크립트 파일로 변환한다.

### 2. 엄격하지 않은 타입 환경(loose type)에서 프로젝트 돌려보기

- 프로젝트에 테스트 코드가 있다면 테스트 코드가 통과하는지 먼저 확인한다.
- 프로젝트의 js파일을 모두 ts 파일로 변경한다.
- 타입스크립트 컴파일 에러가 나는 것 위주로만 먼저 에러가 나지 않게 수정한다.
  - 여기서, 기능을 사소하게라도 변경하지 않도록 주의하자.
- 테스트 코드가 성공하는지 확인한다.

### 3. 명시적인 any 선언하기

- 프로젝트 테스트 코드가 통과하는지 확인한다.
- 타입스크립트 설정 팡리에 `noImplicitAny: true`를 추가한다.
- 가능한 타입을 적용할 수 있는 모든 곳에 타입을 적용한다.
  - 라이브러리를 쓰는 경우 DefinitelyTyped에서 `@types` 관련 라이브러리를 찾아 설치한다.
  - 만약, 타입을 정하기 어려운 곳이 있으면 명시적으로라도 `any`를 선언한다.
- 테스트 코드가 통과하는지 확인한다.

### 4. strict 모드 설정하기

- 타입스크립트 설정 파일에 아래 설정을 추가한다.

  ```json
  {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
  ```

- `any`로 되어 있는 타입을 최대한 더 적절한 타입으로 변환한다.
- `as`와 같은 키워드를 최대한 사용하지 않도록 고민해서 변경한다.
