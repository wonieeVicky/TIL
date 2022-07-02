<script>
  import { tick } from "svelte";
  let isShow = false;
  let inputEl;

  async function toggle() {
    isShow = !isShow;
    await tick();
    inputEl && inputEl.focus();
  }
</script>

<button on:click={toggle}>Edit!</button>
{#if isShow}
  <input bind:this={inputEl} />
{/if}
