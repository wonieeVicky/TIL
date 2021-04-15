# 타입스크립트 프로젝트 환경 세팅

기본 타입스크립트 프로젝트를 세팅해보자

`package.json`

```json
{
  "name": "lecture",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack"
  },
  "author": "Vicky",
  "license": "ISC",
  "dependencies": {
    "@types/react": "^17.0.3", // index.d.ts - react
    "@types/react-dom": "^17.0.3", // index.d.ts - react-dom
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "typescript": "^4.2.4"
  },
  "devDependencies": {
    "awesome-typescript-loader": "^5.2.1", // ts-loader 대신 사용해봄
    "webpack": "^5.32.0",
    "webpack-cli": "^4.6.0"
  }
}
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["ES5", "ES2015", "ES2016", "ES2017", "DOM"],
    "jsx": "react"
  }
}
```

`webpack.config.js`

```jsx
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development", // production
  devtool: "eval", // hidden-source-map
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },
  entry: {
    app: "./client", // 시작점
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
    ],
  },
  plugins: [],
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
};
```

터미널에서 npx webpack을 실행시켜보면 정상적으로 dist 폴더에 빌드파일이 들어가는 것을 확인할 수 있다.

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>구구단</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./dist/app.js"></script>
  </body>
</html>
```

`client.tsx`

```tsx
import * as React from "react"; // 1
import * as ReactDOM from "react-dom"; // 1

import GuGuDan from "./GuGuDan";

ReactDOM.render(<GuGuDan />, document.querySelector("#root"));
```

1.  왜 React와 ReactDOM을 _ as를 붙여서 import할까?  
    바로 `index.d.ts`에서 export default를 지원하지 않으므로 _ as를 사용한다. 아니면 타입에러 발생

        물론 `tsconfig.json`에서 `exModuleInterop`이라는 기능을 활성화시키면 해당 영역에 대한 에러가 사라지지만 그건 근본적인 해결책이 아니므로 위와 같이 처리해준다.
