<script>
  import { fruits } from "./fruits.js";
  let value;
</script>

<input bind:value />
<button on:click={() => fruits.setItem(value)}>Add Fruit!</button>
<button on:click={() => console.log(fruits.getList())}>Log Fruit List!</button>

<ul>
  {#each $fruits as { id, name } (id)}
    <li>{name}</li>
  {/each}
</ul>
