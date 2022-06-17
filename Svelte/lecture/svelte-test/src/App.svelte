<script>
  import { lifecycle, delayRender } from "./lifecycle";
  import Something from "./Something.svelte";
  lifecycle();
  let done = delayRender();
</script>

<Something />
{#if $done}
  <h1>Hello Lifecycle!</h1>
{/if}
