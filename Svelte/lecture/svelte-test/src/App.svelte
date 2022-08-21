<script>
  import Jenny from "./Jenny.svelte";
  let toggle = false;
</script>

<button on:click={() => (toggle = !toggle)}>Toggle!</button>

{#if toggle}
  <Jenny />
{/if}
