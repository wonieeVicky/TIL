<script>
  import Child from "./Child.svelte";
</script>

<h2>Parent</h2>
<button on:click>Parent Click!</button>
<Child on:myEvent />
