<script>
  import Count from "./Count.svelte";
  let reset = false;
</script>

{#key reset}
  <Count />
{/key}

<button on:click={() => (reset = !reset)}>Reset!</button>
