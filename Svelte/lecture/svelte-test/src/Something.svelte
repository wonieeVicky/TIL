<script>
  import { onMount, onDestroy } from "svelte";

  const h1 = document.querySelector("h1");
  // console.log(h1.innerText); // null, 위 코드가 컴포넌트가 화면에 렌더링 되지 않은 상태에서 찾았기 때문에 null

  // 화면에 컴포넌트 렌더링 후 실행로직을 담는 라이프 사이클
  onMount(() => {
    // const h1 = document.querySelector("h1");
    // console.log(h1.innerText);
    // console.log("Mounted!");

    // onDestroy가 생기기 전에는 아래와 같이 해결할 수 있다.
    // 비동기가 없는 상황에서만 내부 onDestroy를 사용할 수 있다.
    return () => {
      console.log("Destroy in mount");
    };
  });

  // 화면에 컴포넌트 연결이 해제되기 직전에 실행되는 라이프 사이클
  onDestroy(() => {
    // const h1 = document.querySelector("h1");
    // console.log(h1.innerText); // Something..., 연결이 해제되기 직전에 실행되므로 값이 담긴다.
    console.log("Before Destroy");
  });
</script>

<h1>Something...</h1>
