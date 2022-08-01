<script>
  import Todo from "./Todo.svelte";

  let todos = [
    { id: 1, title: "Breakfast", done: false },
    { id: 2, title: "Lunch", done: false },
    { id: 3, title: "Dinner", done: false },
  ];

  function deleteTodo(event) {
    const { todoId } = event.detail;
    const index = todos.findIndex((t) => t.id === todoId);
    todos.splice(index, 1);
    todos = todos;
  }
</script>

{#each todos as todo (todo.id)}
  <Todo {todo} on:deleteMe={deleteTodo} />
{/each}
