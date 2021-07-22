# 점진적 타입 적용을 위한 프로젝트 환경 구성

모듈화 진행을 위한 프로젝트 환경 구성을 해보자

### 프로젝트 라이브러리 설치

타입스크립트 및 문법 검사, 코드 정리 도구 라이브러리 추가

```bash
npm i -D typescript @babel/core @babel/preset-env @babel/preset-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier eslint-plugin-prettier
```

### ESLint 설정 파일 추가

프로젝트 폴더 바로 아래에 ESLint 설정 파일 추가

`./.eslintrc.js`

```bash
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
    parser: '@typescript-eslint/parser',
  },
};
```

ESLint ignore 파일 추가

`./.eslintignore`

```bash
node_modules
```

- **VSCode ESLint 플러그인 관련 설정**
    1. VSCode의 ESLint 플러그인 설치
    2. VSCode에서 `cmd` + `shift` + `p` 를 이용하여 명령어 실행 창 오픈
    3. 명령어 실행 창에 open setting(json) 선택
    4. VSCode 사용자 정의 파일인 `setting.json` 내용에 아래와 같이 ESLint 플러그인 관련 설정 추가

        ```json
        // ...
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        },
        "eslint.alwaysShowStatus": true,
        "eslint.workingDirectories": [
            {"mode": "auto"}
        ],
        "eslint.validate": [
            "javascript",
            "typescript"
        ],
        ```

    5. `cmd` + `,` 를 눌러 VSCode 설정 파일에 format on save가 체크 해제 처리 ! (Eslint formatter와 prettier 등의 formatter가 충돌될 수 있으므로)