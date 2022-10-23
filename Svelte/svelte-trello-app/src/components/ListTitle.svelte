<script>
  import { onDestroy, tick, createEventDispatcher } from "svelte"
  import { autoFocusout } from "~/actions/autoFocusout"
  import { lists } from "~/store/list"

  export let list
  let isEditMode = false
  let title = list.title
  let textareaEl
  const dispatch = createEventDispatcher()

  function saveTitle() {
    if (title.trim()) {
      lists.edit({
        listId: list.id,
        title,
      })
    }
    offEditMode()
  }

  function removeList() {
    lists.remove({
      listId: list.id,
    })
  }

  async function onEditMode() {
    isEditMode = true
    title = list.title
    dispatch("editMode", true)
    await tick()
    textareaEl && textareaEl.focus()
  }

  function offEditMode() {
    isEditMode = false
    dispatch("editMode", false)
  }

  onDestroy(() => {
    offEditMode()
  })
</script>

{#if isEditMode}
  <div use:autoFocusout={offEditMode} class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this list.."
      on:keydown={(e) => {
        e.key === "Enter" && saveTitle()
        e.key === "Escape" && offEditMode()
        e.key === "Esc" && offEditMode()
      }}
    />
    <div class="actions">
      <div class="btn success" on:click={saveTitle}>Save</div>
      <div class="btn" on:click={offEditMode}>Cancel</div>
      <div class="btn danger" on:click={removeList}>Delete List</div>
    </div>
  </div>
{:else}
  <h2 class="title">
    {list.title}
    <div class="btn small edit-btn-for-list" on:click={onEditMode}>Edit</div>
  </h2>
{/if}

<!-- (참고) 해당 컴포넌트에 입력할 스타일이 없더라도
  기존 rollup.config에 설정한 globla 스타일을 적용하고 싶다면
  lang 속성이 'scss'로 설정된 빈 스타일 태그를 넣어줘야 반영된다. -->
<style lang="scss">
  h2.title {
    font-weight: 700;
    padding: 4px 8px;
    cursor: pointer;
    position: relative;
    .edit-btn-for-list {
      position: absolute;
      top: 0;
      right: 0;
      display: none;
    }
  }
  :global(.list__inner:hover .edit-btn-for-list) {
    display: block !important;
  }
</style>
