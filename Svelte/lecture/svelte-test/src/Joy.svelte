<svelte:options accessors />

<script>
  let age = 33;
  export let name = "Joy";
  export function getAge() {
    console.log(age);
  }
</script>

<h1 on:click={getAge}>{name}!</h1>
