<script>
  import Readable from "./Readable.svelte";
  let toggle = true;
</script>

<button on:click={() => (toggle = !toggle)}>Toggle</button>

{#if toggle}
  <Readable />
{/if}
