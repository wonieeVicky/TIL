## 컴포넌트

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
