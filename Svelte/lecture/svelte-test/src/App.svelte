<script>
  import Derived from "./Derived.svelte";
  let toggle = true;
</script>

<button on:click={() => (toggle = !toggle)}>Toggle</button>

{#if toggle}
  <Derived />
{/if}
