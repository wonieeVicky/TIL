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

### 반복 블록의 key 사용

이번 시간에는 반복 블럭에서 key라는 개념을 사용해 반복되는 아이템에 고유키를 부여하는 것을 구현해본다.

`App.svelte`

```html
<script>
  let fruits = ["Apple", "Banana", "Cherry", "Orange"];

  function deleteFirst() {
    fruits = fruits.slice(1); // ["Banana", "Cherry", "Orange"]
  }
</script>

<button on:click="{deleteFirst}">Delete first fruit!</button>

<ul>
  {#each fruits as fruit}
  <li>{fruit}</li>
  {/each}
</ul>
```

위처럼 delete firtst fruit 버튼을 클릭하면 첫번째 아이템을 삭제하는 로직을 가진 코드가 있다고 하자.
위 코드에서 삭제버튼을 클릭하면 ul 내부의 li의 태그 전체가 새로 그려지는 것을 확인할 수 있다.

![](../img/220710-1.gif)

fruits의 갱신에 따른 새로운 배열이 할당되므로 새로운 배열을 화면에 재렌더링하기 때문이다. 하지만 이는 비효율적이다. 이러한 개념을 효율적으로 개선하기 위해 key 개념을 li 태그에 도입한다.

```html
<!-- codes... -->
<ul>
  {#each fruits as fruit (fruit)}
  <li>{fruit}</li>
  {/each}
</ul>
```

위처럼 li태그에 fruit 라는 키를 부여하면 고유성이 부여되므로 li 태그를 감싸는 ul 태그만 리렌더링이 발생하고, 그 내부의 변하지 않는 li 태그에는 리렌더링이 발생하지 않는다. 이는 어떤 프레임워크에도 제공되는 기능으로, 습관적으로 반복 블록을 만들 때 중복되지 않는 키 값을 넣어주는 습관을 들이는 것이 좋다.

![](../img/220710-2.gif)

```jsx
let fruits = ["Apple", "Banana", "Cherry", "Orange", "Banana"];
```

그렇다면, 위처럼 fruits 배열값에 중복이 있다면 li 의 key 에 고유한 값이 들어가지지 않는다. (fruit라는 string을 그대로 키 값으로 넣어줬기 때문) 이럴 땐 어떻게 해줘야할까? 고유값을 가진 id 값들을 넣어줘야 한다.

```html
<script>
  // let fruits = ["Apple", "Banana", "Cherry", "Orange"];
  let fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
    { id: 4, name: "Banana" },
  ];
</script>

<ul>
  {#each fruits as fruit (fruit.id)}
  <li>{fruit.name}</li>
  {/each}
</ul>
```

위처럼 fruits의 배열이 각자 고유의 값을 가진 id 값을 별도로 가지도록 구성하여 그려주면, 같은 값이 name으로 들어가도 중복되지 않는 Li 태그를 구성할 수 있게되며, 필요한 Ul 태그만 리렌더링되는 것을 확인할 수 있다.

![](../img/220710-3.gif)

### 반복 블록 패턴 정리

반복 블록을 사용해서 아이템을 출력하는 패턴에 대해 정리해보자.

```jsx
let fruits = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Apple" },
  { id: 5, name: "Orange" },
];
```

fruits 배열에 대한 반복 블록 기본 패턴을 구현해보고자 한다.

```html
<section>
  <h2>기본</h2>
  <!-- {#each 배열 as 속성} {/each} -->
  {#each fruits as fruit}
  <div>{fruit.name}</div>
  {/each}
</section>

<section>
  <h2>순서(index)</h2>
  <!-- {#each 배열 as 속성, 순서} {/each} -->
  {#each fruits as fruit, index}
  <div>{index} / {fruit.name}</div>
  {/each}
</section>

<section>
  <h2>아이템 고유화(key)</h2>
  <!-- {#each 배열 as 속성, 순서 (키)} {/each} -->
  <!-- 실무에서는 소괄호를 열어 키를 제공하는 것이 필수사항임  -->
  {#each fruits as fruit, index (fruit.id)}
  <div>{index} / {fruit.name}</div>
  {/each}
</section>
```

