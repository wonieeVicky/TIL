﻿## 컴포넌트

### 컴포넌트 바인딩 및 개요

이번에는 컴포넌트의 기본적인 개념을 몇가지 살펴보고자 한다. 아래와 같은 구조가 있다고 하자.

`Vicky.svelte`

```html
<script>
  export let title = "Hello!";

  let name = "Vicky";
  let age = 33;
  let email = "hwfongfing@gmail.com";
</script>

<h2>{title}</h2>
<div>{name}</div>
<div>{age}</div>
<div>{email}</div>
```

`App.svelte`

```html
<script>
  import Vicky from "./Vicky.svelte";
</script>

<Vicky title="Good!" />
```

위와 같은 코드가 있다고 할 때 Vicky 컴포넌트에서 정상적으로 Good!이라는 데이터를 보여준다.
우리는 이 점을 주목해보아야 한다.

위 `App.svelte`에서 `Vicky` 컴포넌트의 props 로 내려주고 있는 title 속성은 HTML에서 모든 태그(in Body)에 사용 가능한 전역 속성(Global Attribute) 이다.

vue.js의 경우 하나의 컴포넌트 내 최상위 요소를 1개만 가질 수 있는데(즉, 컴포넌트 = 최상위 요소) 이러한 특성에 따라 컴포넌트에 사용하는 Props를 title과 같이 HTML에 존재하는 속성(Attribute) 이름으로 작성하는 경우,
props와 HTML 속성이 중복되는 문제가 발생한다. 따라서 2개 이상의 단어를 조합해 사용하는(E.g. my-title) 커스텀 속성 사용이 권장된다.

```html
<Vicky my-title="Good!" />
```

반면에 Svelte의 경우 하나의 컴포넌트 내 최상위 요소가 여러 개이기 때문에 이는 즉, 컴포넌트 !-== 최상위요소 이므로 props가 HTML 속성의 이름과 중복되는 문제가 발생하지 않는다. 따라서 제약없이 props의 이름으로 HTML에 존재하는 속성(위 코드에서는 title)을 사용할 수 있다.

이 밖에 이러한 이슈도 있다.

```html
<script>
  import { onMount } from "svelte";

  import Vicky from "./Vicky.svelte";
  let vicky;

  onMount(() => {
    console.log(vicky); // Vicky{$$: {}, $$set: f, $capture_stste: f, ...}
    console.log(vicky.title); // Error: Props cannot be read directly ... -> 스벨트는 컴포넌트 내 데이터에 접근하는 것을 기본적으로 막는다.(accessors를 사용하면 접근가능)
  });
</script>

<Vicky title="Good!" bind:this="{vicky}" />
```

위처럼 Vicky 컴포넌트에 vicky란 데이터를 양방향 데이터 바인딩을 해준 뒤 onMount 이벤트로 콘솔로그를 찍어보면 우리가 사용할 수 없는 컴포넌트 객체가 로그에 담기는 것을 확인할 수 있다. 또한 `vicky.title`로 데이터에 접근하는 것이 불가한 것을 확인할 수 있다.

Svelte는 기본적으로 컴포넌트에 데이터에 직접 접근하는 것을 막는다. 하지만 `<svelte:options>`의 접속허용 속성인 `accessors`를 사용하면, 컴포넌트 내 일부 데이터에 접근할 수 있다. (나중에 더 알아본다.)

### 부모에서 자식으로(Props)

이번에는 Svelte에서 props를 이용해 데이터를 전달하는 패턴에 대해 몇가지 배워보고자 한다.

`src/User.svelte`

```html
<script>
  export let name;
  export let age;
  export let email = "None...";
</script>

<ul>
  <li>{name}</li>
  <li>{age}</li>
  <li>{email}</li>
</ul>
```

`src/App.svelte`

```html
<script>
  import User from "./User.svelte";

  let users = [
    { name: "Vicky", age: 33, email: "hwfongfing@gmail.com" },
    { name: "Wonny", age: 32, email: "fongfing@gmail.com" },
    { name: "Evan", age: 31 },
  ];
</script>

<section>
  {#each users as user}
  <User name="{user.name}" age="{user.age}" email="{user.email}" />
  {/each}
</section>
```

