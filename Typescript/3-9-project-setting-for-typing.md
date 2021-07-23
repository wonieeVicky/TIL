# 점진적 타입 적용을 위한 프로젝트 환경 구성
모듈화 진행을 위한 프로젝트 환경 구성을 해보자

### 프로젝트 라이브러리 설치

타입스크립트 및 문법 검사, 코드 정리 도구 라이브러리 추가

```bash
npm i -D typescript @babel/core @babel/preset-env @babel/preset-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier eslint-plugin-prettier
```

### ESLint 설정 파일 추가

- ESLint란 자바스크립트 코드의 에러 가능성을 줄여주는 코드 문법 보조도구이다. 뿐만 아니라 코드 prettier의 역할, 자동 완성 역할도 수행한다. Prettier와 조합하여 자주 사용하는 편이다.
- 먼저 프로젝트 폴더 바로 아래에 ESLint 설정 파일 추가한다.

    `./.eslintrc.js`

    ```jsx
    module.exports = {
      root: true,
      env: {
        browser: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: ['prettier', '@typescript-eslint'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            semi: true,
            useTabs: false,
            tabWidth: 2,
            printWidth: 80,
            bracketSpacing: true,
            arrowParens: 'avoid',
          },
        ],
      },
      parserOptions: {
        parser: '@typescript-eslint/parser', // 타입스크립트 코드를 eslint가 읽을 수 있는 형태로 바꿔준다.
      },
    };
    ```

- ESLint ignore 파일 추가

    `./.eslintignore`

    ```bash
    node_modules
    ```

    - **VSCode ESLint 플러그인 관련 설정**
- ESLint Rules
    - `"extneds": "eslint:recommended"` 로 설정하면 ESLint에서 기본적으로 권장하는 설정을 그대로 체크해준다.

### 바벨(Babel)

최신 자바스크립트 문법이 다양한 브라우저에서 호환될 수 있도록 Transpile 해주는 도구(Compiler)이다.
바벨을 타입스크립트와 같이 사용하기 위해서는 @preset-typescript 가 필요하다.

```bash
$ npm i -D @babel/preset-typescript
```

### Prettier

eslintrc 설정에서 eslint-plugin-prettier 플러그인을 설치하여 설정할 수 있다.

- `eslintrc.js`

    ```jsx
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          useTabs: false,
          tabWidth: 2,
          printWidth: 80,
          bracketSpacing: true,
          arrowParens: 'avoid',
        },
      ],
    },
    ```

### TSLint를 쓰지않고 ESLint를 사용하는 이유?

- 성능 이슈, tslint보다 Eslint가 더 좋은 퍼포먼스를 나타냄