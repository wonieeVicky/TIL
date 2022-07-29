<script>
  import Todo from "./Todo.svelte";

  let todos = [
    { id: 1, title: "Breakfast", done: false },
    { id: 2, title: "Lunch", done: false },
    { id: 3, title: "Dinner", done: false },
  ];
</script>

{#each todos as todo, index (todo.id)}
  <Todo bind:todos {todo} {index} />
{/each}
