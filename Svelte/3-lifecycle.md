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

### 라이프사이클 모듈화

이번 시간에는 라이프사이클의 모듈화에 대해 알아본다. 라이프사이클을 모듈로 만들어 여러 곳에서 쓸 수 있도록 구현하는 과정을 의미한다. 이전까지는 라이프사이클 사용 시 직접 컴포넌트에 onMount, onDestroy API를 호출하여 작업했지만 라이프 사이클을 별도의 파일로 빼서 사용해볼 수 있다.

`lifecycle.js`

```jsx
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";

export function lifecycle() {
  onMount(() => {
    console.log("onMount");
  });

  onDestroy(() => {
    console.log("onDestroy");
  });

  beforeUpdate(() => {
    console.log("beforeUpdate");
  });

  afterUpdate(() => {
    console.log("afterUpdate");
  });
}
```

`App.svelte`

```html
<script>
  import { lifecycle } from "./lifecycle";
  lifecycle();
</script>

<h1>Hello Lifecycle!</h1>
```

위와 같이 lifecycle 모듈을 호출해와서 실행시켜주면 기존 컴포넌트 내 동작과 동일하게 콘솔이 찍히는 것을 확인할 수 있다. 하지만, 위 구현은 그닥 유용해보이지 않는다. 그래서 무엇을 더 활용해볼 수 있을지 공부해보자.

`lifecycle.js`

```jsx
export function delayRender(delay = 3000) {
  // ms
  let render = false;

  onMount(() => {
    setTimeout(() => {
      render = true;
    }, delay);
  });

  return render;
}
```

위와 같이 delay 초 뒤 변경되는 render 값에 따라 `App.Svelte`의 돔이 아래와 같이 그려지는 분기문이 추가되었다고 가정해보자

`App.svelte`

```html
<script>
  import { lifecycle, delayRender } from "./lifecycle";
  let done = delayRender();
</script>

{#if done}
<h1>Hello Lifecycle!</h1>
{/if}
```

예측했던대로 해당 h1 태그는 보이지 않는다. 왜냐면 done이라는 객체 값, 즉 render 변수에 반응성이 없기 때문. 일반 변수가 반응성을 가지려면 컴포넌트 안에서 선언되어야 한다. 이는 즉, 2초 뒤 바뀌는 render 값에 대한 반응성이 없으므로 화면은 그려지지지 않는다고 이해할 수 있다.

따라서 render 변수를 store 객체로 변경하는 과정을 통해 반응성을 부여할 수 있다.

`lifecycle.js`

```jsx
import { writable } from "svelte/store";

export function delayRender(delay = 3000) {
  let render = writable(false); // 쓰기 가능한 형태의 스토어 객체 생성

  onMount(() => {
    setTimeout(() => {
      // $render = true; // $render는 .svelte 확장자를 가진 컴포넌트 내부에서만 사용할 수 있으므로 사용 불가
      // console.log(render); // set, update, subscribe
      render.set(true);
    }, delay);
  });

  return render;
}
```

딘. onMount 내부에서 직접 $render를 상용할 수 없다. .svelte 확장자가 아닌 일반 Js 파일이기 때문! 따라서 writable에서 제공되는 set API를 활용해 반응성을 부여해준다.

`App.svelte`

```html
<script>
  import { lifecycle, delayRender } from "./lifecycle";
  let done = delayRender();
</script>

{#if $done}
<h1>Hello Lifecycle!</h1>
{/if}

<!-- beforeUpdate  -->
<!-- onMount  -->
<!-- afterUpdate  -->
<!-- 화면 렌더링 후 -->
<!-- beforeUpdate  -->
<!-- afterUpdate  -->
```

위처럼 실행시켜준 뒤 스토어객체에 $를 붙여 분기조건을 만들면 정상적으로 동작함.
별도의 자식 컴포넌트를 생성해도 정상적으로 동작하는지 확인해보자.

`Something.svelte`

```html
<script>
  import { delayRender } from "./lifecycle";
  let done = delayRender(2000);
</script>

{#if $done}
<h1>Something...</h1>
{/if}
```

`App.svelte`

```html
<script>
  import { lifecycle, delayRender } from "./lifecycle";
  import Something from "./Something.svelte";
  lifecycle();
  let done = delayRender();
</script>

<Something />
{#if $done}
<h1>Hello Lifecycle!</h1>
{/if}
```

위처럼 실행하면 Something 문구는 1초 뒤에 Hello Lifecycle은 3초 뒤에 잘 동작함.
여기저기서 사용할 수 있는 간단한 라이프사이클 모듈이 만들어졌다 🙂

### tick

이번에는 tick 이란 라이프사이클에 대해 알아본다.
tick은 데이터가 갱신되고 나서 화면이 바뀌는 반응성을 가질 때까지 잠시 기다리도록 해주는 기능을 가진다.
아래의 코드가 있다고 하자

`App.svelte`

```html
<script>
  let name = "world";

  function handler() {
    name = "Vicky";
    const h1 = document.querySelector("h1");
    console.log(h1.innerText); // Hello world 출력 - handler 함수가 종료되어야 화면이 갱신된다.
  }
</script>

<h1 on:click="{handler}">Hello {name}!</h1>
```

위 소스를 실행시켜 h1을 클릭하면 `handler` 함수에 의해 `Hello world!` → `Hello Vicky!`로 잘 변경되는 것을 확인할 수 있다.
하지만 위 `handler` 함수의 콘솔은 Hello Vicky 가 아닌 Hello world가 찍힌다. 왜일까?
바로 스벨트는 `handler` 함수가 종료되는 시점에 화면이 갱신되기 때문이다.
즉, `h1.innerText`를 읽는 시점에서는 화면이 갱신되기 이전이므로 Hello world가 출력된다.

이를 제어하기 위해 tick 라이프사이클이 존재한다.

```jsx
import { tick } from "svelte";
let name = "world";

async function handler() {
  name = "Vicky";
  // tick은 어떤 데이터가 화면에 갱신될 떄까지 기다린 뒤 실행하는 역할을 한다.
  await tick(); // Promise 객체를 반환함
  const h1 = document.querySelector("h1");
  console.log(h1.innerText); // Hello Vicky!
}
```

위처럼 tick 함수를 통해 반응성을 기다려주면, 콘솔에 Hello Vicky가 정상적으로 출력된다.
tick 함수는 `Promise`를 반환하므로 `async ~ await` 함수 형태로 사용해야 함을 참고하자!

기존에 배웠던 onMount, onDestroy, beforeUpdate, afterUpdate 는 언제 실행되는지 정해진 라이프사이클이지만 tick은 실행 위치를 직접 정할 수 있으므로 자유로운 라이프사이클 함수인 것이 특징이다.
