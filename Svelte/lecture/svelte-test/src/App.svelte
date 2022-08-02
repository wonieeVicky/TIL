<script>
  import Parent from "./Parent.svelte";

  function handler(e) {
    console.log(e.currentTarget); // <button>Parent Click!</button>
  }
</script>

<Parent on:click={handler} />
