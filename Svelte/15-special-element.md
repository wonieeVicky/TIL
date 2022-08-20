## 특별한 요소

### 컴포넌트 재귀 호출(self)

이번 시간에는 svelte의 특별한 요소인 self에 대해 알아본다.
아래 예제를 보자

`App.svelte`

```html
<script>
  import Address from "./Address.svelte";

  let address = {
    label: "대한민국",
    children: [
      { label: "경기도", children: [{ label: "수원" }, { label: "성남" }] },
      { label: "강원도", children: [{ label: "속초" }, { label: "강릉" }] },
    ],
  };
</script>

<address {address} />
```

`Address.svelte`

```html
<script>
  export let address;
</script>

<ul>
  <li>
    {address.label} {#if address.children} {#each address.children as address}
    <svelte:self {address} />
    {/each} {/if}
  </li>
</ul>
```

App 컴포넌트에서 address 변수의 주소 객체가 담겨있고 이를 Address 컴포넌트로 데이터를 내려주고 있다.
Address 컴포넌트는 전달받은 address 데이터로 데이터를 렌더링 하는데, 이를 svelte의 `self` 요소를 사용하는 컴포넌트에 렌더링 한다.

![](../img/220819-1.png)

이 self 요소는 재귀(resursion) 호출을 의미하는데, 재귀는 자기 내부에서 자기 자신을 호출하는 것을 의미함. 즉 `svelte:self`란 Address 컴포넌트를 재귀적으로 자기 자신을 호출한다는 의미이다. 재귀 호출은 반드시 종료 조건이 있어야 하며, `address.children`이 있을 때에만 재귀 호출이 일어나도록 처리한다는 로직이 제한 조건임을 알 수 있다.

### 동적 컴포넌트 렌더링(component)

`App.svelte`

```html
<script>
  import Jinny from "./Jinny.svelte";
  import Wonny from "./Wonny.svelte";

  let components = [{ name: "Jinny" }, { name: "Wonny" }];
  let selected;
</script>

{#each components as { name } (name)}
<label>
  <input type="radio" value="{name}" bind:group="{selected}" />
  {name}
</label>
{/each} {#if selected === "Jinny"}
<Jinny />
{:else if selected === "Wonny"}
<Wonny />
{/if}
```

`Jinny.svelte`

```html
<h2>Jinny!</h2>
```

`Wonny.svelte`

```html
<h2>Wonny?</h2>
```

App 컴포넌트는 `components` 라는 데이터를 바탕으로 각 radio 인풋 데이터를 노출하도록 구성되어있다.
선택된 결과에 따라 Jinny 혹은 Wonny 컴포넌트를 렌더링하도록 되어있는 구조인데, 만약 해당 데이터가 늘어난다면 위와 같이 같은 반복적인 컴포넌트를 모두 만들고, 이를 if 분기문에서 모두 체크하도록 구현하는 방법이 최선일까?

아님. 스벨트의 요소(태그)를 만들면 쉽게 동적 렌더링 구현이 가능하다.

`App.svelte`

```html
<script>
  import Jinny from "./Jinny.svelte";
  import Wonny from "./Wonny.svelte";

  let components = [
    { name: "Jinny", comp: Jinny },
    { name: "Wonny", comp: Wonny },
  ];
  let selected;
</script>

{#each components as { name, comp } (name)}
<label>
  <input type="radio" value="{comp}" bind:group="{selected}" />
  {name}
</label>
{/each}

<svelte:component this="{selected}" />
<div>{selected}</div>

<!-- {#if selected === "Jinny"}
  <Jinny />
{:else if selected === "Wonny"}
  <Wonny /> 
{/if} -->
```

위처럼 `components` 객체 데이터에 해당하는 컴포넌트를 값으로 넣고, `each` 문에서 input value를 해당하는 컴포넌트로 처리하면, 하단 `svelte:component` 에서 적용된 컴포넌트가 동적으로 렌더링되며, 하단 selected 값에는 컴포넌트 객체 값이 그대로 노출된다. 이때 해당 요소에는 렌더링 될 this 객체가 전달되어야 하는데, 이 객체를 전달할 때에는 기존에 사용하던 `bind:this` 가 아닌 `this` 값 자체에 객체를 넘겨줘야한다