users 데이터를 바탕으로 User 컴포넌트를 노출시킨다고 하자. 기본적인 props 전달은 위와 같이 할 수 있다.
데이터는 구조 분해를 통해 아래와 같이 간단히 사용할수도 있다.

```html
<section>
  {#each users as { name, age, email }}
  <User {name} {age} {email} />
  {/each}
</section>
```

가장 간단하게는 아래와 같이 작업해도 된다.
단일 user 객체가 전개연산자로 넣게되면, 각 name, age, email이 각각 Props로 전달된다.

```html
<section>
  {#each users as user}
  <User {...user} />
  {/each}
</section>
```

### Props 양방향 바인딩

props의 양방향 바인딩에 대해서도 알아보자.

`./Todo.svelte`

```html
<script>
  export let todo;
  function deleteTodo() {
    //
  }
</script>

<div>
  <input type="checkbox" bind:value="{todo.done}" />
  {todo.title}
  <button on:click="{deleteTodo}">X</button>
</div>
```

`./App.svelte`

```html
<script>
  import Todo from "./Todo.svelte";

  let todos = [
    { id: 1, title: "Breakfast", done: false },
    { id: 2, title: "Lunch", done: false },
    { id: 3, title: "Dinner", done: false },
  ];
</script>

{#each todos as todo (todo.id)}
<Todo {todo} />
{/each}
```

위와 같이 Todo 자식 컴포넌트와 이를 호출한 App 컴포넌트가 있다.
todo가 done이 되면 checkbox가 true가 되도록 처리된다. 위 Todo.svelte 컴포넌트 에서 deleteTodo 함수는 해당 데이터를 삭제해주는 기능을 하는데, 우리가 앞서 배웠던 스토어 객체를 사용하면 아래와 같이 사용할 수 있을 것이다.

```jsx
function deleteTodo() {
  todos.splice(index, 1);
  todos = todos;
}
```

하지만 위 방법보다 더 간단하게 구현할 수 있는 방법이 있다.

`App.svelte`

```html
{#each todos as todo, index (todo.id)}
<Todo {todos} {todo} {index} />
{/each}
```

`Todo.svelte`

```jsx
export let todos;
export let todo;
export let index;

function deleteTodo() {
  todos.splice(index, 1);
  todos = todos;
  console.log(todos);
}
```

이렇게 App 컴포넌트에서 Todo 컴포넌트에 인자값으로 todos와 index 값을 추가하여 상속해주면 된다!
그러면 해당 배열 데이터가 잘 삭제되는 것을 console.log로 확인할 수 있다!

하지만 문제가 있다. 화면이 갱신되지않는다!
App 컴포넌트가 Todo 컴포넌트의 변경사항에 대해 반응성을 가지지 못하기 때문이다!
따라서 양방향 데이터 바인딩을 해줘야 한다.

`App.svelte`

```html
{#each todos as todo, index (todo.id)}
<Todo bind:todos {todo} {index} />
{/each}
```

위와 같이 bind 메서드를 사용해 todos를 양방향 데이터 바인딩 해주면 데이터가 잘 갱신되는 것을 확인할 수 있다. 이 구조는 간단한 구조에서는 꽤 편하고 간단한 방법으로 보인다. 하지만 컴포넌트의 복잡도가 높을수록 어디에서 수정되는 지를 파악하기 어려울 수 있다. 따라서 구조에 따라 스토어를 도입하여 데이터를 변경처리해주는 것이 바람직할 수 있다.

### 자식에서 부모로(Event Dispatcher)

앞서 부모에서 자식 컴포넌트로 속성(props) 전달하는 방법에 대해 알아보았다면, 자식에서 부모로 데이터를 전달하는 방법에 대해 알아보고자 한다.

`Todo.svelte`

```html
<script>
  export let todo;

  function deleteTodo() {
    //
  }
</script>

<div>
  <input type="checkbox" bind:value="{todo.done}" />
  {todo.title}
  <button on:click="{deleteTodo}">X</button>
</div>
```

`App.svelte`

```html
<script>
  import Todo from "./Todo.svelte";

  let todos = [
    { id: 1, title: "Breakfast", done: false },
    { id: 2, title: "Lunch", done: false },
    { id: 3, title: "Dinner", done: false },
  ];
</script>

{#each todos as todo (todo.id)}
<Todo {todo} />
{/each}
```

