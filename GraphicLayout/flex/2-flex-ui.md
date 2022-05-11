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

### 불릿 리스트

![](../../img/220511-1.gif)

이번에는 불릿이 있는 리스트를 만들어본다.
flex를 통해 앞에 불릿이 있고, 줄넘김이 되었을 떄 두번째 줄도 예쁘게 정렬된 효과를 낼 수 있다.

```html
<ul class="info-list">
  <li class="info-list-item">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil fugit numquam aspernatur excepturi, eos soluta
    praesentium maiores commodi minus accusantium?
  </li>
  <li class="info-list-item">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam corporis reiciendis sunt fugiat nobis.
  </li>
  <li class="info-list-item">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam consequatur alias, ducimus ea magnam nostrum
    repudiandae repellendus deleniti veniam? Assumenda expedita ad eum nihil!
  </li>
</ul>
```

```css
/* bullet */
.info-list-item {
  display: flex;
  margin: 0.5em 0;
}
.info-list-item::before {
  content: "";
  margin-right: 0.5em;
}
```

이번에는 bullet을 별도의 엘리먼트로 추가하는 것이 아닌 `li.info-list-item`의 `::before` 요소로 추가해준다.
해당 영역을 뒀을 때 before와 기존 텍스트 사이를 flex 처리해주려면 `li.info-list-item`에 `display: flex;` 요소를 넣어주면 된다.

### 메시지 리스트

![](../../img/220511-2.gif)

이번에는 사람 사진이나 프로필이 포함된 메시지 리스트를 구현해본다.
이미지는 image 태그로 쓰지 않고, figure 태그를 통해 구현해본다.(background-image로 호출)

```html
<ul class="user-list message-list">
  <li class="user-item message-item">
    <figure class="user-photo" style="background-image: url(images/ilbuni.png)"></figure>
    <p class="message-content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nobis, nisi numquam harum voluptates vel corrupti
      dolorem id, dicta eveniet similique architecto et, exercitationem quaerat alias ratione. Dicta, beatae,
      aspernatur, sit commodi quis illo non aut repellendus veritatis at ab.
    </p>
  </li>
  <li class="user-item message-item">
    <figure class="user-photo" style="background-image: url(images/ilbuni.png)"></figure>
    <p class="message-content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nobis, nisi numquam harum voluptates vel corrupti
      dolorem id, dicta eveniet similique architecto et, exercitationem quaerat alias ratione.
    </p>
  </li>
  <li class="user-item message-item">
    <figure class="user-photo" style="background-image: url(images/ilbuni.png)"></figure>
    <p class="message-content">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nobis, nisi numquam harum voluptates vel corrupti
      dolorem id.
    </p>
  </li>
</ul>
```

```css
/* user list - messge list */
.user-item {
  display: flex;
  margin-bottom: 1.5em; /* rem은 html의 font-size를 기준으로 함 */
}
.user-photo {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border: 2px solid #333;
  border-radius: 50%;
  background-color: gold;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 150%;
  margin-right: 0.5em;
}
```

위 스타일에서 `.user-item`의 `margin-bottom`을 `em`으로 설정한 이유는 해당 태그의 `font-size`를 기준으로 상속받기 위해서임. 만약 `rem`을 쓰면 해당 태그의 `font-size`가 50px이어도 영향을 받지 않는다.
