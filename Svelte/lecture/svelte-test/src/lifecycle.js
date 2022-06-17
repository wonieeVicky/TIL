import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
import { writable } from "svelte/store";

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
