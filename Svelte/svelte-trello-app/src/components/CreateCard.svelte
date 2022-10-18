<script>
  import { tick } from "svelte"
  import { cards } from "~/store/list"
  import { autoFocusout } from "~/actions/autoFocusout"
  export let listId
  let isEditMode = false
  let title = ""
  let textareaEl

  function addCard() {
    if (title.trim()) {
      cards.add({
        listId,
        title,
      })
    }
    offEditMode()
  }

  async function onEditMode() {
    isEditMode = true
    title = ""
    await tick()
    textareaEl && textareaEl.focus()
  }

  function offEditMode() {
    isEditMode = false
  }
</script>

{#if isEditMode}
  <div use:autoFocusout={offEditMode} class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this card..."
      on:keydown={(event) => {
        event.key === "Enter" && addCard()
        event.key === "Escape" && offEditMode()
        event.key === "Esc" && offEditMode()
      }}
    />
    <div class="actions">
      <div class="btn success" on:click={addCard}>Add card</div>
      <div class="btn" on:click={offEditMode}>Cancel</div>
    </div>
  </div>
{:else}
  <div class="add-another-card" on:click={onEditMode}>+Add another card</div>
{/if}

<style lang="scss">
  .add-another-card {
    padding: 4px 8px;
    font-size: 14px;
    color: #5e6c84;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: rgba(9, 30, 66, 0.08);
      color: #172b4d;
    }
  }
</style>