![](../img/220820-1.gif)

위처럼 화면에 출력하고자 하는 여러 컴포넌트를 가져온 다음에 상황에 맞게 혹은 사용자의 선택에 맞게 해당하는 컴포넌트를 동적으로 출력할 때 해당 기능을 활용할 수 있다. 또한, 해당 `svelte:component`는 `props` 데이터를 그대로 사용할 수 있어야 한다. 테스트를 위해 index라는 props 데이터를 만들어 적용해줘보자

`App.svelte`

```html
<script>
  // ..
  let index = 1;
</script>

<!-- codes.. -->
<svelte:component this="{selected}" {index} />
```

`Jinny.svelte`

```html
<script>
  export let index;
</script>

<h2>{index}. Jinny!</h2>
```

`Wonny.svelte`

```html
<script>
  export let index;
</script>

<h2>{index}. Wonny!</h2>
```

위처럼 추가한 뒤 다시 radio input을 클릭해보면 해당 Props가 잘 전달되어 노출되는 것을 확인할 수 있다.

![](../img/220820-2.gif)

그럼 조금 더 발전시켜서 이 index가 components의 등록된 순서대로 노출되도록 하고 싶다면
아래와 같이 할 수 있다.

`App.svelte`

```html
<script>
  // ..
  let selected = components[0].comp; // selected 값에 초기값으로 components의 첫번째 컴포넌트 대입
</script>

// each 문 내에 index 변수로 i를 사용 {#each components as { name, comp }, i (name)}
<label> <input type="radio" value={comp} bind:group={selected} on:change={() => (index = i + 1)} /> {name} </label>
{/each}

<svelte:component this="{selected}" {index} />
```

selected 값에 components의 첫번째 요소를 초기값으로 할당하고, each 문에서 on:change 이벤트로 index 값을 더해주는 방법이다. 위와 같이 하면 components에 값이 담긴 순서대로 index가 하나씩 증가하여 노출되도록 해줄 수 있다.

![](../img/220820-3.gif)

### window

스벨트에는 svelte window 요소가 존재한다. 아래 예시를 보자

`App.svelte`

```html
<script>
  let key = "";

  window.addEventListener("keydown", (event) => {
    key = event.key;
  });
</script>

<h1>{key}</h1>
```

위 코드는 keydown 이벤트 발생 시 누른 글자를 그대로 화면에 보여준다.

![](../img/220820-4.gif)

위 코드는 svelte의 window 요소를 사용해 아래와 같이 작성할 수 있다.

`App.svelte`

```html
<script>
  let key = "";
</script>

<svelte:window on:keydown={(e) => (key = e.key)} />
<h1>{key}</h1>
```

위와 동일한 기능을 수행한다. 스벨트에서 제공하는 window 요소를 통해 window 객체를 직접사용하지 않아도 이벤트를 연결할 수 있도록 하는 것이다. 이 밖에도 다른 기능이 많다.

`App.svelte`

```html
<script>
  let key = "";
  // readable property
  let innerWidth; // viewport 크기
  let innerHeight;
  let outerWidth; // browser 크기
  let outerHeight;
  let online; // 현재 상태가 online 상태인지 여부
  // writable property
  let scrollX;
  let scrollY;

  // window.addEventListener("keydown", (event) => {
  //   key = event.key;
  // });
</script>

<svelte:window on:keydown={(e) => (key = e.key)} bind:innerWidth bind:innerHeight bind:outerWidth bind:outerHeight
bind:online bind:scrollX bind:scrollY />
<h1>{key}</h1>
<div>innerWidth: {innerWidth}</div>
<div>innerHeight: {innerHeight}</div>
<div>outerWidth: {outerWidth}</div>
<div>outerHeight: {outerHeight}</div>
<div>online: {online}</div>
<input type="number" bind:value="{scrollX}" />
<input type="number" bind:value="{scrollY}" />
<div class="for-scroll" />

<style>
  .for-scroll {
    height: 2000px;
  }
</style>
```

![](../img/220820-5.gif)
