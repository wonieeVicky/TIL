<div class="list">
  <div class="list__inner">
    <div class="list__heading" />
    <div class="list__cards">
      <div class="card" />
      <div class="card" />
    </div>
    <div class="create-card" />
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
    border: 10px solid yellowgreen;
    box-sizing: border-box;
    margin: 0 4px;
    & * {
      box-sizing: border-box;
    }
  }
  .list__inner {
    border: 10px solid blue;
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }
  .list__heading {
    border: 10px solid green;
  }
  .list__cards {
    border: 10px solid orange;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list__cards .card {
    height: 150px;
    border: 10px solid;
  }
  .create-card {
    border: 10px solid red;
  }
</style>
