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
