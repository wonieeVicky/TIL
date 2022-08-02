<script>
  import Parent from "./Parent.svelte";

  function handler(e) {
    console.log(e.currentTarget); // <button>Parent Click!</button>
  }

  function myEventHandler(e) {
    console.log(e.detail.myName);
  }
</script>

<Parent on:click={handler} on:myEvent={myEventHandler} />