위처럼 각 배열을 그대로 반복문으로 만들거나 상황에 따라 순서나 고유 key 값을 넣어 리스트를 구현할 수 있다. 보통 실무에서는 세번째 방법을 사용해 고유 키를 제공하는 것이 거의 필수적으로 채택하는 방법이므로 참고하자. (고유 키를 부여하면 다른 li 변경에 따른 불필요한 재실행을 막을 수 있다.)

또한 구조분해도 스벨트에서 아래와 같이 사용할 수 있다.

```html
<section>
  <h2>구조 분해(destructuring)</h2>
  <!-- {#each 배열 as {id, name}} {/each} -->
  {#each fruits as { id, name } (id)}
  <div>{name}</div>
  {/each}
</section>
```

위 내용을 나머지 연산자를 적용하여 동일하게 구현할 수도 있다.

```html
<section>
  <h2>나머지 연산자(rest)</h2>
  <!-- {#each 배열 as {id, ...rest}} {/each} -->
  {#each fruits as { id, ...rest } (id)}
  <div>{rest.name}</div>
  {/each}
</section>
```

이 밖에 조건에 따른 UI 변경을 아래와 같이 할 수 있다.

```jsx
let todos = [];
```

```html
<section>
  <h2>빈 배열 처리(else)</h2>
  <!-- {#each} {:else} {/each} -->
  {#each todos as todo (todo.id)}
  <div>{todo.name}</div>
  {:else}
  <div>아이템이 없어요!</div>
  {/each}
</section>
```

위와 같은 상태일 경우 빈배열이므로 아이템이 없다는 문구가 노출된다.
이러한 상황을 위해서는 todos의 값이 undefined, null 등이면 안되고 반드시 빈배열이어야 한다.

2차원 배열 구조는 아래와 같이 상세 배열을 펼쳐서 처리할 수 있다.

```html
<script>
  let fruits2D = [
    [1, "Apple"],
    [2, "Banana"],
    [3, "Cherry"],
    [4, "Orange"],
  ];
</script>

<section>
  <h2>2차원 배열</h2>
  <!-- {#each 배열 as [id, name]} {/each} -->
  {#each fruits2D as [id, name] (id)}
  <div>{name}</div>
  {/each}
</section>
```

마지막으로 객체 데이터에 대한 활용에 대해 알아보자.

```jsx
let user = {
  name: "Vicky",
  age: 33,
  email: "hwfongfing@gmail.com",
};
```

위 user 객체가 있을 때 이 값을 배열값으로 변환하는 Object.entries로 아래와 같이 반복 블록을 구현할 수 있다.

```html
<section>
  <h2>객체 데이터</h2>
  {#each Object.entries(user) as [key, value] (key)}
  <div>{key}: {value}</div>
  {/each}
</section>
```

위 패턴들은 자바스크립트의 배열, 객체를 활용하여 구현하는 패턴이므로 스벨트만의 패턴이라고 보기는 어렵다. 다양한 활용방법에 대해 익히고 이를 실무에 적용해본다고 생각해보자 !

### 키 블록

이번 시간에는 svelte의 키 블록에 대해 알아본다.

`src/Count.svelte`

```html
<script>
  let count = 0;
  setInterval(() => (count += 1), 1000);
</script>

<h1>{count}</h1>
```

`src/App.svelte`

```html
<script>
  import Count from "./Count.svelte";
  let reset = false;
</script>

<Count />
<button on:click={() => (reset = !reset)}>Reset!</button>
```

위와 같이 1초에 1씩 count가 증가하는 count가 동작하는 코드가 있다.
위 코드에서 reset 버튼을 눌렀을 때 count가 0으로 reset되는 것을 구현하려면 어떻게 하면 좋을까?

우리의 일반적인 구현방법으로는 Count라는 컴포넌트에 reset 데이터를 props으로 부여하여 조건에 따라 동작이 바뀌도록 하는 것이다.
하지만 이 방법 말고 스벨트에서는 키 블록을 사용해 구현하는 방법을 제공한다.

`src/App.svelte`

```html
{#key reset}
  <Count />
{/key}

<button on:click={() => (reset = !reset)}>Reset!</button>
```

위 코드에서 키(Key) 블록의 역할은 연결된 데이터의 값이 변경될 때마다 내용을 파괴하고 다시 생성한다.
위처럼 구현하면 간단히 reset 상태에 따라 해당 기능을 재시작할 수 있게됨 (성능면에서 컴포넌트를 파괴하고 재생성하는 과정이 효율적일까? 🤔)
