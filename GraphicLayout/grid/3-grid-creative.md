## Grid로 창의적인 레이아웃 구현하기

### 카테고리 정렬하기

이번에는 CSS 그리드를 활용해 아래의 여러 카테고리가 뒤섞인 카드리스트를 자바스크립트를 쓰지 않고 같은 카테고리의 카드끼리 정렬해보고자 한다.

```html
<article class="grid-container">
  <input type="radio" name="sort-control" value="default" id="radio-sort-default" />
  <label class="sort-label" for="radio-sort-default">Default</label>
  <input type="radio" name="sort-control" value="category" id="radio-sort-category" />
  <label class="sort-label" for="radio-sort-category">Category</label>

  <header class="page-header">
    <h1 class="site-title">CSS Grid Layout!</h1>
  </header>

  <section class="cate-sect cate-music">
    <header class="cate-sect-header">
      <div class="cate-name">Music</div>
      <h2 class="cate-sect-title">Lorem, ipsum.</h2>
    </header>
    <p class="cate-sect-cont">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quaerat quisquam magni aperiam minima quam, dicta
      sequi. Vel, consectetur totam.
    </p>
  </section>

  <section class="cate-sect cate-food">
    <header class="cate-sect-header">
      <div class="cate-name">Food</div>
      <h2 class="cate-sect-title">Lorem, ipsum.</h2>
    </header>
    <p class="cate-sect-cont">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quaerat quisquam magni aperiam minima quam, dicta
      sequi. Vel, consectetur totam.
    </p>
  </section>

  <section class="cate-sect cate-game">
    <header class="cate-sect-header">
      <div class="cate-name">Game</div>
      <h2 class="cate-sect-title">Lorem, ipsum.</h2>
    </header>
    <p class="cate-sect-cont">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quaerat quisquam magni aperiam minima quam, dicta
      sequi. Vel, consectetur totam.
    </p>
  </section>

  <section class="cate-sect cate-tech">
    <header class="cate-sect-header">
      <div class="cate-name">Tech</div>
      <h2 class="cate-sect-title">Lorem, ipsum.</h2>
    </header>
    <p class="cate-sect-cont">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quaerat quisquam magni aperiam minima quam, dicta
      sequi. Vel, consectetur totam.
    </p>
  </section>

  <!-- sections.. -->
</article>
```

위와 같은 돔이 있다고 했을 떄 기본 스타일은 아래와 같다.

```css
html {
  font-size: 87.5%; /* 14px */
  font-family: Roboto, "Noto Sans KR", sans-serif;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility !important;
}
body {
  background: lightgray;
}
img {
  max-width: 100%;
  height: auto;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  grid-column: 1/5;
}
.page-footer {
  grid-column: 1/5;
  padding: 1rem 0 3rem;
  font-size: 0.8rem;
}
.site-title {
  font-size: 10rem;
  font-family: "Roboto Condensed";
}
.cate-sect {
  background: white;
}
.cate-name {
  padding: 1rem;
  font-weight: bold;
  color: white;
}
.cate-music .cate-name {
  background: crimson;
}
.cate-game .cate-name {
  background: limegreen;
}
.cate-food .cate-name {
  background: salmon;
}
.cate-tech .cate-name {
  background: steelblue;
}
.cate-sect-cont {
  padding: 1rem;
}
.cate-sect-title {
  padding: 1rem;
}
input[name="sort-control"] {
  position: absolute;
  left: -1000rem;
}
.sort-label {
  padding: 1rem;
  cursor: pointer;
}
:checked + .sort-label {
  color: white;
  background: black;
}
```

핵심은 category input이 checked 된 상태일 떄, 정렬되도록 보여주는 것이다.
아래 처리한 스타일 소스를 보자

```css
/* category가 체크되었을 때 cate-music을 grid-row 3/4행으로 */
#radio-sort-category:checked ~ .cate-music {
  grid-row: 3/4;
}
/* category가 체크되었을 때 cate-food을 grid-row 4/5행으로 */
#radio-sort-category:checked ~ .cate-food {
  grid-row: 4/5;
}
/* category가 체크되었을 때 cate-game을 grid-row 5/6행으로 */
#radio-sort-category:checked ~ .cate-game {
  grid-row: 5/6;
}
/* category가 체크되었을 때 cate-tech을 grid-row 6/7행으로 */
#radio-sort-category:checked ~ .cate-tech {
  grid-row: 6/7;
}
```

위와 같이 `grid-row`로 checked 시 특정 클래스의 요소에 스타일을 부여함으로써 원하는 레이아웃으로 배치할 수 있다. 위와 같은 레이아웃은 여러 랜덤 아이템을 정렬 기능으로 보여주고자 할 때 유용하게 쓰일 수 있음 🙂

![](../../img/220529-2.gif)
