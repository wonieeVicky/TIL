<script>
  let promise = Promise.resolve("Hmm..");

  function fetchName() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve("Vicky"), 0);
    });
  }
</script>

<button
  on:click={async () => {
    promise = fetchName();
  }}>Fetch Name!</button
>

{#await promise then name}
  <h1>{name}</h1>
{/await}
