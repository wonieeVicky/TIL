## Flex UI 만들기

### flexible 메뉴 만들기

![](../../img/220509-1.gif)

마우스 hover 시 위와 같은 애니메이션이 동작하도록 구현해보려고 한다.
이를 flex가 아닌 요소로 만든다면 우리는 float 요소를 사용해서 만들었을 것이다.
이를 flex로 구현하면 훨씬 더 매끄러운 ui를 구현할 수 있다.

```html
<ul class="menu">
  <li class="menu-item">
    <a href="#" class="menu-link">Home</a>
  </li>
  <li class="menu-item">
    <a href="#" class="menu-link">About</a>
  </li>
  <li class="menu-item">
    <a href="#" class="menu-link">Product</a>
  </li>
  <li class="menu-item">
    <a href="#" class="menu-link">Contact</a>
  </li>
</ul>
```

```css
/* menu */
.menu {
  display: flex;
}
.menu-item {
  background: gold;
  transition: 0.5s;
  width: 25%;
  /* flex-grow: 1; */
}
.menu-item:hover {
  background: crimson;
  width: 35%;
  /* flex-grow: 1.5; */
}
.menu-link {
  display: block;
  padding: 1em;
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  text-decoration: none;
  text-align: center;
}
.menu-link:hover {
  color: white;
}
```

위와 같은 애니메이션으로 위와 같은 후버 이벤트를 매끄럽게 구현할 수 있다.
`flex-grow`를 사용하여 가로 길이를 조정해줘도 되지만 IE에서는 flex-grow가 지원되지 않으므로 width로 처리했다!

### 유연한 검색창 만들기

이번에는 검색창도 만들어본다.
새로 만들 검색창은 아래와 같이 가로 크기에 따라 input의 가로 넓이가 stretch되는 특징을 가진다.

![](../../img/220510-1.gif)

```html
<form class="search-form">
  <input type="search" />
  <input type="submit" value="찾기" />
</form>
```

```css
/* search */
.search-form {
  margin-top: 50px;
  display: flex;
  height: 40px; /* align-items: stretch 라서 내부 요소들이 중앙 정렬된다. */
}
.search-form input[type="search"] {
  border: 0;
  border-radius: 0.3em;
  font-size: 1rem;
  margin-right: 10px;
  flex: 1;
}
.search-form input[type="submit"] {
  border: 0;
  border-radius: 0.3em;
  font-size: 1rem;
  background-color: gold;
  width: 4em;
}
```

부모 속성이 display: flex 속성인 items 들은 높이값에 따라 내부 요소가 stretch 되는 특징이 있다는 것을 새로 배웠다. 위 속성을 사용하면 padding으로 위아래 간격을 조절하던 것을 쉽게 개선할 수 있을 것 같다.
