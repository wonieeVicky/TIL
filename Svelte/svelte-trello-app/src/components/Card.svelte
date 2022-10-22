<script>
  import { tick } from "svelte"
  import { autoFocusout } from "~/actions/autoFocusout"
  import { cards } from "~/store/list"

  export let listId
  export let card
  let isEditMode = false
  let title
  let textareaEl

  function saveCard() {
    if (title.trim()) {
      cards.edit({
        listId,
        cardId: card.id,
        title,
      })
    }
    offEditMode()
  }
  function removeCard() {
    cards.remove({
      listId,
      cardId: card.id,
    })
  }
  async function onEditMode() {
    isEditMode = true
    title = card.title
    await tick()
    textareaEl && textareaEl.focus()
  }
  function offEditMode() {
    isEditMode = false
  }
</script>

<div class="card">
  {#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this card..."
        on:keydown={(event) => {
          event.key === "Enter" && saveCard()
          event.key === "Escape" && offEditMode()
          event.key === "Esc" && offEditMode()
        }}
      />
      <div class="actions">
        <div class="btn success" on:click={saveCard}>Save</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
        <div class="btn danger" on:click={removeCard}>Delete Card</div>
      </div>
    </div>
  {:else}
    <div class="title">
      {card.title}
      <div class="btn small" on:click={onEditMode}>Edit</div>
    </div>
  {/if}
</div>

<style lang="scss">
  .card {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 1px;
    }
    .title {
      background: #fff;
      padding: 6px 8px;
      border-radius: 4px;
      box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
      line-height: 20px;
      position: relative;
      &:hover {
        background-color: #f5f5f5;
      }
      .btn {
        position: absolute;
        top: 6px;
        right: 8px;
        display: none;
      }
      &:hover .btn {
        display: block;
      }
    }
  }
  :global(.card.sortable-ghost) {
    opacity: 0.1;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 4px;
    }
  }
  :global(.card.sortable-chosen) {
    cursor: move;
  }
</style>
