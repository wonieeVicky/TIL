﻿<script>
  import Sortable from "sortablejs"
  import { onMount } from "svelte"
  import { lists } from "~/store/list"
  import List from "~/components/List.svelte"
  import CreateList from "~/components/CreateList.svelte"

  let listsEl
  let sortableLists

  onMount(() => {
    // For Lists
    sortableLists = new Sortable(listsEl, {
      group: "My Lists", // 한 목록에서 다른 목록으로 요소를 끌어오려면(DnD) 두 목록의 그룹 값이 같아야 합니다.
      handle: ".list", // 드래그 핸들이 될 요소의 선택자를 입력합니다.
      delay: 50, // 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간을 추가합니다.
      animation: 0, // 정렬할 때 애니메이션 속도(ms)를 지정합니다.
      forceFallback: true, // 다양한 환경의 일관된 Drag&Drop(DnD)을 위해 HTML5 기본 DnD 동작을 무시하고 내장 기능을 사용합니다.
      // 요소의 DnD가 종료되면 실행할 핸들러(함수)를 지정합니다.
      onEnd(event) {
        console.log(event) // event 객체의 정렬에 대한 다양한 정보가 들어있어요.
        lists.reorder({
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
        })
      },
    })
  })
</script>

<div class="list-container">
  <div bind:this={listsEl} class="lists">
    {#each $lists as list (list.id)}
      <List {list} {sortableLists} />
    {/each}
  </div>
  <CreateList />
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    padding: 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    .lists {
      display: inline-block;
      height: 100%;
      white-space: nowrap;
      font-size: 0;
    }
  }
</style>
