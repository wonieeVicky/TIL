## Trello 앱을 Snowpack 프로젝트로 이관하기

### Snowpack이란?

Snowpack은 스벨트를 제작한 Rick Harris가 만든 것으로 프론트엔드 빌드 도구이다. 점점 고도화되고 있다. 기존의 webpack, rollup, parcel같은 무겁고 복잡한 번들러의 번들 소요 시간을 획기적으로 절약해준다.

Snowpack는 번들러가 아니며, 웹 빌드 시스템에 대한 새로운 접근 방식을 제공한다. JavaScript의 ESM(브라우저에도 import, export 가 동작하므로 해당 방법을 사용함)을 활용하여 동일 파일을 다시 빌드하지 않는 최초의 빌드 시스템을 생성해서 변경사항을 브라우저에 즉시 적용할 수 있다.

```jsx
// CommonJS
const xxx = require("svelte")
module.exports = xxx

// ESM
import xxx from "svelte"
export let xxx
export default xxx
```

관련 문서는 해당 [링크](https://heropy.blog/2020/10/31/snowpack/)에서 자세히 확인해볼 수 있다.

위와 같은 ‘번들 없는 개발’ 방식은 기존 방식에 비해 몇 가지 장점이 있다.

- 빠르다.
- 예측한 대로 동작한다.
- 디버깅이 더 쉽다.
- 개별 파일 캐시가 더 좋다.
- 프로젝트 크기가 개발 속도에 영향을 주지 않는다.

모든 파일은 개별적으로 빌드되고, 지속해서 캐시되므로 파일에 변경사항이 없으면 파일을 다시 빌드하지 않고 브라우저에서 다시 다운로드 하지 않는다. 이것이 번들없는 개발의 핵심이다.

또, Snowpack은 즉시(50ms 미만) 시작하여 속도 저하 없이 무한히 큰 프로젝트로 확장할 수 있다.
반대로 기존 번들러로 대규모 앱을 빌드할 때는 개발 시작 시간이 30초 이상 걸리는 것이 일반적이다.

### Snowpack 기반의 Svelte 템플릿 설치 및 구성 이해

먼저 Snowpack 템플릿을 설치해본다.

```bash
% npx degit snowpackjs/snowpack/create-snowpack-app/app-template-svelte svelte-snowpack
> cloned snowpackjs/snowpack#HEAD to svelte-snowpack
```

그리고 프로젝트를 vscode로 오픈한다.

```bash
% tree
.
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo.svg
│   └── robots.txt
├── snowpack.config.mjs
├── src
│   ├── App.svelte
│   ├── App.test.js
│   └── index.js
└── web-test-runner.config.js

2 directories, 11 files
```

위와 같은 구조로 설치되어 있다. 주의 깊게 살펴봐야할 것은 index.html이다.

`./public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Web site created using create-snowpack-app" />
    <title>Snowpack App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script type="module" src="/dist/index.js"></script>
  </body>
</html>
```

위에 보면 작업한 js 파일이 module 타입으로 추가되어 있는 것을 확인할 수 있다.
위 index.js 파일에 작업물이 들어가게 되는 구조라고 보면 된다. 그럼 index.js를 더 살펴보자

`./src/index.js`

```jsx
import App from "./App.svelte"

let app = new App({
  target: document.body,
})

export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// 화면에 변경되었을 때 자동적으로 감지하여 화면이 새로고침되도록 해줌
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
}
```

index.js가 코드의 시작점이다. 해당 코드 하위에는 HMR을 지원하는 코드가 삽입되어있음. 화면을 직접 새로고침하여 확인하고 싶을 경우에는 해당 코드는 주석처리해도 된다!

위 index.js 파일명을 main.js로 바꿔주고 싶다면, 변경한 뒤 `./public/index.html`에도 반영을 해주면 된다.

`./public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <!-- ... -->
  <body>
    <script type="module" src="/dist/main.js"></script>
  </body>
</html>
```

src 폴더하위에는 테스트를 할 수 있는 테스트 코드와 기타 사이트를 이루는 컴포넌트들이 속하는 공간임을 확인할 수 있다. snowpack이 동작되는 것을 설정하는 snowpack.config.mjs를 살펴보자.

`./snowpack.config.mjs`

```jsx
/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/", static: true }, // Root 위치
    src: { url: "/dist" }, // 작업물을 /dist에 저장한다.
  },
  plugins: ["@snowpack/plugin-svelte", "@snowpack/plugin-dotenv"],
}
```

위와 같이 간략한 설정만으로도 사이트가 빌드되도록 구현할 수 있게된다.
이제 패키지 install 및 빌드를 해보자

```bash
% npm i
% npm run dev
% npm run build
$ tree .
.
├── build
│   ├── _snowpack
│   │   ├── env.js
│   │   └── pkg
│   │       ├── common
│   │       │   └── index-28d2002a.js
│   │       ├── import-map.json
│   │       ├── svelte
│   │       │   └── internal.js
│   │       └── svelte.js
│   ├── dist
│   │   ├── App.svelte.css
│   │   ├── App.svelte.css.proxy.js
│   │   ├── App.svelte.js
│   │   └── index.js
│   ├── favicon.ico
│   ├── index.html
│   ├── logo.svg
│   └── robots.txt
...
```

위처럼 dist 폴더에 작업물 파일이 정상적으로 빌드되어 들어가는 것을 확인할 수 있다!
기본적인 snowpack 사용법에 대해 익혀봤다.

### 주요 디렉터리 복사 및 HMR 적용

이제 기존에 작업한 Trello 클론 앱을 snowpack으로 옮겨본다.
우선 기존 소스를 옮길 디렉터리부터 생성해준다.

```bash
% mkdir svelte-trello-app-snowpack
% cd svelte-trello-app-snowpack
$ code .
```

위 디렉터리로 vscode를 열어준 뒤 기존 trello-app의 public, src 경로의 파일을 복사해준다.
다음으로 public/build에는 rollup이 만든 빌드 파일이 들어있으므로 하위 경로 및 파일을 모두 삭제해준다.

그리고 난 뒤 기존 build 경로로 연결되어 있던 main.js 코드의 경로를 수정해준다.

`./public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <!-- <script type="module" src="/dist/main.js"></script> -->
    <script type="module" src="/dist/main.js"></script>
  </head>
</html>
```

이제 HMR를 적용해본다. 자세한 내용은 문서참조

`./src/main.js`

```jsx
import App from "./App.svelte"

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
})

export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// 화면에 변경되었을 때 자동적으로 감지하여 화면이 새로고침되도록 해줌
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
}
```

### 핵심 모듈 설치 및 구성

이제 기존 프로젝트에서 설치해야하는 핵심 모듈을 파악하고 실제로 설치해본다.

`package.json`

```bash
% npm init -y
% npm i -D snowpack svelte @snowpack/plugin-svel
te @snowpack/plugin-dotenv autoprefixer postcss uuid lodash sortablejs
```

프로젝트에 필요한 패키지를 설치한 뒤 snowpack 구동에 필요한 옵션을 추가해보자

`snowpack.config.js`

```jsx
module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: ["@snowpack/plugin-svelte", "@snowpack/plugin-dotenv"],
}
```

위와 같이 public, src 루트를 추가해주고, 사용할 plugins를 적절히 추가해준다.

다음으로 기존에 crypto-random-string으로 구현했던 generateId 함수를 uuid를 통해 구현하도록 로직을 일부 수정해준다.

`./src/store/list.js`

```jsx
// ..
// import cryptoRandomString from "crypto-random-string"
import { v4 as uuid } from "uuid"

// const generateId = () => cryptoRandomString({ length: 10 })
const generateId = () => uuid()
```

기본적인 핵심 모듈 설치와 구성이 완료되었다!

### SCSS 및 Svelte Preprocess 구성

이번에는 svelte의 전처리 옵션을 이관해보고자 한다.
기존에 svelte 프로젝트에서는 sveltePreprocess로 전처리 옵션을 구성해보았는데, 이를 snowpack.config.js에 새롭게 설정할 필요가 있다.

`rollup.config.js(기존 프로젝트)`

```jsx
import sveltePreprocess from "svelte-preprocess"

// ..
plugins: [
  svelte({
    preprocess: sveltePreprocess({
      scss: {
        prependData: '@import "./src/scss/main.scss";', // prepend로 데이터를 앞에 붙여준다.
      },
      postcss: {
        plugins: [require("autoprefixer")()],
      },
    }),
    // ..
  }),
  // ..
]
```

`snowpack.config.js`

```jsx
module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: [
    [
      "@snowpack/plugin-svelte",
      {
        preprocess: require("svelte-preprocess")({
          scss: {
            prependData: '@import "./src/scss/main.scss";',
          },
          postcss: {
            plugins: [require("autoprefixer")()],
          },
        }),
      },
    ],
    "@snowpack/plugin-dotenv",
  ],
}
```

`@snowpack/plugin-svelte` 패키지를 설치하면 `svelte-preprocess` 모듈이 함께 설치되므로, 별도의 설치과정없이 바로 svelte-preprocess를 위처럼 적용해준다. 위와 같은 설치 방법은 [공식 문서](https://www.npmjs.com/package/@snowpack/plugin-svelte)를 보고 참조하여 작업할 수 있다.

이제 node-sass도 설치해줘본다. 아래의 관련 패키지를 설치해줘야 한다.

```bash
% npm i -D @snowpack/plugin-sass
```

이후 snowpack.config.js의 plugins에 추가해준다.

`snowpack.config.js`

```jsx
module.exports = {
  mount: {
    // ..
  },
  plugins: [
    [
      "@snowpack/plugin-svelte",
      {
        // ..
      },
    ],
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-sass", // 여기에 추가
  ],
}
```

뿐만 아니라 autoPrefixer 기능을 사용하기 위해서는 기준 브라우저 버전을 package.json에서 맞춰주어야 한다.
기존 프로젝트에서 설정해둔 browserlist 설정도 package.json에 추가해준다.

`package.json`

```json
{
  // ..
  "browserslist": ["> 1%", "last 2 versions"],
  "devDependencies": {}
}
```

scss 및 전처리 관련 설정 끗
