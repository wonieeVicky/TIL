## Trello 클론 앱 만들기 - 실습

### 프로젝트 기본 모듈 업데이트

본격적으로 어플리케이션을 만들에 앞서 기본 모듈 버전을 업데이트 해준다.

```bash
$ npm i -D svelte@^3 @rollup/plugin-commonjs@^15 @rollup/plugin-node-resolve@^9
```

### Header 컴포넌트 작성

Header 컴포넌트부터 작성해준다.

`./src/components/Header.svelte`

```html
d
<header>
  <img src="/images/trello-logo.svg" alt="Trello" class="logo" />
</header>

<style>
  header {
    height: 40px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  header img.logo {
    width: 80px;
    height: auto;
    opacity: 0.5;
  }
</style>
```

`./public/images` 루트에 trello-logo 이미지를 추가해준 뒤 해당 파일을 Header에 적용시켜준다.
배치는 정 가운데 위치하도록 설정해주는 스타일 코드를 넣었다.

![](../img/220903-1.png)

현재 위 레이아웃으로 오우라저에 노출되므로 화면에 존재하는 여백을 지워줘야하는데, 해당 부분을 reset 처리해주는 `Reset.css`를 따로 준비해준다.

### Reset.css와 Google Fonts

구글에 reset.css cdn이라고 검색하면 나오는 `reset-css` [링크](https://www.jsdelivr.com/package/npm/reset-css)를 열어 해당 cdn을 HTML 형태로 복사하여 `index.html`에 복붙해준다.

`./public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css" />
  </head>
</html>
```

이번에는 폰트도 적용해본다! [googleFont](https://fonts.google.com/specimen/Roboto)에서 Roboto 폰트를 사용한다.
용량이 한정적이므로 Embed 폰트를 400, 700사이즈만 적용한다.

`./public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
    <style>
      font-family: "Roboto", sans-serif;
    </style>
  </head>
</html>
```

위처럼 하면 불필요한 여백이 아래와 같이 사라지는 것을 확인할 수 있으며 페이지 전역에 Roboto 폰트가 적용된 것을 확인할 수 있다.

### SCSS(svelte-preprecess, node-sass)

Header 태그에서 작성한 스타일 코드를 scss를 통해 개선해보고자 한다.

```bash
> npm i -D svelte-preprocess node-sass
```

`./rollup.config.js`

```jsx
import sveltePreprocess from "svelte-preprocess"

// ..
export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(), // preprocess 옵션 추가
      dev: !production,
    }),
    // ..
  ],
  // ..
}
```

위와 같이 설정 후 Header.svelte를 scss 포맷으로 수정해준다.

`./src/components/Header.svelte`

```html
<header>
  <img src="/images/trello-logo.svg" alt="Trello" class="logo" />
</header>

<style lang="scss">
  header {
    height: 40px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    img.logo {
      width: 80px;
      height: auto;
      opacity: 0.5;
    }
  }
</style>
```

위와 같이 설정 후 개발서버를 다시 띄워주면 스타일이 정상적으로 적용되어 있는 것을 확인할 수 있다.

![](../img/220927-1.png)

그런데 Header 파일 내 scss 로 속성으로 설정한 부분에서 아래와 같이 에러가 발생한다.

![](../img/220927-2.png)

이는 바로 Svelte for VS Code 익스텐션이 node 위치를 찾지못해 발생한 오류로 이를 개선하기 위해서 익스텐션 설정 내 Language-server: Runtime 에 node 경로를 직접 입력해준다.

node 위치는 아래 명령어로 확인할 수 있다.

```bash
svelte-trello-app % which node
/usr/local/bin/node
```

### 공급업체 접두사 후처리(autoprefixer(PostCSS))

이번 시간에는 공급업체 접두사라는 개념에 대해 알아보려고 한다.

`./src/components/Header.svelte`

```html
<style lang="scss">
  header {
    /* ... */
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-box;
  }
</style>
```

위와 같이 `-ms-flexbox`라고 작성하면 IE 등의 구형 브라우저에서도 flex 속성을 지원하도록 설정할 수 있는 것을 공급업체 접두사라고 한다. -ms-는 IE, -webkit-은 크롬, -moz- 은 모질라 브라우저의 구형 버전을 지원하는 접두사인데, 이를 하나하나 찾아서 작성하기에는 너무 불편하고 어렵다.

이를 수동으로 작성하지 않고 필요한 공급업체 접두사를 자동으로 입력해주는 라이브러리가 있다.

```bash
npm i -D autoprefixer@^10 postcss
```

이를 rollup.config.js에 아래와 같이 설정해준다.

```jsx
//..
export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [require("autoprefixer")()] /*  autoprefixer 설정 추가 */,
        },
      }),
      dev: !production,
    }),
    // ..
  ],
}
```

위처럼 작성하면 무조건 공급업체 접두사가 붙는가? 그렇지 않다.
어떤 버전을 기준으로 autoprefixer가 동작하는지 알 수 없기 때문이다.
따라서 package.json에 기준으로 동작하는 browserlist 옵션을 추가해준다.

`./package.json`

```json
{
  "name": "svelte-app",
  // ..
  "browserslist": ["> 1%", "last 2 versions"]
  // ..
}
```

`> 1%` 라는 의미는 전세계 브라우저 점유율이 1% 이상인 브라우저를 모두 포함한다는 의미이며, `last 2 versions`는 해당 브라우저의 최신 2개 버전을 지원하겠다는 의미이다.

위와 같이 브라우저 환경에 대해 명시해준 뒤 dev 환경을 열어보면 알아서 공급업체 접두사가 자동으로 들어간 상태라는 것을 확인할 수 있다.

![공급업체 접두사가 자동으로 들어가있는 것을 확인할 수 있다!](../img/220928-1.png)

이와 같이 라이브러리를 활용하여 수많은 공급업체 접두사를 빠르고 간편하게 추가할 수 있게 되었다.
이는 웬만한 프로젝트에 모두 적용하는 것이 바람직하겠다.

이외로 scss 포맷은 rgba라는 함수를 제공하는데 두 개의 인수만 넣어도 동작한다.

`./src/components/Header.svelte`

```html
<style lang="scss">
  header {
    background-color: rgba(black, 0.4);
  }
</style>
```

위 함수는 scss에서 제공하는 기능이므로, 간단하게 해당 컬러를 넣어 적용할 수 있어 매우 간편하다!

![실제 번들링된 css에는 자동으로 rgb 컬러로 들어가 있음](../img/220928-1.png)

### 경로 별칭(@rollup/plugin-alias)

이제 App 컴포넌트에 배경화면을 추가해본다.
우리는 기본적인 방법으로 아래와 같이 배경화면을 추가해줄 수 있다.

`./src/App.svelte`

```html
<script>
  import Header from "./components/Header.svelte"

  document.body.style.backgroundImage = "url(/images/bg.jpg)"
  document.body.style.backgroundSize = "cover"
</script>
```

그런데 위와 같은 적용 코드가 더 많아진다면, 지저분하고, 가독성이 떨어지게 될 것이다.
따라서 위 코드는 아래와 같이 `Object.assign` 메서드를 사용해 깔끔하게 작성해줄 수 있다.

`./src/App.svelte`

```html
<script>
  import Header from "./components/Header.svelte"

  Object.assign(document.body.style, {
    backgroundColor: "darkgray",
    backgroundImage: "url(/images/bg.jpg",
    backgroundSize: "cover",
  })
</script>
```

이 외로도 import를 해오는 컴포넌트의 경로가 상대 경로로 작성되어 있는데, 파일 구조가 복잡해질수록 경로 별칭을 사용하는 것이 좋다. `@rollup/plugin-alias`를 먼저 설치한 뒤 rollup config에 설정을 추가해준다.

```bash
> npm i -D @rollup/plugin-alias
```

`./rollup.config.js`

```jsx
import path from "path"
import alias from "@rollup/plugin-alias"
//..

export default {
  // ..
  plugins: [
    // ..
    commonjs(),
    alias({ entries: [{ find: "~", replacement: path.resolve(__dirname, "src/") }] }),
    // ..
  ],
  // ..
}
```

위처럼 alias 설정을 추가한 뒤 Header 컴포넌트의 경로를 아래와 같이 수정해준다.

`./src/App.svelte`

```html
<script>
  import Header from "~/components/Header.svelte"
</script>
```

### ListContainer, List, CreateList 컴포넌트 작성

이제 Header를 제외한 나머지 부분인 ListContainer 컴포넌트를 작업해본다.

`./src/components/ListContainer.svelte`

```html
<script>
  import List from "~/components/List.svelte"
  import CreateList from "~/components/CreateList.svelte"
</script>

<div class="list-container">
  <div class="lists">
    <List />
    <List />
  </div>
  <CreateList />
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    border: 10px solid red;
    padding: 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    .lists {
      display: inline-block;
      height: 100%;
      border: 10px solid blue;
      box-sizing: border-box;
      white-space: nowrap;
      font-size: 0;
    }
  }
</style>
```

`./src/components/List.svelte`

```html
<div class="list" />

<style lang="scss">
  .list {
    display: inline-block;
    font-size: 16px;
    white-space: normal;
    width: 290px;
    height: 100%;
    border: 10px solid yellowgreen;
    box-sizing: border-box;
    margin: 0 4px;
  }
</style>
```

`./src/components/CreateList.svelte`

```html
<div class="create-list">+ Add another list</div>

<style lang="scss">
  .create-list {
    font-size: 16px;
    white-space: normal;
    width: 290px;
    display: inline-block;
    padding: 10px 8px;
    vertical-align: top;
    background: rgba(#ebecf0, 0.6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: #ebecf0;
    }
  }
</style>
```

![](../img/220930-1.png)

위처럼 작업하면 아래와 같은 기본 레이아웃이 생성된다.

해당 레이아웃을 만들 때 기본적으로 flex를 이용해서 많이 만들어왔는데, 여기에서는 inline-block 과 white-space, vertical-align 속성 등으로 해당 레이아웃을 구현함. 구 스타일 API로만 구성하는 레이아웃이므로 오히려 호환성 면에서 낫다는 생각도 든다. 참조할 것

### Lists 커스텀 스토어와 Storage API

이제 createList 컴포넌트를 통해 실제 리스트를 생성할 수 있도록 만들어준다.
이를 위해 store를 도입해준다. 정보 저장은 로컬 스토리지에 저장해준다.

로컬스토리지는 최대 10MB까지 저장할 수 있으며 HTML5 권장은 5MB이다.
Key-Value 형태의 문자로 저장하기 때문에 충분한 용량이라고 볼 수 있다. 로컬 스토리지는 창을 닫아도 저장된 데이터가 해당 도메인에서 계속 유지되므로 한 번 저장된 데이터가 유실되지 않고 계속 남게 된다.

`./src/store/list.js`

```jsx
import { writable } from "svelte/store"

const repoLists = JSON.parse(window.localStorage.getItem("lists")) || []

const _lists = writable(repoLists) // 외부에서 사용하지 않고 내부에서만 사용하는 정보
_lists.subscribe(($lists) => window.localStorage.setItem("lists", JSON.stringify($lists)))

export const lists = {
  subscribe: _lists.subscribe, // 실행시키지 않고 참조관계로 연결
  add(payload) {
    // custom event
    const { title } = payload
    _lists.update(($lists) => {
      $lists.push({
        id: "", // crypto-random-string을 통한 고유 문자열 생성
        title,
        cards: [],
      })
      return $lists
    })
  },
}
```

위처럼 스토어 내부에 존재하는 writable 함수는 `_`기호를 사용해 `_lists` 변수로 저장하고, 이를 외부에서 사용하는 lists 함수와 참조 관계로 연결하여 구현해주면 스토리지를 활용한 간단한 subscribe, add 스토어 함수가 만들어진다.

### 랜덤 고유 문자열 생성(crypto-random-string)과 Rollup 구성

이제 list 스토어의 add 함수에 들어갈 랜덤 id 값을 `crypto-random-string`을 이용해 넣어보고자 한다. 간단한 패키지로 uuid가 있으나 rollup 설정을 하는 과정을 배워보고자 위 모듈을 선택했다.

```bash
> npm i -D crypto-random-string@3.2
```

설치한 모듈을 list 스토어에 반영해보자.

`./src/store/list.js`

```jsx
import { writable } from "svelte/store"
import cryptoRandomString from "crypto-random-string"

const generateId = () => cryptoRandomString({ length: 10 })

// ..
export const lists = {
  subscribe: _lists.subscribe,
  add(payload) {
    const { title } = payload
    _lists.update(($lists) => {
      $lists.push({
        id: generateId(),
        title,
        cards: [],
      })
      return $lists
    })
  },
}
```

`./src/components/CreateList.svelte`

```html
<script>
  import { lists } from "~/store/list"
  lists.add({
    title: "vicky",
  })
</script>

<div class="create-list">+ Add another list</div>
```

위와 같이 추가 후 lists.add를 실행시켜주면 에러가 발생하는데 에러메시지는 아래와 같다.

```
Uncaught TypeError: crypto__default.default.randomBytes is not a function
```

rollup 번들러를 사용하면 위와 같은 에러 메시지를 자주 만나게 되는데, rollup 번들러는 기본적으로 아주 가볍게 설계되어 있기 때문이다. 다르게 얘기하자면 날 것에 가까운 상태인데, node.js의 전역 API나 내장 API가 번들이 가능한 형태로 준비되어 있지 않기 때문에 위와 같이 node.js 구동에 필요한 메서드들이 추가되었을 때 에러메시지가 발생한다.

따라서 필요에 따라 살을 붙여나가야한다. crypto 모듈 또한 별도의 번들 설정을 해주어야 사용할 수 있다.
Node의 내장 API 사용을 위해서는 아래의 것들을 설치해주면 된다.

- rollup-plugin-node-builtins : Node 내장 API를 사용할 수 있음
- rollup-plugin-node-globals : 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있다.
- rollup-plugin-replace : 번들 파일의 문자를 대체한다. 문제가 발생하는 코드를 다른 코드로 대체 실행하기 위해 사용한다. ‘기능’을 대체하는 것이 아닌 ‘코드’를 대체함. 예를 들어 ‘없는 내부 모듈’을 사용하는 코드를 찾아 ‘있는 외부 모듈’을 사용할 수 있는 코드로 바꿔준다.

`rollup-plugin-node-builtins`와 `rollup-plugin-node-globals` 모듈을 하나로 줄여 `globals/builtins`라고 부른다고 했을 때, `globals/builtins` 는 NodeJS에서 공식적으로 지원하는 모듈이 아니기 때문에, NodeJS가 최신 버전으로 업데이트 될 때마다 `globals/builtins`에 기능을 따로 개발해서 넣어줘야 한다. 이 부분 에서 시간, 기술 등의 여러가지 이유로 `globals/builtins`가 모든 NodeJS 기능을 제공하지 못하는 문제가 발생하는데, 이 때 `rollup-plugin-replace` 같은 추가 모듈을 통해 프로젝트에 `globals/builtins` 가 지원하지 못하는 기능을 따로 제공해줘야 한다. 이 중 대표적인 것이 `crypto-random-string` 모듈 내부의 `crypto.randomBytes` 메소드이다.

먼저 `globals/builtins`를 설치해준다.

```json
"rollup-plugin-node-builtins": "^2.1.2",
"rollup-plugin-node-globals": "^1.4.0",
"rollup-plugin-replace": "^2.2.0",
```

```bash
> npm i
```

devDependencies 에 위 3가지 모듈을 추가 후 패키지 설치를 진행해준다.

`./rollup.config.js`

```jsx
// ..
import globals from "rollup-plugin-node-globals"
import builtins from "rollup-plugin-node-builtins"
import replace from "rollup-plugin-replace"

// ..
export default {
  // ..
  plugins: [
    // ..

    replace({
      values: {
        "crypto.randomBytes": 'require("randombytes")',
      },
    }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    globals(),
    builtins(),

    // ..
  ],
}
```

위와 같이 설정 후 다시 개발서버를 실행시켜보면 기존에 발생하던 에러가 더이상 나오지 않는 것을 확인할 수 있다. 또한 add 함수가 실행되어 실제 로컬 스토리지에 데이터가 정상적으로 추가된 것을 확인할 수 있다.

![](../img/221002-1.png)

테스트 lists를 모두 삭제 한 뒤 CreateList에 테스트용으로 넣어 둔 add 함수를 제거 후 페이지를 새로 고침하면 초기 lists 데이터가 존재하지 않으므로 `store/list.js` 에서 만든 repoLists의 기본값이 빈 배열이 들어가 있는 것을 확인할 수 있다.

`./store/list.js`

```jsx
const repoLists = JSON.parse(window.localStorage.getItem("lists")) || []
```

![](../img/221002-2.png)

### List 생성을 위한 수정 모드(Edit mode)

이번는 구현한 store를 이용해 추가된 list 내용을 추가해주도록 만들어본다.

`./src/components/CreateList.svelte`

```html
<script>
  import { tick } from "svelte"
  import { lists } from "~/store/list"
  let isEditMode = false
  let title = ""
  let textareaEl

  function addList() {
    // 값 존재 시 동작
    if (title.trim()) {
      lists.add({
        title,
      })
    }
    offEditMode()
  }

  async function onEditMode() {
    isEditMode = true
    await tick() // 데이터 갱신을 기다려준다.
    textareaEl && textareaEl.focus()
  }

  function offEditMode() {
    isEditMode = false
    title = ""
  }
</script>

<div class="create-list">
  {#if isEditMode}
  <div class="edit-mode">
    <textarea bind:value={title} bind:this={textareaEl} placeholder="Enter a title for this list..." on:keydown={(e) =>
    { e.key === "Enter" && addList() e.key === "Escape" && offEditMode() e.key === "Esc" && offEditMode() // IE, edge
    지원 코드 }} />
    <div class="actions">
      <div class="btn" on:click="{addList}">Add List</div>
      <div class="btn" on:click="{offEditMode}">Cancel</div>
    </div>
  </div>
  {:else}
  <div class="add-another-list" on:click="{onEditMode}">+ Add another list</div>
  {/if}
</div>
```

위와 같이 editMode 변수에 따라 적절한 컴포넌트가 들어가도록 해준 뒤 각 버튼의 성격에 맞게 addList, onEditMode, offEditMode 함수들을 구현해주었다.

또한 ListContainer에 테스트를 위해 넣어두었던 렌더링 영역도 아래와 같이 수정해준다.

`./src/components/ListContainer.svelte`

```html
<script>
  import { lists } from "~/store/list"
  import List from "~/components/List.svelte"
  import CreateList from "~/components/CreateList.svelte"
</script>

<div class="list-container">
  <div class="lists">
    {#each $lists as list (list.id)}
    <List />
    {/each}
  </div>
  <CreateList />
</div>
```

lists의 subscribe 메서드를 통해 가져온 lists 데이터를 each 문으로 반복시켜 List 컨테이너를 맞물려주면 원하는 데이터가 정상적으로 노출되는 것을 확인할 수 있다!

![](../img/221003-1.gif)

### 전역 스타일(main.scss) 생성 및 구성

editMode 상태에 대한 스타일을 추가해본다.

`./src/scss/main.scss`

```scss
.actions {
  display: flex;
  padding-bottom: 10px;
  .btn {
    margin-right: 4px;
  }
}
.btn {
  // SCSS에서 반복적으로 사용되는 값을 다룰 때는,
  // 변수로 만들어서 사용하면 편리함
  $btn-color--default: #e2e6ea;
  $btn-color--success: #61bd4f;
  $btn-color--danger: #eb5a46;
  $text-color--default: #212529;
  $text-color--colorful: #fff;

  display: inline-block;
  padding: 6px 12px;
  background-color: $btn-color--default;
  color: $text-color--default;
  border-radius: 4px;
  line-height: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  &:hover {
    // SCSS에서 제공하는 darken 함수는,
    // 인수로 Color, Amount를 순서대로 작성해,
    // (10%) 더 어두운 색을 만들 수 있다.
    background-color: darken($btn-color--default, 10%);
  }
  &.success {
    background-color: $btn-color--success;
    color: $text-color--colorful;
    &:hover {
      background-color: darken($btn-color--success, 10%);
    }
  }
  &.danger {
    background-color: $btn-color--danger;
    color: $text-color--colorful;
    &:hover {
      background-color: darken($btn-color--danger, 10%);
    }
    // 모든 위험한(danger) 버튼의 글자 뒤에는 !(느낌표)를 붙인다.
    &::after {
      content: "!";
    }
  }
  &.small {
    font-size: 12px;
    padding: 0 6px;
  }
}
.edit-mode {
  textarea {
    resize: none;
    outline: none;
    border: none;
    background: #fff;
    margin-bottom: 8px;
    padding: 6px 8px;
    border-radius: 4px;
    box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
    line-height: 20px;
    width: 100%;
    height: 66px;
    box-sizing: border-box;
    display: block;
  }
}
```

위처럼 scss를 사용하면 변수를 사용하는 것이 가능하고, scss에서 제공하는 API 들을 사용해 스타일을 더욱 손쉽게 구현할 수 있다. 위 스타일은 어디에서나 사용할 수 있는 범용 스타일이므로 아래와 같이 적용해줄 수 있다.

`./src/components/CreateList.svelte`

```html
<style lang="scss">
  @import "../scss/main.scss";
  /* ... */
</style>
```

위와 같이 import 해주면 각 페이지에서 처리될 scss 파일을 넣어줄 수 있다.
하지만 서비스의 규모가 커진다고 했을 때 위 방법은 매우 귀찮은 방법이 될 수 있으므로 아래와 같이 적용해줄 수 있다.

`./rollup.config.js`

```jsx
export default {
  // ...
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        scss: {
          // prepend로 main.scss를 앞에 붙여준다.
          // 동작하는 svelte 파일에 lang="scss"일 때만 동작함
          prependData: '@import "./src/scss/main.scss";',
        },
        postcss: {
          plugins: [require("autoprefixer")()],
        },
      }),
    }),
    // ..
  ],
  watch: {
    clearScreen: false,
  },
}
```

위와 같이 sveltePreprocess 메서드에 scss.prependData 옵션을 추가해주면 된다.
단, 동작하는 svelte 파일에 style 태그의 lang 옵션이 scss일 때만 해당 옵션이 적용된다는 것을 잊지말자!

dev 화면을 새로고침하면 스타일이 잘 적용된 것을 확인할 수 있다 🙂

![](../img/221004-1.png)