지난 시간에서 살펴본 Todo 컴포넌트와 App 컴포넌트 구조이다.
위 구조는 App 컴포넌트에서 Todo 컴포넌트에 todos 데이터를 부여하여 Todo 컴포넌트에서 값을 수정하도록 구성되었었다.

이번에는 좀 다른 방법으로 App.svelte에서 todos를 수정하도록 처리해보고자 한다.
즉 Todo 컴포넌트의 deleteTodo 함수를 실행시키면 지워달라는 명령만 부모 컴포넌트로 올려주는 로직을 만든다.

`Todo.svelte`

```jsx
import { createEventDispatcher } from "svelte";
export let todo;

// createEventDispatcher는 new CustomEvent()를 통해 커스텀 이벤트를 생성.
// 따라서 event.detail을 사용한다.
const dispatch = createEventDispatcher();

function deleteTodo() {
  // custom dispatch 함수 생성, 첫번째 인수: 커스텀 이벤트명, 두번째 인수: 전달인자
  dispatch("deleteMe", { todoId: todo.id });
}
```

위와 같이 Todo 컴포넌트에서 App 컴포넌트로 삭제되었음을 알리기 위해 svelte에서 제공하는 `createEventDispatcher`를 사용해보고자 한다.
위 함수는 자바스크립트 메서드인 `new CustomEvent()` 를 통해 커스텀 이벤트를 생성하는 것으로 상세 데이터는 `event.detail`에 전달되도록 설계되어 있다.

위처럼 `dispatch` 변수에 `createEventDispatcher`를 생성한 뒤 `(커스텀 이벤트 명, 전달인자)`를 매개변수로 하여 `delelteTodo` 함수를 완성시킨 다음 App 컴포넌트에 아래와 같이 연결시켜 준다.

`App.svelte`

```html
<script>
  import Todo from "./Todo.svelte";

  let todos = [
    { id: 1, title: "Breakfast", done: false },
    { id: 2, title: "Lunch", done: false },
    { id: 3, title: "Dinner", done: false },
  ];

  function deleteTodo(event) {
    const { todoId } = event.detail;
    const index = todos.findIndex((t) => t.id === todoId);
    todos.splice(index, 1);
    todos = todos;
  }
</script>

{#each todos as todo (todo.id)}
<Todo {todo} on:deleteMe="{deleteTodo}" />
{/each}
```

`App` 컴포넌트에 `Todo` 컴포넌트에서 정의한 커스텀 이벤트를 `on:deleteMe`로 연결해주면 App 컴포넌트에서 deleteTodo 이벤트를 실행할 수 있게 된다. (`Todo` 컴포넌트에서 알림 → `App` 컴포넌트에서 실행)
위 `dispatch` 함수에 두번째 인자로 객체 데이터를 전달하였으므로 `event.detail`에서 데이터를 받아서 쓸 수 있고, 이로써 todos 데이터를 삭제할 수 있게 되었다.

위 구조는 스벨트에서 자주 사용되는 로직이므로 자식 컴포넌트에서 부모 컴포넌트로 이벤트 전파하는 방법에 대해 잘 익혀둘 필요가 있다.

### 기본/커스텀 이벤트 포워딩(Forwarding)

이번에는 스벨트에서 이벤트 포워딩(Forwarding) 개념에 대해 알아보고자 한다. 아래 구조를 보자

`Parent.svelte`

```html
<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<h2>Parent</h2>
<button on:click={(event) => dispatch("click", { event })}>Parent Click!</button>
```

`App.svelte`

```html
<script>
  import Parent from "./Parent.svelte";

  function handler(event) {
    const e = event.detail.event;
    console.log(e.currentTarget); // <button>Parent Click!</button>
  }
</script>

<Parent on:click="{handler}" />
```

Parent 컴포넌트에서 button 엘리먼트를 클릭했을 때, `createEventDispatcher` 이벤트로 App 컴포넌트에 클릭 이벤트를 전달하는 것을 확인할 수 있다. Parent에서는 dispatch의 두 번째인자로 event 객체를 전달해주었는데, 이로써 App 컴포넌트에서 `event` 객체를 사용할 수 있게 된다.

위의 구조가 꽤나 복잡하게 느껴지는데, 이를 아래와 같이 간단히 구현할 수도 있다.

`Parent.svelte`

```html
<!-- script 코드 모두 삭제 -->
<h2>Parent</h2>
<button on:click>Parent Click!</button>
```

