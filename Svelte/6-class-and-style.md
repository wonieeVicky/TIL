## 클래스와 스타일

### 클래스와 스타일 속성 바인딩

Svelte의 기본적인 클래스 속성 바인딩에 대해 알아보자!

```html
<script>
  let active = false;
</script>

<button on:click={() => (active = !active)}>Toggle!</button>
<div class={active ? "active" : ""}>Hello</div>

<style>
  div {
    width: 120px;
    height: 200px;
    background-color: royalblue;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
    transition: 0.4s;
  }
  .active {
    width: 250px;
    background-color: tomato;
  }
</style>
```

위와 같이 active 변수값에 따라 클래스 속성을 간단히 바인딩 해줄 수 있다.

![](../img/220627-1.gif)

위 속성은 아래와 같이 적을 수 있다.

```html
<div class:active="{active}">Hello</div>
<div class:hello="{active}">Hello</div>
```

위 데이터는 active라는 데이터에 의해 active 혹은 hello 클래스를 붙인다는 의미이다.

보간법을 사용해 아래와 같이 스타일 속성을 줄 수 도 있다.

```html
<script>
  let color = "tomato";
  let white = "white";
</script>

<h2 style="background-color: {color}; color: {white};">Vicky!</h2>
```

위와 같이 하면 배경색은 tomato, 글자색은 white인 레이아웃이 노출된다. 위 코드는 아래와 같이 쓸 수도 있다.

```html
<script>
    let color = {
      t: "tomato",
      w: "#fff",
    };
  `let letterSpacing = "letter-spacing: 5px;";
</script>

<h2 style="background-color: {color.t}; color: {color.w}; {letterSpacing}">Vicky!</h2>
```

객체 데이터를 바인딩 해줄 수도 있고, 속성 값 전체를 보간법으로 직접 넣을 수도 있음 :)
