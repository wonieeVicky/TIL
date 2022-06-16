## 라이프사이클

### Svelte Lifecycle

컴포넌트가 연결되고 해제되는 등의 컴포넌트 생명주기를 말한다. 아래와 같이 5가지로 분류되어 있음
각 Lifecycle을 Lifecycle Hook이라고 부른다. onMount Hook, beforeUpdate Hook

![](../img/220613-1.png)

![](../img/220613-2.png)

- onMount : 연결되었다.
- onDestroy : 연결이 해제되었다.
  ![](../img/220613-3.png)
  - 완벽하게 떨어지기 전에, 분리되기 전에, 연결이 실제 해제되기 직전에 실행
- beforeUpdate : 화면이 바뀌기 전
- afterUpdate : 화면이 바뀐 후
- Tick (별도)

### onMount, onDestroy

라이프사이클의 가장 기본적은 onMount와 onDestroy API에 대해 알아보자. 이번 시간부터는 vscode의 svelte 프로젝트에서 직접 만들어본다.

`App.svelte`

```html
<script>
  import Something from "./Something.svelte";
  let toggle = false;
</script>

<button on:click={() => (toggle = !toggle)}>Toggle</button>

{#if toggle}
  <Something />
{/if}
```

`Something.svelte`

```html
<script>
  // 하단 코드
</script>

<h1>Something...</h1>
```

```jsx
import { onMount, onDestroy } from "svelte";

const h1 = document.querySelector("h1");
console.log(h1.innerText); // null, 컴포넌트가 화면에 렌더링 되지 않은 상태에서 찾았기 때문

// 화면에 컴포넌트 렌더링 후 실행로직을 담는 라이프사이클
onMount(() => {
  console.log("Mounted!");

  const h1 = document.querySelector("h1");
  console.log(h1.innerText); // Something...

  // onDestroy는 onMount 내부 return 함수로도 구현 가능
  // 단, 내부 return 구조는 비동기가 없는 상황에서만 사용할 수 있다.
  return () => {
    console.log("Destroy in mount");
  };
});

// 화면에 컴포넌트 연결이 해제되기 직전에 실행되는 라이프사이클
onDestroy(() => {
  console.log("Before Destroy");

  const h1 = document.querySelector("h1");
  console.log(h1.innerText); // Something... 연결이 해제되기 직전에 실행되므로 값이 담긴다.
```

- `onMount`는 화면에 컴포넌트가 렌더링된 후 실행로직을 담는 라이프사이클이다.
  해당 컴포넌트 외부에서 엘리먼트를 찾으면 null로 반환됨을 주의하며, 해당 API 내부 return 함수로도 onDestroy를 구현할 수 있다.
  단, 비동기 처리를 하는 함수의 경우 Promise 객체를 반환하여 return 함수가 정상적으로 실행되지 않을 수 있으므로 비동기 제외 함수만 입력해야한다.
- `onDestroy`는 화면에 컴포넌트 연결이 해제되기 직전에 실행되는 라이프사이클이다.
  onMount의 내부에서 실행되던 return 함수를 외부로 뺀 형태라고 보면되며, 가독성 면에서 유리한 구조이다.

### beforeUpdate, afterUpdate

beforeUpdate와 afterUpdate API도 있다. 이는 onMount가 실행되기 전, 후에 동작한다.

`Something.svelte`

```jsx
// 1
beforeUpdate(() => {
  console.log("beforeUpdate");
});

// 2
onMount(() => {
  console.log("Mounted!");
});

// 3
afterUpdate(() => {
  console.log("afterUpdate");
});

// beforeUpdate
// Mounted!
// afterUpdate
```

Something 컴포넌트 동작을 발생시키는 toggle 버튼을 눌렀을 때 위와 같이 beforeUdpate, Mounted!, afterUpdate가 순차적으로 실행되는 것을 확인할 수 있다.

만약 반응성 데이터가 추가되면 어떻게 될지 살펴보자.

`Something.svelte`

```jsx
let name = "Something...";

function moreDot() {
  name += ".";
}

beforeUpdate(() => {
  console.log("beforeUpdate");
});

onMount(() => {
  console.log("Mounted!");
});

afterUpdate(() => {
  console.log("afterUpdate");
});

// beforeUpdate
// afterUpdate
```

```html
<h1 on:click="{moreDot}">{name}</h1>
```

위처럼 `moreDot` 이벤트를 `h1`의 클릭이벤트로 연결해주면 `h1`을 클릭할 때마다
`beforeUpdate`와 `afterUpdate`가 실행되는 것을 확인할 수 있다.

```jsx
let h1;

beforeUpdate(() => {
  console.log("before Update");
  console.log(h1?.innerText); // 데이터 갱신 전
});

onMount(() => {
  console.log("Mounted!");
  h1 = document.querySelector("h1");
});

afterUpdate(() => {
  console.log("after Update");
  console.log(h1?.innerText); // 데이터 갱신 후
});
```

위와 같이 h1 데이터를 콘솔로 찍어보면 어떻게 될까?

```
before Update
undefined
Mounted!
after Update
Something...

before Update
Something...
after Update
Something....

before Update
Something....
after Update
Something.....
```

위와 같이 변경 전 데이터 값이 `beforeUpdate`에 담기고, 변경 후 데이터 값은 `afterUpate`에 담김

만약 `name += ".";` 와 같은 반응성을 가지는 데이터가 beforeUpdate, afterUpdate 함수 내부에 들어가게 되면
무한루프에 빠질 수 있음. 반드시 넣어야 할 경우 조건문으로 무한 실행을 막는 코드를 넣어줘야 한다.
