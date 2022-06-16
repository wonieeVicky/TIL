<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";

  let name = "Something...";
  let h1;

  function moreDot() {
    name += ".";
  }

  // 1
  beforeUpdate(() => {
    console.log("before Update");
    console.log(h1?.innerText); // 데이터 갱신 전
  });

  // 2
  onMount(() => {
    console.log("Mounted!");
    h1 = document.querySelector("h1");
  });

  // 3
  afterUpdate(() => {
    console.log("after Update");
    console.log(h1?.innerText); // 데이터 갱신 후
  });

  onDestroy(() => {
    console.log("Before Destroy");
  });
</script>

<h1 on:click={moreDot}>{name}</h1>
