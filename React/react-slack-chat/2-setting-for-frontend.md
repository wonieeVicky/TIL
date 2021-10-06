## front 세팅하기

### 프론트엔드 환경 세팅

1. front 폴더 생성 후 아래와 같이 패키지 설치

   ```bash
   $ git init
   $ npm i react react-dom typescript
   $ npm i @types/react @types/react-dom
   $ npm i -D eslint # eslint는 코드 검사 도구
   $ npm i -D prettier eslint-plugin-prettier eslint-config-prettier #prettier 코드 정렬 도구
   ```

2. front 폴더 하위에 `.eslintrc`, `.prettierrc`, `tsconfig.json` 파일 생성

   `.eslintrc`

   ```
   {
     "extends": ["plugin:prettier/recommended"] # prettier 추천을 따르겠다.
   }
   ```

   `.prettierrc`

   ```
   {
     "printWidth": 120,
     "tabWidth": 2,
     "singleQuote": true,
     "trailingComma": "all", # 객체 뒤 콤마 추가 여부
     "semi": true # 항상 세미콜론(;) 추가 여부
   }
   ```

   `tsconfig.json`

   ```json
   {
     "compilerOptions": {
       "esModuleInterop": true, // import * as React from 'react'; -> import React from 'react';
       "sourceMap": true, // 에러났을 때 에러난 위치 찾아가기 편하다.
       "lib": ["ES2020", "DOM"], // 최신문법 라이브러리 켜놓기
       "jsx": "react", // jsx 를 reactㄹㅎ
       "module": "esnext", // 최신 모듈(import, export)
       "moduleResolution": "Node", // import, export를 Node가 해석할 수 있도록 함
       "target": "es5", // es5로 변환
       "strict": true, // 엄격한 타입체크
       "resolveJsonModule": true, // import Json file 허용
       "baseUrl": ".",
       "paths": {
         // 임포트 편리하게 하기 위한 설정, import A from @src/hello.js
         "@hooks/*": ["hooks/*"],
         "@components/*": ["components/*"],
         "@layouts/*": ["layouts/*"],
         "@pages/*": ["pages/*"],
         "@utils/*": ["utils/*"],
         "@typings/*": ["typings/*"]
       }
     }
   }
   ```
