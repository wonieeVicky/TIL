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
  let color = 'tomato'
  let white = 'white'
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

### 클래스 바인딩 패턴 정리(class 지시어)

클래스 바인딩을 하는 여러가지 패턴에 대해 알아본다. class 지시어와 연결 데이터를 어떻게 사용하느냐에 따라 다양한 방법이 사용된다.

`App.svelte`

```html
<script>
  let active = true
  let test = true
  let valid = false
  let camelCase = true

  function multi() {
    return 'active multiple-class'
  }
</script>

<div class={active ? 'active' : ''}>3항 연산자 보간</div>

<div class:active={test}>Class 지시어(Directive) 바인딩</div>

<!-- <div class:active={active}>Class 지시어 바인딩 단축 형태</div> -->
<div class:active>Class 지시어 바인딩 단축 형태</div>

<!-- camelCase dashCase, snackCase 등은 아래처럼 각각 처리할 수 있다.-->
<!-- valid는 false이므로 추가되지 않음 -->
<div class:active class:valid class:camelCase class:camel-case={camelCase}>다중(Mutiple) Class 지시어 바인딩</div>

<!-- <div class="active multiple-class">함수 실행</div> 로 도출된다. -->
<div class={multi()}>함수 실행</div>
```

- Class 지시어 바인딩 시 바인딩하는 값과 지시어가 같을 경우 생략할 수 있다.
  `<div class:active={active}>` → `<div class:active>`
- camelCase, dashCase, snackCase등 다양한 클래스 형태를 다중 class 지시어로 바인딩할 수 있다.
- 함수를 넣어 클래스 값을 넣는 것도 가능.
