<script>
  import Fruit, { count } from "./Fruit.svelte";
  let fruits = ["Apple", "Banana", "Cherry", "Mango", "Orange"];
</script>

<button on:click={() => console.log(count)}>Total count log!</button>

{#each fruits as fruit}
  <Fruit {fruit} />
{/each}
