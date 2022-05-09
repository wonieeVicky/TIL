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
