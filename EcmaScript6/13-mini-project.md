## 13. Mini Project

그간 핵심적으로 배워왔던 es6 문법을 사용해 미니 프로젝트를 만들어본다.

### 1. nodeJS 기반 환경구성과 webpack

- 작업 폴더 생성 (playground)
- package.json 생성

  ```bash
  $ npm init
  ```

- webpack 설치

  ```bash
  $ npm install webpack —save-dev
  ```

- webpack 설정(webpack.config.js)

  ```jsx
  var path = require("path");
  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [{}],
    },
  };
  ```

- playground 내 `index.html`과 `src/index.js` 를 추가 후 Go Live로 브라우저에 띄워보기

### 2. babel preset 설정

ES6를 모든 브라우저(특히 IE)에서 지원하기 위해서는 ES5로 transpile(변환)하는 `Babel`을 써야하고, 이는 `webpack` 설정을 통해 이용 가능하다.

1. 바벨 패키지 `babel-loader`와 `@babel/core` `@babel/preset-env` 설치

```bash
$ npm install babel-loader @babel/core @babel/preset-env --save-dev
```

2. webpack.config.js 에 babel 설정값 추가

- `targets` 내에는 지원할 브라우저를 특정한다.
- `debug` 모드를 활성화하면 build 시 디버그 콘솔이 터미널에 노출된다.

```jsx
var path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: ["last 2 versions", "ie 9"],
                  debug: true, // build 시 디버그 콘솔을 터미널에 노출
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
```
