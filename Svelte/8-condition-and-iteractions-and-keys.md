## 조건과 반복과 키

### 조건 블록 패턴 정리

조건블럭의 여러 패턴에 대해 이해해보자

`App.svelte`

아래는 coun일부 달

```html
<script>
  let count = 0;
</script>

<button on:click={() => (count += 1)}>증가!</button>
<button on:click={() => (count -= 1)}>감소!</button>

<h2>{count}</h2>
```

위 count의 변화는 아래와 같이 여러가지로 확인할 수 있다.

```html
<section>
  <h2>if</h2>
  {#if count > 3}
  <div>count &gt; 3</div>
  {/if}
</section>

<section>
  <h2>if else</h2>
  {#if count > 3}
  <div>count &gt; 3</div>
  {:else}
  <div>count &lt;= 3</div>
  {/if}
</section>
```

기문은 위와 같이 처리할 수 있다.

if, else if, else 구문은 아래와 같이 적는다.

```html
<section>
  <h2>if else if</h2>
  {#if count > 3}
  <div>count &gt; 3</div>
  {:else if count === 3}
  <div>count === 3</div>
  {:else}
  <div>count &lt;= 3</div>
  {/if}
</section>
```

다중 블럭은 어떻게 만들 수 있을까?

```html
<section>
  <h2>다중 블록</h2>
  {#if count > 3} {#if count === 5} count === 5 {:else} count &gt; 3 {/if} {/if}
</section>
```

위와 같은 문법으로 조건블럭 내부에 조건블럭을 추가할 수 있다.

일부 프레임워크에서는 위와 같은 다중블록 사용해 화면을 렌더링하는 것을 추천하고 있지 않다. 왜냐하면 가상돔을 이용하는데 최적화에 방해가 되기 때문이다. 하지만 스벨트의 경우 가상돔을 사용하지 않고 컴파일해서 결과를 도출하기 때문에 최적화에 방해되는 요소가 아니므로 편리하게 사용하면 된다.
