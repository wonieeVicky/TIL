## Three.js 시작하기

### Three.js를 배우기 전에

Three.js는 webGL을 기반으로 한다. webGL은 Web Graphics Library의 약자로 웹상에서 2D 및 3D 그래픽을 랜더링하기 위한 로우 레벨 JavaScript API이다. webGL을 통해 3D 개발, 고급 3D 그래픽 애플리케이션을 만들 수 있게 됐다. 하지만 webGL은 배우기가 어렵다. 로우레벨 코드이기 때문..

webGL을 쉽고 간편하게 사용하기 위해 Three.js가 나옴. webGL을 이용하는 라이브러리는 여러가지가 있으나 Three.js가 제일 많이 쓰이고 있는 듯함

### three.js 열어보기

기본적으로 three.js 를 실행해본다.
나의 경우 크롬에서 실행 시 webGL이 정상 동작하지 않고 에러를 뿜어댔는데, 크롬 설정 [시스템] - [가능한 경우 하드웨어 가속 사용] 설정을 해제해둬서 그랬음.. 만약 이 설정을 해 둔 사람이라면 실행이 안될 것 같다.

위 설정을 활성화 한 후 `three.js` 소스를 다운로드 받은 다음 루트 위치에 옮겨준 뒤 이를 실행시킬 `index.html`을 three.js 공식 [document](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)에서 긁어온다.

![](../../img/230114-1.png)

`./index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My first three.js app</title>
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>

  <body>
    <script src="three.js"></script>
    <script>
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      }

      animate();
    </script>
  </body>
</html>
```

위를 live server로 실행 시키면 정상적으로 초록 상자가 노출된다.

![](../../img/230114-2.png)

### 자바스크립트 module 기본

작업하기 전에 JavaScript의 module에 대한 이해를 해야한다.

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <script type="module" src="main.js"></script>
  </body>
</html>
```

위와 같이 작성한 경우 일반 javaScript을 모듈 형태로 쓸 수 있음

`hello.js`

```jsx
export default function hello1() {
  console.log("hello 1!");
}

export function hello2() {
  console.log("hello 2!");
}
```

위와 같이 export default, export 로 모듈 내보내기를 처리해 준 뒤 main.js에서 아랭와 같이 씀

```jsx
// import { hello1, hello2 } from "./hello.js";
// import hello1 from "./hello.js";
import * as hello from "./hello.js";

hello.hello1();
hello.hello2();
```

3D 애니메이션 구현 시에는 `import * as alias` 형태로 많이 사용하는 편. 알고 있지만 한번 더 짚고 넘어감

### three.js 사용 방법(모듈 사용 방법)

이번에는 three.js를 모듈 방법으로 사용하는 것을 배워본다.
새로운 작업 폴더를 생성 후 module 방식의 `three.module.js` 를 다운로드 받아 추가해준다.
다음 index.html을 생성 후 아래처럼 반영

`index.html`

```html
<!DOCTYPE html>
<html>
  <!-- ... -->
  <body>
    <script type="module">
      import * as THREE from "./three.module.js";
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      }

      animate();
    </script>
  </body>
</html>
```

### 웹팩(webpack) 살펴보기

이번에는 간단히 웹팩을 짚고 넘어간다. 웹팩을 알려면 번들링을 해준다. 배포용으로 소스코드를 만들어줌
이번에는 간단하게 js파일을 번들링하는 정도로만 학습한다.(빠르게 넘어가자)

프로젝트 작업 폴더에 `package.json`은 아래와 같음

```json
{
  "name": "threejs-study",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --progress",
    "start": "webpack serve --progress"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.20.7",
    "@babel/core": "^7.20.12",
    "@babel/preset-env": "^7.20.2",
    "babel-loader": "^9.1.2",
    "clean-webpack-plugin": "^4.0.0",
    "copy-webpack-plugin": "^11.0.0",
    "core-js": "^3.27.2",
    "cross-env": "^7.0.3",
    "html-webpack-plugin": "^5.5.0",
    "source-map-loader": "^4.0.1",
    "terser-webpack-plugin": "^5.3.6",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.11.1"
  }
}
```

`npm i`로 패키지들을 모두 설치해준다.

`webpack.config.js`

```jsx
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || "development";

