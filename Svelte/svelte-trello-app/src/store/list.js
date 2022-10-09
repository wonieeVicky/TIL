import { writable } from "svelte/store"
import cryptoRandomString from "crypto-random-string"
import _find from "lodash/find"
import _remove from "lodash/remove"

const generateId = () => cryptoRandomString({ length: 10 })

const repoLists = JSON.parse(window.localStorage.getItem("lists")) || []

const _lists = writable(repoLists) // 외부에서 사용하지 않고 내부에서만 사용하는 정보
_lists.subscribe(($lists) => window.localStorage.setItem("lists", JSON.stringify($lists)))

export const lists = {
  subscribe: _lists.subscribe, // 실행시키지 않고 참조관계로 연결
  add(payload) {
    const { title } = payload
    _lists.update(($lists) => {
      $lists.push({
        id: generateId(),
        title,
        cards: [],
      })
      return $lists
    })
  },
  edit(payload) {
    const { listId, title } = payload
    _lists.update(($lists) => {
      // const foundList = $lists.find((l) => l.id === listId)
      const foundList = _find($lists, { id: listId })
      foundList.title = title
      return $lists
    })
  },
  remove(payload) {
    const { listId } = payload
    _lists.update(($lists) => {
      _remove($lists, { id: listId })
      return $lists
    })
  },
}
