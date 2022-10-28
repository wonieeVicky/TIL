﻿## Trello 앱을 Snowpack 프로젝트로 이관하기

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
기본적인 snowpack 사용법에 대해 익혀봤다