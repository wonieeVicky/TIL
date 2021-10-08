## 프론트엔드 세팅하기 (feat. babel, webpack 설정)

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

### babel과 webpack 설정

설정하기 앞서 babel, webpack 설정 관련 라이브러리를 설치해준다.

```bash
$ npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react
$ npm i -D @types/webpack @types/node @babel/preset-typescript
$ npm i -D style-loader css-loader
@ npm i cross-env ts-node
```

이번 프로젝트는 JavaScript가 아닌 TypeScript로 구현하므로 webpack 설정도 .ts로 맞춰준다.
타입스크립트는 자바스크립트의 변수, 함수의 매개변수, 함수의 반환값에 타입이 붙어있는 것을 의미한다.

`front/webpack.config.ts`

```tsx
import path from "path";
import webpack from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isDevelopment = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
  name: "sleact",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "eval",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // 바벨이 처리할 확장자 목록
    alias: {
      // tsconfig 설정처럼 ../../ 를 없애기 위한 설정 (typescript, webpack 모두 설정이 필요하다.)
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  entry: {
    app: "./client", // main 파일
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // ts파일이나 tsx 파일을 babel-loader가 자바스크립트로 변환한다.
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["last 2 chrome versions", "IE11"] }, // 타겟 브라우저 설정
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react", // react code 변환
            "@babel/preset-typescript", // typescript code 변환
          ],
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"], // css 파일을 style-loader, css-loader가 자바스크립트로 변환한다.
      },
    ],
  },
  plugins: [
    // typescript 변환 시 필요
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? "development" : "production" }), // react에서 NODE_ENV를 사용할 수 있도록 해 줌
  ],
  output: {
    // client.tsx부터 만들어진 모든 파일이 나오는 경로
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    historyApiFallback: true, // react router
    port: 3090,
    publicPath: "/dist/",
    proxy: {
      "/api/": {
        target: "http://localhost:3095",
        changeOrigin: true,
      },
    },
  },
};

// 개발 환경 플러그인
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "server", openAnalyzer: true }));
}
// 런타임 환경 플러그인
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
}

export default config;
```

`front/index.html`

모든 서비스의 시작점이 된다. 성능 최적화, 검색엔진 등의 이슈에서 굉장히 중요한 역할을 함.

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>슬리액</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        overflow: initial !important;
      }
      body {
        font-size: 15px;
        line-height: 1.46668;
        font-weight: 400;
        font-variant-ligatures: common-ligatures;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
      }
      * {
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="./dist/app.js"></script>
  </body>
</html>
```

#app 엘리먼트에 추가될 시작점 `client.tsx`와 `App.tsx`를 생성해준다.

`front/client.tsx`

```tsx
import React from "react";
import { render } from "react-dom";
import App from "./layouts/App";

render(<App />, document.querySelector("#app"));
```

`front/layouts/App.tsx`

```tsx
import React from "react";

const App = () => {
  return <div>HELLO WORLD!</div>;
};

export default App;
```

또한 `webpack-config.ts`에 typescript 설정을 별도로 해줘야한다.

`front/tsconfig-for-webpack-config.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "Node",
    "target": "ES5",
    "esModuleInterop": true
  }
}
```

위와 같이 설정 후 webpack 실행을 위해 `package.json`의 sciprts 부분에 webpack 실행 명령어를 추가한다

`front/package.json`

```json
{
  "name": "front",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Vicky",
  "license": "MIT"
}
```

아래와 같이 설정하면 webpack 이 잘돌아서 front/dist 폴더에 `app.js`를 생성한 것을 확인할 수 있다.

```bash
$ npm run build

...
sleact (webpack 5.57.1) compiled successfully in 1455 ms
```

### 웹팩 데브 서버 세팅하기

위와 같이 app.js를 추출하는 과정은 수정할 때마다 `npm run build`를 통해 파일을 수정해주어야 하므로 매우 번거롭다. 따라서 데브용 서버를 세팅하여 작업하도록 설정해준다. 아래 내용을 따라가보자

```bash
$ npm i -D webpack-dev-server @types/webpack-dev-server
$ npm i @pmmmwh/react-refresh-webpack-plugin react-refresh
$ npm i -D fork-ts-checker-webpack-plugin # typescript 타입 체크와 webpack이 동시에 동작하도록 해줌
```

위와 같이 데브서버 동작을 위한 라이브러리를 설치한 후 webpack 설정을 추가해준다.

`front/webpack.config.ts`

버전 변경에 따라 `webpack` 호출 하는 방법이 바뀌었고, `babel-loader`의 env 옵션, `ForkTsCheckerWebpackPlugin` 플러그인, devServer 옵션과 `HotModuleReplacementPlugin`, `ReactRefreshWebpackPlugin` 실행함수가 추가되었음

```tsx
import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const config: Configuration = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            // ...
          ],
          // env 옵션 추가
          env: {
            development: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      // ...
    ],
  },
  plugins: [
    // ForkTsCheckerWebpackPlugin 플러그인 추가 : typescript 변환 시 필요
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    // ...
  ],
  output: {
    //..
  },
  // devServer 옵션 추가
  devServer: {
    historyApiFallback: true,
    port: 3090,
    devMiddleware: { publicPath: "/dist/" },
    static: { directory: path.resolve(__dirname) },
    /* proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
        ws: true,
      },
    }, */
  },
};

// 개발 환경 플러그인
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
}
// 런타임 환경 플러그인
if (!isDevelopment && config.plugins) {
  // ...
}

export default config;
```

`front/package.json`

dev 환경 실행 명령어를 `package.json`에 추가해준다.

```json
{
  "scripts": {
    "dev": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development"
    // ...
  }
  // ...
}
```

이후 `npm run dev`로 데스 서버 구동 시켜주면 localhost:3090으로 `App.tsx`가 잘 노출되는 것을 확인할 수 있다.. 😇
