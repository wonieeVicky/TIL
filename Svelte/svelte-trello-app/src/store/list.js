import { writable } from "svelte/store"
import cryptoRandomString from "crypto-random-string"
import _find from "lodash/find"
import _remove from "lodash/remove"
import _cloneDeep from "lodash/cloneDeep"

const generateId = () => cryptoRandomString({ length: 10 })

const repoLists = JSON.parse(window.localStorage.getItem("lists")) || []

const _lists = writable(repoLists) // 외부에서 사용하지 않고 내부에서만 사용하는 정보
_lists.subscribe(($lists) => window.localStorage.setItem("lists", JSON.stringify($lists)))

export const lists = {
  subscribe: _lists.subscribe, // 실행시키지 않고 참조관계로 연결
  reorder(payload) {
    const { oldIndex, newIndex } = payload
    _lists.update(($lists) => {
      const clone = _cloneDeep($lists[oldIndex]) // 원래 데이터를 복사
      $lists.splice(oldIndex, 1) // 원래 데이터를 제거
      $lists.splice(newIndex, 0, clone) // 새로운 위치에 데이터 저장
      return $lists
    })
  },
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

export const cards = {
  // subscribe 메서드가 없으므로 cards는 그냥 객체일 뿐이다.
  reorder(payload) {
    const { oldIndex, newIndex, fromListId, toListId } = payload
    _lists.update(($lists) => {
      const fromList = _find($lists, { id: fromListId })
      const toList = fromListId === toListId ? fromList : _find($lists, { id: toListId }) // 같은 List 내 이동 시를 고려함
      const clone = _cloneDeep(fromList.cards[oldIndex]) // cards는 객체 데이터이므로 데이터 삭제 시 함께 사라질 수 있어 cloneDeep으로 깊은 복사
      fromList.cards.splice(oldIndex, 1) // 데이터 삭제
      toList.cards.splice(newIndex, 0, clone) // 데이터 추가
      return $lists
    })
  },
  add(payload) {
    const { listId, title } = payload
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId })
      foundList.cards.push({
        id: generateId(),
        title,
      })
      return $lists
    })
  },
  edit(payload) {
    const { listId, cardId, title } = payload
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId })
      const foundCard = _find(foundList.cards, { id: cardId })
      foundCard.title = title
      return $lists
    })
  },
  remove(payload) {
    const { listId, cardId } = payload
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId })
      _remove(foundList.cards, { id: cardId })
      return $lists
    })
  },
}
