<script>
  let name = "Vicky";
  let index = 0;
</script>

{@debug index, name}
<h1 on:click={() => index++}>Hello {name}!</h1>
