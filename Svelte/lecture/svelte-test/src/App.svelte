<script>
  import Joy from "./Joy.svelte";

  let joy;

  function handler() {
    console.log(joy);
    console.log(joy.name);
    console.log(joy.getAge());
  }
</script>

<button on:click={handler}>Toggle!</button>
<Joy bind:this={joy} />
