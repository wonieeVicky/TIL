<script>
  // let fruits = ["Apple", "Banana", "Cherry", "Orange"];
  let fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
    { id: 4, name: "Banana" },
  ];

  function deleteFirst() {
    fruits = fruits.slice(1); // ["Banana", "Cherry", "Orange"]
  }
</script>

<button on:click={deleteFirst}> Delete first fruit!</button>

<ul>
  {#each fruits as fruit (fruit.id)}
    <li>{fruit.name}</li>
  {/each}
</ul>
