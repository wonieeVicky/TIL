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
