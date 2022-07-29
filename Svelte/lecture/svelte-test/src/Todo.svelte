<script>
  export let todos;
  export let todo;
  export let index;

  function deleteTodo() {
    todos.splice(index, 1);
    todos = todos;
    console.log(todos);
  }
</script>

<div>
  <input type="checkbox" bind:value={todo.done} />
  {todo.title}
  <button on:click={deleteTodo}>X</button>
</div>
