### TSConfig 셋업 - 다수의 파일 실시간 컴파일

기존에 ts 파일을 자동으로 js로 변환하기 위해 아래의 메서드를 실행시켰다.

```bash
> npx tsc logging.ts -w
```

위와 같이 하면 `logging.ts` 파일이 `logging.js` 변환되고, 파일이 수정될 때마다 지속적으로 업데이트 됨

만약 다수의 파일이라면 어떻게하면 되는가? 바로 프로젝트 내에 `tsconfig.json`을 두면됨

```bash
> tsc --init
```

위 명령어로 `tsconfig.json` 파일을 생성해준다. 아래 내용이 자동완성으로 들어있음

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true /* Skip type checking of declaration files. */,
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  }
}
```

이후 터미널에서 아래와 같은 명령어를 실행

```bash
> tsc -w

Starting compilation in watch mode...
Found 0 errors. Watching for file changes.
```

위와 같이 하면 변경되는 파일이 모두 `tsconfig.json`에 의해 watch mode가 실행되고, 변경 시마다 ts → js 업데이트

### 프로젝트 구조 정리

프로젝트 구조화에 대해 알아본다.

현재는 tsconfig.json을 통해 생성되는 js. ts 파일이 한 루트에서 섞이므로 이 구조를 정리해본다.

`tsconfig.json`

```json
{
  // ..
  "outDir": "./build" /* Redirect output structure to the directory. */
  // ..
}
```

위처럼 설정 후 `tsc -w`를 재실행하면 ./build 구조 아래애 js이 컴파일 되는 것을 확인할 수 있음.

만약 아래와 같이 ts 파일이 ./src 하위에 존재하게 된다면 js 컴파일 파일도 ./build/src/\*로 생성될까?

```bash
.
├── build
│   ├── logging.ts
│   └── main.js
├── src
│   ├── logging.ts
│   └── main.ts
├── index.html
└── tsconfig.json
```

아님. 첫 시작이 되는 타입스크립트 파일이 ./src/\*부터 존재하므로 가장 최상위인 곳부터 컴파일 생성.

동일하게 ./build/\* 하위에 파일이 생성된다.

```bash
.
├── build
│   ├── logging
│   │   └── test.js
│   └── src
│       ├── logging.js
│       └── main.js
├── index.html
├── logging
│   └── test.ts
├── src
│   ├── logging.ts
│   └── main.ts
└── tsconfig.json
```

만약 컴파일 루트가 ./logging, ,./src 두 개라면? build 내에서도 분리됨

즉, 타입스크립트가 있는 최상위부터 컴파일되어서 넘어온다. 보통 src 폴더 하위에 다양한 구조로 분리되므로 아래와 같은 구조를 가짐

```bash
.
├── build
│   ├── logging
│   │   └── logging.js
│   └── main.js
├── index.html
├── src
│   ├── logging
│   │   └── logging.ts
│   └── main.ts
└── tsconfig.json
```

이에 따라 index.html에 Js 연결 경로도 수정해줘야함. 그런데 만약 이를 어기고 src 외부에 ts 파일을 생성한다면? (하위 app.ts 참고)

```bash
.
├── build
│   ├── app.js
│   └── src
│       ├── logging
│       │   └── logging.js
│       └── main.js
├── index.html
├── app.ts
├── src
│   ├── logging
│   │   └── logging.ts
│   └── main.ts
└── tsconfig.json
```

빌드 구조가 app.js, ./src/\*로 분리되어버림. 이는 우리가 원하는 것이 아님..

root 디렉토리 외에서는 빌드가 되지 않도록 설정하는 것이 좋다.

`tsconfig.json`

```json
{
	// ..
	"rootDir": "./src" /* Specify the root directory of input files. Use to control the output directory structure with --outDir.
	// ..
}
```

이후 tsc를 실행시키면 아래와 같은 에러 발생

```bash
> tsc
error TS6059: File '/Users/study/TIL/Typescript/ts-with-oop/10-config/app.ts' is not under 'rootDir' '/Users/uneedcomms/study/TIL/Typescript/ts-with-oop/10-config/src'. 'rootDir' is expected to contain all source files.

Found 1 error.
```

`app.ts` 파일의 위치가 문제가 있다고 타입스크립트에서 알려준다..!

컴파일러 옵션 말고도 다른 것을 설정해볼 수도 있다.

tsconfig.json으로 어떤 파일을 추가하고 제외할 것인지도 설정할 수 있음

`tsconfig.json`

```json
{
  // "compilerOptions": {}a
  "exclude": ["./src/dev.ts"]
}
```

위와 같이 하면 `./src/dev.ts`파일은 빌드 파일에 포함되지 않는다. 반면 include에 끼워넣으면?

```json
{
  // "compilerOptions": {}a
  "include": ["./src/dev.ts"]
}
```

```bash
.
├── app.ts
├── build
│   └── dev.js
├── index.html
├── src
│   ├── dev.ts
│   ├── logging
│   │   └── logging.ts
│   └── main.ts
└── tsconfig.json
```

dev.js 만 컴파일 된 것을 확인할 수 있다.
