<script>
  import Fruit from "./Fruit.svelte";

  let fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
    { id: 4, name: "Mango" },
    { id: 5, name: "Orange" },
  ];
</script>

<button
  on:click={() => {
    fruits[0] = { id: 1, name: "Apple" }; // 같은 데이터지만 객체 데이터는 가변성 데이터이므로 할당되는 메모리 위치는 달라진다.
    fruits = fruits;
  }}>Update!</button
>

{#each fruits as { id, name } (id)}
  <Fruit {name} />
{/each}