`App.svelte`

```html
<script>
  import Parent from "./Parent.svelte";

  function handler(e) {
    console.log(e.currentTarget); // <button>Parent Click!</button>
  }
</script>

<Parent on:click="{handler}" />
```

위와 같이 간단히 변경해도 위 dispatch 로 구현한 함수와 똑같이 동작한다. 매우 심플!
그렇다면 커스텀이벤트 포워딩도 동일할까?

`Child.svelte`

```html
<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<h2>Child</h2>
<button
  on:click={() => {
    dispatch("myEvent", { myName: "Vicky" });
  }}>
Child Click!
</button>
```

위와 같이 Child 컴포넌트에 `createEventDispatcher`로 구현한 `myEvent` 커스텀 이벤트가 있다고 할 때, Child 컴포넌트가 위 Parent 컴포넌트 하위의 자식 컴포넌트라고 가정해보자.

`Parent.svelte`

```html
<script>
  import Child from "./Child.svelte";
</script>

<h2>Parent</h2>
<button on:click>Parent Click!</button>
<Child on:myEvent />
```

`myEvent` 커스텀 이벤트를 App 컴포넌트에서 구현하고자 할 경우 Parent 컴포넌트에서는 별도의 이벤트 메서드를 구현하지 않고 `on:myEvent`만 작성해주면 이를 App컴포넌트로 그대로 포워딩할 수 있게된다.

`App.svelte`

```html
<script>
  import Parent from "./Parent.svelte";

  function handler(e) {
    // ..
  }

  function myEventHandler(e) {
    console.log(e.detail.myName);
  }
</script>

<Parent on:click="{handler}" on:myEvent="{myEventHandler}" />
```

위 코드처럼 Parent 컴포넌트에서 포워딩한 `on:myEvent`를 App컴포넌트에서 위처럼 구현할 수 있게 되었다.

만약 위와 같은 구조가 아닌 여러 개의 중첩 구조를 이용한다고 했을 때, 중간에 있는 모든 컴포넌트가 이벤트 포워딩 처리를 해줘야하므로 불필요한 코드가 늘어날 수 있다. 이때는 store를 통해서 구현하면 더 효율적이다.

### ContextApi(getContext, setContext)

이번에는 스벨트의 contextAPI인 getContext, setContext에 대해 알아본다.
아래 코드를 보자

`App.svelte`

```html
<script>
  // Getter & Setter
  // getContext & setContext
  import Vicky from "./Vicky.svelte";
  import Lewis from "./Lewis.svelte";
  import Evan from "./Evan.svelte";
</script>

<h1>App()</h1>
<div>
  <Vicky />
  <Lewis />
  <Evan />
</div>

<style>
  h1 {
    font-size: 50px;
  }
  div {
    padding-left: 50px;
  }
</style>
```

`Vicky.svelte`

```html
<script>
  import Anderson from "./Andorson.svelte";
</script>
****

<h1 style="color:red">Vicky</h1>
<ul>
  <li><Anderson /></li>
</ul>
```

`Anderson.svelte`

```html
<script>
  import Neo from "./Neo.svelte";
  import Emily from "./Emily.svelte";
</script>

<h2>Anderson</h2>
<ul>
  <li><Neo /></li>
  <li><Emily /></li>
</ul>
```

`Lewis.svelte`, `Evan.svelte`, `Neo.svelte`, `Emily.svelte`

```html
<!-- Lewis, Evan, Neo, Emily() 각각 들어감 -->
<h1>Lewis()</h1>
```

위와 같이 부모 자식 관계를 갖는 컴포넌트들이 있다. 위 컴포넌트의 관계는 아래의 구조를 가진다.

![](../img/220803-1.png)

만약 `Vicky` 컴포넌트에서 특정 변수값을 자식 컴포넌트인 `Neo`에게 내려줘야할 때, 우리는 `Anderson` 컴포넌트에 속성을 내려줌으로써 데이터 상속으로 구현한다. 이는 매우 비효율적이다.

`Vicky.svelte`

```html
<script>
  import { setContext } from "svelte";

  import Anderson from "./Anderson.svelte";
  const pocketMoney = 10000;
  setContext("pm", pocketMoney);
</script>

<h1 style="color:red">Vicky()</h1>
<ul>
  <li><Anderson /></li>
</ul>
```