module.exports = {
  mode: webpackMode,
  entry: {
    main: "./src/main.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].min.js",
  },
  // es5로 빌드 해야 할 경우 주석 제거
  // 단, 이거 설정하면 webpack-dev-server 3번대 버전에서 live reloading 동작 안함
  // target: ['web', 'es5'],
  devServer: {
    liveReload: true,
  },
  optimization: {
    minimizer:
      webpackMode === "production"
        ? [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(),
    // CopyWebpackPlugin: 그대로 복사할 파일들을 설정하는 플러그인
    // 아래 patterns에 설정한 파일/폴더는 빌드 시 dist 폴더에 자동으로 생성됩니다.
    // patterns에 설정한 경로에 해당 파일이 없으면 에러가 발생합니다.
    // 사용하는 파일이나 폴더 이름이 다르다면 변경해주세요.
    // 그대로 사용할 파일들이 없다면 CopyWebpackPlugin을 통째로 주석 처리 해주세요.
    // new CopyWebpackPlugin({
    // 	patterns: [
    // 		{ from: "./src/main.css", to: "./main.css" },
    // 		// { from: "./src/images", to: "./images" },
    // 		// { from: "./src/models", to: "./models" },
    // 		// { from: "./src/sounds", to: "./sounds" }
    // 	],
    // })
  ],
};
```

이후 최소한의 구조를 src 폴더에 추가

`./src/index.html`

```jsx
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>

</body>

</html>
```

`./src/message.js`

```jsx
export function message(msg) {
  const elem = document.createElement("p");
  elem.innerHTML = msg;
  document.body.append(elem);
}
```

`./src/main.js`

```jsx
import { message } from "./message.js";

message("Hello Vicky");
```

위와 같이 추가 후 npm start를 하면 localhost:8080에 정상적으로 Hello Vicky가 노출됨
npm build를 하면 dist 폴더에 `index.html`, `main.min.js` 파일이 정상 빌드되어 저장됨
(추가 옵션들은 웹팩 설정으로 추가해준다)

### three.js 사용 방법 - webpack 으로 열기

위에서 webpack 설정을 했으므로 three.js 프로젝트를 시작해본다.

```bash
> npm i three
```

이후 module 타입으로 생성한 main.js 소스를 옮겨온다.

```jsx
import * as THREE from "three"; // import 방식이 변경

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// ..

animate();
```

이후 기본 `index.html` 파일을 추가해준 뒤 devServer를 실행시키면 정상적으로 초록 박스가 노출되는 것을 확인할 수 있다. css 파일도 아래와 추가해준다.

`./src/main.css`

```css
body {
  margin: 0;
}
```

`./src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <!-- main.css import -->
    <link rel="stylesheet" href="./main.css" />
  </head>

  <!-- ... -->
</html>
```

`webpack.config.js`

```jsx
module.exports = {
  // ..
  plugins: [
    // ..
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/main.css", to: "./main.css" }, // 열어준다.
        // { from: "./src/images", to: "./images" },
        // { from: "./src/models", to: "./models" },
        // { from: "./src/sounds", to: "./sounds" }
      ],
    }),
  ],
};
```

위와 같이 반영 후 데브서버 띄우면 정상 반영됨 ! 파일 빌드도 정상적으로 되는 것을 확인할 수 있다.

```bash
.
├── 75.min.js
├── 75.min.js.LICENSE.txt
├── index.html
├── main.css
└── main.min.js
```

빌드 파일 구조

```jsx
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Document</title>
  <link rel="stylesheet" href="./main.css">
  <script defer="defer" src="75.min.js"></script>
  <script defer="defer" src="main.min.js"></script>
</head>

<body></body>

</html>
```

html에 잘 담겨있음
