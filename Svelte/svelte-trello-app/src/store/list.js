import { writable } from "svelte/store"

const repoLists = JSON.parse(window.localStorage.getItem("lists")) || []

const _lists = writable(repoLists) // 외부에서 사용하지 않고 내부에서만 사용하는 정보
_lists.subscribe(($lists) => window.localStorage.setItem("lists", JSON.stringify($lists)))

export const lists = {
  subscribe: _lists.subscribe, // 실행시키지 않고 참조관계로 연결
  add(payload) {
    const { title } = payload
    _lists.update(($lists) => {
      $lists.push({
        id: "",
        title,
        cards: [],
      })
      return $lists
    })
  },
}
