## TypeScript를 배워야 하는 이유

JavaScript 프로그램을 TypeScript로 바꾸면 안전성이 늘어나고, 프로그램의 신뢰도를 높여준다.
TypeScript가 모든 에러를 막아주진 않는다. 하지만, 휴먼 에러 등의 사소한 실수들을 잡아줄 수 있다.

TypeScript의 단점은 JavaScript의 자유도를 줄어든다는 점이다.
실무에서는 에러가 안나는 것이 자유도를 높이는 것보다 중요하므로 배우는 것이 중요하다.

자바스크립트 코드를 작성하더라도 우리는 머릿 속에 코드에 대한 자료 타입을 알고 있다.
이를 명시적으로 작성하는 것이 TypeScript의 개념이므로 생소한 개념이 아니므로 어렵게 생각하지 말자.

🌝 아래 사이트 필수 구독 🌝

- [typescript 공식문서](https://www.typescriptlang.org/)
- [typescript 플레이그라운드](https://www.typescriptlang.org/play)
- [typescript 핸드북 필독](https://www.typescriptlang.org/docs/handbook/intro.html)
- [typescript 버전 수정 내역](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)

### 기본 지식

- 메인 Rule

  **typescript는 최종적으로 javascript로 변환된다.** 순전한 typescript 코드를 돌릴 수 있는 것(runtime = browser + node)은 deno가 있으나 대중화되지 않았음. 브라우저, 노드는 모두 js 파일을 실행한다.

  typescript는 언어이자 컴파일러(tsc)이다. 컴파일러는 ts 코드를 js로 바꿔준다. 즉, ts 파일을 실행하는 게 아니라 결과물인 js를 실행해야 한다.

- tsc는 tsconfig.json(tsc --init 시 생성)에 따라 ts 코드를 js(tsc 시 생성)로 바꿔준다.
  input인 ts와 output인 js 모두에 영향을 끼치므로 tsconfig.json 설정을 반드시 봐야한다.
- tsc는 타입검사와 js 파일로의 변환을 수행하는데, 이는 별개의 공정으로 이루어지므로 타입 에러가 발생해도 js 파일로 변환은 정상적으로 실행됨
- 단순히 타입 검사만 하고싶다면 tsc --noEmit 하면 된다.
- tsconfig.json에서 esModuleInterop: true, strict: true 두 개만 주로 켜놓는 편. strict: true가 핵심
- Node, VS Code(Web Storm), TypeScript 설치

### 프로젝트 환경 구성

`playground/package.json`

```json
{
  "name": "ts-all-in-one",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "devDependencies": {
    "typescript": "^4.9.3"
  }
}
```

위 환경 구성 뒤 `tsc --init` 메서드로 `tsconfig.json` 파일을 추가해준다.

```bash
> tsc --init        
message TS6071: Successfully created a tsconfig.json file.
```

그 뒤 기본 설정 중 allowJS 기능만 활성화 하여 설정한다.

`playground/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
	  "allowJs": true,                                /* Allow javascript files to be compiled. */
    "strict": true,                                 /* Enable all strict type-checking options. */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}
```

- 챙길 것

  `forceConsistentCasingInFileNames` 속성은 import 시 대소문자를 정확히 체크하도록 설정한다.

  `skipLibCheck` `.d.ts` 파일만 검사하도록 설정한다.


다음으로 간단한 test.ts 파일 추가 후 아래와 같이 코드를 작성한 뒤 tsc 컴파일러를 실행시킨다.

```tsx
let a:string = 'hello';
a = 1235;
```

`--noEmit` 은 자바스크립트로 변환하는 과정을 제외하겠다는 의미. 타입체크만 하겠다.

```bash
> tsc --noEmit

first.ts:2:1 - error TS2322: Type 'number' is not assignable to type 'string'.

2 a = 1235;
  ~

Found 1 error.
```

위와 같이 간단한 타입 체크를 진행할 수 있음