setContext는 첫 번째 인수로 context 명과 뒤에 실제 담길 값을 넣어주면 된다.

`Neo.svelte`

```html
<script>
  import { getContext } from "svelte";
  const pm = getContext("pm");
</script>

<h1>Neo({pm})</h1>
```

이를 우리는 `getContext`, `setContext`를 이용해 Anderson 컴포넌트를 거치지 않고 데이터를 공유하도록 위와 같이 구현할 수 있다.

![Neo 컴포넌트에 pocketMoney가 잘 들어간다.](../img/220803-2.png)

`Emily.svelte` , `Anderson.svelte`

```html
<script>
  import { getContext } from "svelte";
  const pm = getContext("pm");
</script>

<h1>Emily({pm})</h1>
```

동일하게 Emily, Anderson 컴포넌트에도 변경할 수 있다.
이는 Context 데이터를 생성한 Vicky 컴포넌트에도 동일하게 적용할 수 잇다.

`Vicky.svelte`

```html
<script>
  import { getContext, setContext } from "svelte";

  import Anderson from "./Anderson.svelte";
  const pocketMoney = 10000;
  setContext("pm", pocketMoney);

  const pm = getContext("pm");
</script>

<h1 style="color:red">Vicky({pm})</h1>
<ul>
  <li><Anderson /></li>
</ul>
```

![](../img/220803-3.png)

위와 같이 `getContext`, `setContext` 메서드는 자기자신 및 자식 컴포넌트 간에 데이터 공유가 가능하도록 해준다.

그럼 형제 컴포넌트와 부모 컴포넌트와의 데이터 공유도 가능할까? 아니다.

`Lewis.svelte`

```html
<script>
  import { getContext } from "svelte";
  const pm = getContext("pm");
</script>

<h1>Lewis({pm})</h1>
```

Lewis와 Evan 컴포넌트에서는 undefined이 반환된다.

`App.svelte`

```html
<script>
  // getContext & setContext
  import { getContext } from "svelte";
  import Vicky from "./Vicky.svelte";
  import Lewis from "./Lewis.svelte";
  import Evan from "./Evan.svelte";

  const pm = getContext("pm");
</script>

<h1>App({pm})</h1>
<!-- codes... -->
```

![](../img/220803-4.png)

즉 ContextAPI는 생성한 자기자신과 그 하위 컴포넌트 간의 데이터를 공유받는 개념임을 알 수 있다.

### 모듈 상황(Module context)에서 데이터 정의

이번에는 스벨트의 모듈 컨텍스트에서 데이터를 정의하는 방법에 대해 알아보고자 한다.

`Fruit.svelte`

```html
<script>
  export let fruit;
  let count = 0;
</script>

<div
  on:click={() => {
    count += 1;
    console.log(count);
  }}
>
  {fruit}
</div>
```

`App.svelte`

```html
<script>
  import Fruit from "./Fruit.svelte";
  let fruits = ["Apple", "Banana", "Cherry", "Mango", "Orange"];
</script>

<button on:click={() => {}}>Total count log!</button>

{#each fruits as fruit}
  <Fruit {fruit} />
{/each}
```

위와 같은 컴포넌트 구조가 있다고 하자. Fruit 컴포넌트는 fruit라는 변수를 상속받아 데이터를 노출한다. 또한 해당 텍스트를 클릭하면 count 변수가 증가하고 해당 값이 콘솔에 찍히도록 작성되어져 있다.

해당 구조로 텍스트를 클릭해보면 각 개별 텍스트마다 count가 1부터 증가하는 것을 볼 수 있다.

![](../img/220804-1.gif)

Cherry를 클릭 후 다시 Apple을 클릭한다면 콘솔에는 3이 찍히게 될 것이다. 각 컴포넌트별로 각 count 데이터를 가지고 있기 때문. 이 상황에서 만약 전체 클릭 수에 대해서 알고싶다면 어떻게 해야할까?

각 Fruit 컴포넌트 별로 클릭한 count 변수 값을 알고 있어야 한다. 이때 모듈별로 데이터를 정의하는 방법을 활용하면 된다. 이는 아래와 같이 작성할 수 있다.

`Fruit.svelte`

