## 슬롯

### 단일 슬롯과 Fallback content

이번에는 스벨트의 슬롯이란 개념에 대해 알아보고자 한다.

`Btn.svelte`

```html
<button>Default Button!</button>

<style>
  button {
    background: lightgray;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s;
  }
  button:hover {
    text-decoration: underline;
  }
  button:active {
    transform: scale(1.05);
  }
  button.block {
    width: 100%;
    display: block;
  }
</style>
```

`App.svelte`

```html
<script>
  import Btn from "./Btn.svelte";
</script>

<Btn />
```

위와 같은 컴포넌트 구조가 있다고 하자. button에 대한 기본적인 hover, active, .block 스타일에 대해 정의되어 있고 `App` 컴포넌트에서는 `Btn` 컴포넌트를 호출하여 사용한다.

만약 버튼의 내부 텍스트(버튼명)을 동적으로 주입하기 위해선 어떻게 해야할까?
버튼 컴포넌트을 좀 더 유용하게 사용하기 위해 우린 슬롯이란 개념을 사용할 수 있다.

`App.svelte`

```html
<Btn /> <Btn>Submit!</Btn>
```

위와 같이 첫번째 버튼은 `Default Button!`이라는 텍스트가 노출되고, 두번째 버튼은 `Submit!`이라는 텍스트가 노출되도록 구현하고 싶다면, 이는 아래와 같이 slot 태그를 적으면 간단히 구현할 수 있다.

`Btn.svelte`

```html
<button><slot>Default Button!</slot></button>
```

위와 같이 `slot` 태그를 적용해주면 Btn 컴포넌트 내부에 child 텍스트가 없을 경우 `Default Button!`가 노출되고, 텍스트가 존재할 경우 해당 텍스트로 버튼을 생성할 수 있게된다. (react의 children같은 개념인 듯)

그럼 다른 종류의 버튼들도 만들어보자

`App.svelte`

```html
<Btn block>Submit!</Btn>
<Btn color="royalblue">Submit!</Btn>
<Btn block color="red">Danger!</Btn>
```

위와 같이 `block` 변수와 `color` 데이터를 Btn 컴포넌트의 `props`로 부여한다고 했을 때 Btn 컴포넌트는 이를 아래와 같이 적용할 수 있다.

`Btn.svelte`

```html
<script>
  export let block;
  export let color;
</script>

<!--
<button class={block ? "block" : ""}>
			<slot>Default Button!</slot>
</button>
-->
<button class:block style="background-color: {color}; color: {color ? 'white' : ''};">
  <slot>Default Button!</slot>
</button>
```

위 `class={block ? "block" : ""}` 란 코드는 `class:block` 로 줄여서 작성할 수 있고, 나머지 color 변수는 조건문을 넣어 처리하면 된다.
