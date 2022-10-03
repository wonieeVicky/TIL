<script>
  import { tick } from "svelte"
  import { lists } from "~/store/list"
  let isEditMode = false
  let title = ""
  let textareaEl

  function addList() {
    // 값 존재 시 동작
    if (title.trim()) {
      lists.add({
        title,
      })
    }
    offEditMode()
  }

  async function onEditMode() {
    isEditMode = true
    await tick() // 데이터 갱신을 기다려준다.
    textareaEl && textareaEl.focus()
  }

  function offEditMode() {
    isEditMode = false
    title = ""
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this list..."
        on:keydown={(e) => {
          e.key === "Enter" && addList()
          e.key === "Escape" && offEditMode()
          e.key === "Esc" && offEditMode() // IE, edge 지원 코드
        }}
      />
      <div class="actions">
        <div class="btn" on:click={addList}>Add List</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
      </div>
    </div>
  {:else}
    <div class="add-another-list" on:click={onEditMode}>+ Add another list</div>
  {/if}
</div>

<style lang="scss">
  .create-list {
    font-size: 16px;
    white-space: normal;
    width: 290px;
    display: inline-block;
    padding: 10px 8px;
    vertical-align: top;
    background: rgba(#ebecf0, 0.6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: #ebecf0;
    }
  }
</style>
