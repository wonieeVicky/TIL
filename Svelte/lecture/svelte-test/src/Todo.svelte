<script>
  import { createEventDispatcher } from "svelte";
  export let todo;

  // createEventDispatcher는 new CustomEvent()를 통해 커스텀 이벤트를 생성.
  // 따라서 event.detail을 사용한다.
  const dispatch = createEventDispatcher();

  function deleteTodo() {
    // custom dispatch 함수 생성
    dispatch("deleteMe", { todoId: todo.id });
  }
</script>

<div>
  <input type="checkbox" bind:value={todo.done} />
  {todo.title}
  <button on:click={deleteTodo}>X</button>
</div>