```html
<script context="module">
  let count = 0;
</script>

<script>
  export let fruit;
</script>

<div
  on:click={() => {
    count += 1;
    console.log(count);
  }}
>
  {fruit}
</div>
```

위와 같이 script에 module 컨텍스트를 부여해준 영역에 count 변수를 정의한 뒤 다시 클릭해본다.

![](../img/220804-2.gif)

위 이미지를 보면 count 변수가 모든 컴포넌트를 아우르는 전역화 된 데이터로 사용되고 있음을 확인할 수 있다.
즉 `<script context="module">` 의 개념은 각각의 Fruit 렌더링 시 초기화되는 부분은 `<script></script>`영역이다. 위 `<script context="module">` 부분은 App.svelte에서 컴포넌트를 가져와 사용하려고 하는 최초 시점 한번만 동작하는 데이터가 된다. (즉, 컴포넌트가 import되는 시점에 정의 및 선언된다)

이는 아래와 같이 디버그 콘솔을 추가하면 쉽게 확인할 수 있다.

`Fruit.svelte`

```html
<script context="module">
  let count = 0;
  console.log("Module context!");
</script>

<script>
  export let fruit;
  console.log("Each component init!");
</script>

<div
  on:click={() => {
    count += 1;
    console.log(count);
  }}
>
  {fruit}
</div>
```

![](../img/220804-1.png)

다만 한가지 주의해야 할 점이 있다. 컨텍스트 모듈에서 정의된 데이터는 반응성을 가질 수 없다.
즉 데이터 갱신은 가능하나 화면을 갱신해줄 수 없는 것이다. 대신 모든 컴포넌트를 아우르는 전역화 된 데이터로 사용할 수 있다는 점이 포인트이다.

그럼 이 count 데이터를 App 컴포넌트로 `내보내기` 하는 방법은 무엇일까? export를 사용하면 된다.

`Fruit.svelte`

```html
<script context="module">
  export let count = 0; // export 추가
</script>

<script>
  export let fruit;
</script>

<div on:click={() => count += 1}>
  {fruit}
</div>
```

`App.svelte`

```html
<script>
  import Fruit, { count } from "./Fruit.svelte"; // count 변수 가져오기 추가
  let fruits = ["Apple", "Banana", "Cherry", "Mango", "Orange"];
</script>

<button on:click={() => console.log(count)}>Total count log!</button>
<!-- codes.. -->
```

위와 같이 `export` 를 사용해 `count` 데이터를 내보내고, 이를 사용할 App 컴포넌트에서는 import 시 가져올 변수로 추가해주면 된다.
`count`는 반응성을 가지지 못하므로 화면이 갱신되지는 않으나 `Total count log!` 버튼을 클릭했을 때 `count`값이 디버깅 시 기록되도록 구현할 수 있다.

![](../img/220805-1.gif)

이를 실무에서 활용할 수 있는 방법이 뭐가 있을까? 예제를 통해 알아보자

### 오디오 플레이어 예제

이번에는 모듈 컨텍스트를 사용해 예제를 하나 구현해보고자 한다.

`AudioPlayer.svelte`

```html
<script context="module">
  const players = new Set();
  export function stopAll() {
    players.forEach((p) => p.pause()); // pause는 오디오 객체
  }
</script>

<script>
  import { onMount } from "svelte";
  export let src;
  let player;

  onMount(() => [
    // Like players.push(player)
    players.add(player),
  ]);
</script>

<div>
  <!-- controls 옵션은 audio 객체를 관리할 수 있게한다. -->
  <audio {src} bind:this="{player}" constrols>
    <track kind="captions" />
  </audio>
</div>
```

`App.svelte`

```html
<script>
  import AudioPlayer, { stopAll } from "./AudioPlayer.svelte";
  let audioTracks = [
    "https://sveltejs.github.io/assets/music/strauss.mp3",
    "https://sveltejs.github.io/assets/music/holst.mp3",
    "https://sveltejs.github.io/assets/music/satie.mp3",
  ];
</script>

<button on:click="{stopAll}">Stop all!</button>
{#each audioTracks as src}
<AudioPlayer {src} />
{/each}
```

AudioPlayer는 3번 반복되는 컴포넌트이다. 해당 Audio는 플레이 버튼을 누르면 각각 재생이 되고, Stop All 버튼을 누르면 모든 오디오가 멈추게 된다. AudioPlayer는 각각의 스벨트 컴포넌트이고, 그것을 script의 module 영역에서 전역화된 데이터로 한번에 제어함으로써 유연한 컴포넌트 운영이 가능해진다. 유용하니 기억해둘 것!

