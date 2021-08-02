## 13. Mini Project

그간 핵심적으로 배워왔던 es6 문법을 사용해 미니 프로젝트를 만들어본다.

### 1. nodeJS 기반 환경구성과 webpack

- 작업 디렉토리 생성 ./playground
- package.json 생성

  ```bash
  $ cd playground/
  $ npm init
  ```

- webpack 설치

  ```bash
  $ npm install webpack —save-dev
  ```

- webpack 빌드환경 설정(webpack.config.js)

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

- `webpack`으로 `bundle.js` 생성하는 메서드를 package.json에 추가(`script.start`)

  ```json
  {
    "name": "playground",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "webpack" // webpack으로 transpile 하라
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "babel-loader": "^8.2.2",
      "babel-preset-env": "^1.7.0",
      "webpack": "^5.12.2",
      "webpack-cli": "^4.3.1"
    },
    "dependencies": {
      "@babel/core": "^7.12.10",
      "@babel/preset-env": "^7.12.11"
    }
  }
  ```

- 디렉토리 내 src/index.js 생성 후 터미널에 package.json에서 설정한 start 메서드를 실행

  ```bash
  $ npm run start # ./dist/bundle.js 생성!
  ```

  ![](../img/210110-1.png)

- 해당 디렉토리를 브라우저로 열어보면 제대로 실행되는 것을 확인할 수 있다.

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

### 3. webpack-dev-server와 html 구성

웹팩에서 제공하는 webpack-dev-server는 개발단계에서 코드 변경 시 자동으로 새로고침을 하여 변경사항을 확인할 수 있도록 해준다.

- webpack-dev-server

  1. webpack-dev-server 설치

     ```bash
     $ npm install webpack-dev-server html-webpack-plugin --save-dev
     ```

  2. package.json에 설정 추가

     `--inline`은 전체 화면을 새로고침해주는 옵션이다.

     ```json
     {
       "name": "playground",
       "version": "1.0.0",
       "description": "",
       "main": "index.js",
       "scripts": {
         "test": "echo \"Error: no test specified\" && exit 1",
         "build": "webpack",
         "devserver": "webpack serve --open"
       },
       "author": "",
       "license": "ISC",
       "devDependencies": {
         "babel-loader": "^8.2.2",
         "babel-preset-env": "^1.7.0",
         "webpack": "^5.12.2",
         "webpack-cli": "^4.3.1",
         "webpack-dev-server": "^3.11.1"
       },
       "dependencies": {
         "@babel/core": "^7.12.10",
         "@babel/preset-env": "^7.12.11"
       }
     }
     ```

  3. webpack.config.js에 dev-server 설정 추가

     ```jsx
     var path = require("path");
     var HtmlWebpackPlugin = require("html-webpack-plugin"); // 추가

     module.exports = {
       // mode, entry, output 등 ..
       devServer: {
         inline: true,
         port: 5500,
       },
       plugins: [
         new HtmlWebpackPlugin({
           // index.html 템플릿을 기반으로 빌드 결과물을 추가해줌
           template: "./index.html",
         }),
       ],
     };
     ```

  4. dev-server 를 실행하면 port번호 5500번으로 로컬 브라우저가 자동 실행된다.

     ```bash
     $ npm run devserver
     ```

- html 구성

  1. html 기본 구조 및 stylesheet 추가

     ```html
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="utf-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <title>My Mini Project</title>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="stylesheet" href="src/css/index.css" />
       </head>
       <body>
         <section class="controller">
           <button class="start">비키 블로그입니다.</button>
         </section>
         <section class="blogList">
           <ul></ul>
         </section>
         <section class="like-list">
           <h4>내 찜 목록</h4>
           <ul></ul>
         </section>
         <script src="./dist/bundle.js"></script>
       </body>
     </html>
     ```

  2. class 기반으로 된 import 스크립트 추가

     ```jsx
     // main.js
     class Blog {
       constructor() {
         console.log("blog is Started");
       }
     }
     export default Blog;
     ```

     ```jsx
     // index.js
     import Blog from "./main";
     const myblog = new Blog(); // blog is Started
     ```

### 4. XHR 통신 및 blogList 추가

4-1. XHR 통신

XMLHttpRequest를 통해 GET data 통신 추가

```jsx
// main.js
class Blog {
  constructor() {
    const dataURL = "../data/data.json";
    this.setInitData(dataURL);
  }

  setInitData(dataURL) {
    this.getData(dataURL);
  }

  getData(dataURL) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", () => {
      const list = JSON.parse(oReq.responseText).body; // list를 파싱한다.
      list.forEach((v) => {
        console.log(v.title);
      });
    });
    oReq.open("GET", dataURL);
    oReq.send();
  }
}
export default Blog;
```

4-2. blogList 추가

