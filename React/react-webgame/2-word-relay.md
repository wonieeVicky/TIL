# 끝말잇기 만들기

## 2-1. Webpack 설치하기

- 웹팩(Webpack)이란
  - 여러 개의 자바스크립트 파일을 하나에 합쳐서 하나의 파일로 만들어주는 기술이다.
- 웹팩은 왜 써야할까
  - 서비스가 운영되면서 컴포넌트의 수가 기하급수적으로 많아지는데 이를 하나의 파일로 만들어주고, 코드에 바벨도 적용하고 불필요한 코드의 경우 제거할 수도 있다.
- 웹팩 설치하기

  ```bash
  $ cd project // 웹팩 설치할 폴더로 이동
  $ npm init
  $ npm i react react-dom
  $ npm i -D webpack webpack-cli // -D 개발에서만 사용한다.
  ```

  webpack.config.js

  ```jsx
  module.exports = {};
  ```

  client.jsx

  - .js로 만들어도 되지만 리액트 코드일 경우 .jsx로 표기해주는게 좋다. 명확한 구분을 위해서 !

  ```jsx
  // 설치할 패키지 import
  const React = require("react");
  const ReactDOM = require("react-dom");

  ReactDOM.render(<WordRelay />, document.querySelector("#root"));
  ```

## 2-2. 모듈 시스템과 웹팩 설정

WordRelay.jsx

```jsx
const { Component } = require("react");
const React = require("react");
const { Module } = require("webpack");
const { Component } = React;

class WordRelay extends Component {
  state = {};
  render() {}
}

// 바깥에서도 WordRelay를 사용할 수 있도록 export
Module.exports = WordRelay;
```

client.jsx

```jsx
// 설치할 패키지 import
const React = require("react");
const ReactDOM = require("react-dom");

const WordRelay = require("./WordRelay"); // 필요한 것만 호출할 수 있는 모듈 구조!

ReactDOM.render(<WordRelay />, document.querySelector("#root"));
```

webpack.config.js

1. webpack 설정 이름
2. 실서비스에 업로드할 경우 production
3. eval을 넣을 경우 빠르게 하겠다라는 의미(?)
4. 사용할 확장자를 resolve 내 extensions로 넣어두면 webpack이 알아서 골라서 합친다
5. 어떤 파일을 입력값으로 받을건지 정리
6. 파일을 어디에 어떻게 출력할건지 정리
7. node에서 기본으로 제공되는 기능으로
   C:\users\vicky\TIL\.. 등의 긴 path를 적어주지 않아도 해당 디렉토리 위치를 파악해서 합쳐준다.

```jsx
const path = require("path"); // node에서 경로 조작하는 기능

Module.exports = {
  name: "word-relay-setting", // 1. name
  mode: "development", // 2. webpack 동작 모드
  devtool: "eval", // 3. devtool
  resolve: {
    extensions: [".js", ".jsx"], // 4. 확장자명 모음
  },

  // 5. 입력
  entry: {
    app: ["./client"],
  },

  // 6. 출력
  output: {
    path: path.join(__dirname, "dist"), // 7. node 문법 path
    filename: "app.js",
  },
};
```

## 2-3. 웹팩으로 빌드하기

웹팩으로 실행할 수 있는 방법은 크게 2가지있다.

1. package.json에 설정

   ```json
   {
     "name": "word-relay",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "dev": "webpack" // 설정 후 터미널에 npm run dev
     },
     "author": "Vicky",
     "license": "MIT",
     "dependencies": {
       "react": "^17.0.1",
       "react-dom": "^17.0.1"
     },
     "devDependencies": {
       "webpack": "^5.15.0",
       "webpack-cli": "^4.4.0"
     }
   }
   ```

2. 터미널에 npx로 webpack 실행

```bash
$ npx webpack
```

webpack 실행 전 jsx문법 해석을 위해 바벨을 설치 후 사용 설정을 해준다.

1. 바벨 설치

   ```bash
   $ npm i -D @babel/core @babel/preset-env @babel/preset-react @babel-loader @babel/plugin-proposal-class-properties
   ```

   - @babel/core : 기본 바벨 기능
   - @babel/preset-env : 최신 문법을 사용환경에 맞게 구버전으로 traspile

   - @babel/preset-react : 리액트 문법을 js로 transpile
   - babel-loader: babel과 webpack을 연결해준다.

2. webpack.config.js 설정

```jsx
const webpack = require("webpack");
const path = require("path");

module.exports = {
  name: "wordrelay-setting",
  mode: "development",
  devtool: "eval",
  resolve: {
    extensions: [".js", ".jsx"],
  },

  // 입력
  entry: {
    app: ["./client"],
  },

  module: {
    // 여러 규칙을 정할 수 있으므로 배열이다
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },

  //출력
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js",
  },
};
```

위 설정 후 `$ npm run dev`를 통해 webpack을 실행시키면 `./dist/app.js`가 잘 생성되어 노출된다.

## 2-4. 구구단 웹팩으로 빌드하기

[여기](https://github.com/wonieeVicky/TIL/blob/main/React/react-webgame/multiplication-tables)에서 웹팩 설정 및 빌드 파일 확인해보자 😇

## 2-5. @babel/preset-env와 plugins

- presets는 plugin들의 모임이다.
- @babel/preset-env 는 지원 브라우저 등을 상세하게 설정할 수 있다.

  특히 지원브라우저의 경우 한국에서 사용률이 5%이상인 브라우저 등 다양한 옵션으로 설정 가능하다.  
   ([browserslist](https://github.com/browserslist/browserslist)에서 자세한 내용 확인할 수 있다)

  ```jsx
  const webpack = require("webpack");
  const path = require("path");

  module.exports = {
    // settings..
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["> 5% in KR", "last 2 chrome versions"], // 1. 브라우저별 설정
                  },
                  debug: true,
                },
              ],
              "@babel/preset-react",
            ],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      ],
    },
    // settings..
  };
  ```

- babel-loader 내부의 모듈이 아닌 webpack 자체의 plugins도 설정할 수 있다.

  ```jsx
  const webpack = require("webpack");
  const path = require("path");

  module.exports = {
    // settings...

    plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],

    // settings...
  };
  ```