### $$props와 $$restProps

이번 시간에는 커스텀 한 input 컴포넌트를 만들어보려고 한다.

`TextField.svelte`

```html
<div class="my-custom-input"><input type="text" /></div>

<style>
  .my-custom-input input {
    border-radius: 100px;
    padding: 10px 20px;
  }
</style>
```

`App.svelte`

```html
<script>
  import TextField from "./TextField.svelte";

  let id = "";
  let pw = "";
</script>

<TextField />
```

TextField 컴포넌트는 별도의 스크립트를 가지지 않고 input을 렌더링해주고 있다.
만약 App 컴포넌트에서 TextField로 id나 pw 정보를 value props로 내려준다고 가정해보자.
이는 아래와 같이 쓸 수 있다.

`App.svelte`

```html
<script>
  import TextField from "./TextField.svelte";

  let id = "";
  let pw = "";
</script>

<TextField bind:value="{id}" />
<TextField bind:value="{pw}" />
```

`TextField.svelte`

```html
<script>
  export let value;
</script>

<div class="my-custom-input"><input bind:value type="text" /></div>
```

`bind:value`로 양방향 데이터 바인딩을 해주었다.

만약 위 코드에서 input에 type과 placeholder 등의 데이터를 추가로 상속해준다고 하면 아래와 같이 구혈 할 수 있을 것이다.

`TextField.svelte`

```html
<script>
  export let value;
  export let type;
  export let placeholder;
</script>

<div class="my-custom-input"><input bind:value {type} {placeholder} /></div>
```

input 태그에 붙일 수 있는 html 속성은 매우 많다. 만약 커스텀 인풋을 만든다고 했을 때 인풋에 필요한 각 요소들을 모두 Props로 전달되도록 한다면 이는 매우 번거롭고 부담스러운 일이 될 것이다.

이때 스벨트는 이러한 문제를 해결할 수 있도록 `$$props` 객체를 제공한다. 기본적으로 컴포넌트에 내장되어 있는 객체로 해당하는 컴포넌트가 바깥에서 받는 모든 props를 담고 있는 객체이다.

`TextField.svelte`

```html
<script>
  import App from "./App.svelte";

  export let value;
</script>

<div class="my-custom-input"><input bind:value {...$$props} /></div>
```

`$$props`는 TextField 컴포넌트에서 위와 같이 적을 수 있다.
위와 같이 하면 App.svelte에서 아래와 같이 각 컴포넌트마다 고유의 데이터가 반영되도록 데이터를 할당해도 잘 반영이 된다. 즉 각 props를 자식 컴포넌트에서 굳이 정의하지 않아도 알아서 해당 값이 반영되는 것이다.

`App.svelte`

```html
<TextField bind:value="{id}" type="email" placeholder="ID를 넣어주세요." maxlength="10" required />
<TextField bind:value="{pw}" type="password" placeholder="Passworld!" required />
```

하지만 모든 속성이 다 되는 것은 아니다.

`App.svelte`

```html
<TextField bind:value="{id}" type="email" color="yellowgreen" placeholder="ID를 넣어주세요." maxlength="10" required />
```

color 속성은 input에 제공되는 기본 데이터 객체에 포함되지 않으므로 위와 같이 yellowgreen으로 설정한 뒤 TextField에서 color라는 변수로 정의해서 사용하면 잘 반영이 된다.

하지만 이와 같이 value나 color는 직접 반영이 되지 않으므로 개별적으로 정의해줘야하는데 이때 사용할 수 있는 또다른 내장 객체가 있다. 바로 `$$restProps`이다.

restProps는 명시한 props($$props)를 제외한 나머지 모든 암시적 props가 들어있다.

`TestField.svetle`

```html
<script>
  export let value;
  export let color;
  // export ...
</script>

<div class="my-custom-input"><input style="color: {color}" bind:value {...$$restProps} /></div>
```

위처럼 $$props와 $$restProps를 전개연산자를 통해 컴포넌트에 대입시켜서 처리하면 여러 차례 속성을 상속하는 과정없이 매끈하게 처리할 수 있다는 점을 참고하자.