```jsx
class Blog {
  constructor() {
    const dataURL = "../data/data.json";
    this.setInitData(dataURL);
  }

  setInitData(dataURL) {
    this.getData(dataURL, this.insertPosts); // fn을 두번째 인자로 추가
  }

  getData(dataURL, fn) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", () => {
      const list = JSON.parse(oReq.responseText).body;
      fn(list); // list embed 과정을 별도의 함수로 분리!
    });
    oReq.open("GET", dataURL);
    oReq.send();
  }
  insertPosts(list) {
    const ul = document.querySelector(".blogList");
    const li = list.map((v) => `<li><a href=${v.link}>${v.title}</a></li>`).join("");
    ul.innerHTML = li;
  }
}
export default Blog;
```

### 5. Set 자료에 데이터 추가 (찜하기 기능)

`XMLHttpRequest`를 통해 받아온 데이터에 대해 좋아요. 싫어요 버튼을 추가하고,
찜한 목록을 카운트 해주는 기능 Set을 이용해 추가해보자!

```jsx
class Blog {
  constructor() {
    this.setInitVariables();
    this.registerEvents();
    this.likedSet = new Set();
  }

  setInitVariables() {
    this.blogList = document.querySelector(".blogList > ul");
    this.likeList = document.querySelector(".like-list > ul");
  }

  registerEvents() {
    const dataURL = "../data/data.json";
    const startBtn = document.querySelector(".start");

    startBtn.addEventListener("click", () => {
      this.setInitData(dataURL);
    });

    // 찜하기 버튼 클릭 이벤트
    this.blogList.addEventListener("click", ({ target }) => {
      const { className: targetClassName } = target;
      // className이 like라면 내 찜 목록에 블로그 제목을 추가한다.
      if (targetClassName !== "like") return;
      const postTitle = target.previousElementSibling.textContent; // target 옆 엘리먼트의 텍스트를 가지고 온다.
      this.likedSet.add(postTitle);
    });
  }

  setInitData(dataURL) {
    // this.insertPosts 내 this.blogList를 사용하기 위해 this를 바인딩 해준다.
    this.getData(dataURL, this.insertPosts.bind(this));
  }

  getData(dataURL, fn) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", () => {
      const list = JSON.parse(oReq.responseText).body;
      fn(list);
    });
    oReq.open("GET", dataURL);
    oReq.send();
  }

  insertPosts(list) {
    // 찜하기 버튼 추가
    const li = list.map((v) => `<li><a href=${v.link}>${v.title}</a><div class="like">찜하기</div></li>`).join("");
    this.blogList.innerHTML += li;
  }
}
export default Blog;
```

### 6. 찜 목록뷰 업데이트

클릭 이벤트 내에 찜 목록뷰를 업데이트하는 코드를 추가해본다.

```jsx
class Blog {
  constructor() {
    this.setInitVariables();
    this.registerEvents();
    this.likedSet = new Set();
  }

	// 공통으로 사용하는 메서드들은 별도의 내부 함수로 분리
  setInitVariables() {
    this.blogList = document.querySelector(".blogList > ul");
  }

  registerEvents() {
    const dataURL = "../data/data.json";
    const startBtn = document.querySelector(".start");

    startBtn.addEventListener("click", () => {
      this.setInitData(dataURL);
    });

    this.blogList.addEventListener("click", ({ target }) => {
      const { className: targetClassName } = target;
      if (targetClassName !== "like" && targetClassName !== "unlike") return;

      const postTitle = target.previousElementSibling.textContent; // 옆에 있는 엘리먼트의 텍스트를 가지고 온다.

      // 찜 취소를 클릭한 경우, 찜하기로 다시 변경하고, 찜 목록을 제고하고 찜 목록뷰를 렌더링한다.
      if (targetClassName === "unlike") {
        target.className = "like";
        target.innerText = "찜하기";
        this.likedSet.delete(postTitle);
      } else {
        // 찜하기 된 목록(div)의 버튼 클래스를 like에서 unlike로 변경
        target.className = "unlike";
        target.innerText = "찜취소";
        // 찜 목록에 추가
        this.likedSet.add(postTitle); // set은 중복된 데이터를 넣지 않으므로 중복 데이터는 없다.
      }

      // 내 찜 목록 UI 추가
      this.updateLikedList();
    });
  }

  updateLikedList() {
    const ul = document.querySelector(".like-list > ul");
    let likedSum = "";
    // li태그에 찜 리스트를 넣고 한번의 innerHTML을 사용한다.
    this.likedSet.forEach((v) => {
      likedSum += `<li>${v}</li>`;
    });
    ul.innerHTML = likedSum;
  }

  setInitData(dataURL) { // .. }

  getData(dataURL, fn) { // .. }

  insertPosts(list) { // .. }
}

export default Blog;
```
