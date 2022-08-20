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

<svelte:window
  on:keydown={(e) => (key = e.key)}
  bind:innerWidth
  bind:innerHeight
  bind:outerWidth
  bind:outerHeight
  bind:online
  bind:scrollX
  bind:scrollY
/>
<h1>{key}</h1>
<div>innerWidth: {innerWidth}</div>
<div>innerHeight: {innerHeight}</div>
<div>outerWidth: {outerWidth}</div>
<div>outerHeight: {outerHeight}</div>
<div>online: {online}</div>
<input type="number" bind:value={scrollX} />
<input type="number" bind:value={scrollY} />
<div class="for-scroll" />

<style>
  .for-scroll {
    height: 2000px;
  }
</style>
