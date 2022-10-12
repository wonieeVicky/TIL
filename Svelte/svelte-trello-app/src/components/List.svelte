<script>
  import CreateCard from "~/components/CreateCard.svelte"
  import ListTitle from "~/components/ListTitle.svelte"
  import Card from "~/components/Card.svelte"

  export let list
</script>

<div class="list">
  <div class="list__inner">
    <div class="list__heading">
      <ListTitle {list} />
      <p>{list.cards.length} cards</p>
    </div>
    <div class="list__cards">
      {#each list.cards as card (card.id)}
        <Card />
      {/each}
    </div>
    <CreateCard />
  </div>
</div>

<style lang="scss">
  body {
    height: 100vh;
    padding: 0;
    padding: 30px;
    box-sizing: border-box;
  }
  .list {
    display: inline-block;
    font-size: 16px;
    white-space: normal;
    width: 290px;
    height: 100%;
    box-sizing: border-box;
    margin: 0 4px;
    & * {
      box-sizing: border-box;
    }
    & .list__inner {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      padding: 10px 8px;
      background: #ebecf0;
      border-radius: 4px;
      & .list__heading {
        margin-bottom: 10px p {
          color: #5e6c84;
          padding: 0 8px;
        }
      }
      & .list__cards {
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 10px;
        .card {
          height: 150px;
        }
      }
    }
  }
  :global(.list.sortable-ghost) {
    position: relative;
    opacity: 0.2;
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
  :global(.list.sortable-chosen) {
    cursor: move;
  }
</style>
