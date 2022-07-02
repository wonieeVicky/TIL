## 요소 바인딩

### 일반 요소 바인딩(this)

이번에는 Svelte의 일반 this 요소 바인딩에 대해 이해해보자
아래의 코드는 Edit 버튼을 클릭했을 때, input 요소에 자동으로 focus 처리 동작을 하도록 만들어진 코드이다.

`App.svelte`

```html
<script>
  let isShow = false;

  function toggle() {
    isShow = !isShow;
    const inputEl = document.querySelector("input");
    inputEl && inputEl.focus();
  }
</script>

<button on:click="{toggle}">Edit!</button>
{#if isShow}
<input />
{/if}
```

하지만 해당 코드는 자동으로 focus 처리가 되지 않는다. (아래 이미지 보면 마우스로 클릭해서 focus 처리함)

![](../img/220702-1.gif)

왜 focus가 되지 않을까? 이것은 데이터가 갱신되었을 때 바로 화면이 바뀌지 않기 때문이다.
데이터가 갱신되고 다음 로직이 처리되기 전에 화면이 갱신되도록 기다려야지만 화면이 바뀐다.

```jsx
import { tick } from "svelte";
let isShow = false;

async function toggle() {
  isShow = !isShow;
  await tick();
  const inputEl = document.querySelector("input");
  inputEl && inputEl.focus();
}
```

따라서 tick을 적용하면 아래와 같이 자동으로 focus 처리가 수행되는 것을 확인할 수 있다.

![](../img/220702-2.gif)

이는 이미 배워서 아는 사실이다. 이 밖에 스벨트에서는 `const inputEl = document.querySelector("input");` 와 같이 직접 돔을 검색하는 방법 이외에도 일반요소에 바인딩 할 수 있도록 하는 this를 제공한다.

```html
<script>
  import { tick } from "svelte";
  let isShow = false;
  let inputEl;

  async function toggle() {
    isShow = !isShow;
    await tick();
    inputEl && inputEl.focus();
  }
</script>

<button on:click="{toggle}">Edit!</button>
{#if isShow}
<input bind:this="{inputEl}" />
{/if}
```

위와 같이 `input`에 `bind` 요소로 `this`를 주입해주면 별도의 요소를 검색하지 않고 `input` 요소를 참조하도록 만들어줄 수 있다. 이는 전체 돔을 검색하는 성능을 줄일 수 있도록 해주므로 직접 요소를 바인딩 하는 방법으로 성능을 최적화해주는 것이 바람직하다.
