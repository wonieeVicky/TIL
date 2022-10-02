<script>
  import { lists } from "~/store/list"
</script>

<div class="create-list">+ Add another list</div>

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
