<script>
  import WritableMethods from "./WritableMethods.svelte";
  let toggle = true;
</script>

<button on:click={() => (toggle = !toggle)}>Toggle</button>

{#if toggle}
  <WritableMethods />
{/if}
