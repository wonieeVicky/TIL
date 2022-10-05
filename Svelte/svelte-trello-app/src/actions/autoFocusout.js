export function autoFocusout(el, focusoutListener) {
  const focusinListener = (event) => {
    event.stopPropagation()
  }
  // setTimeout을 0으로 설정하면 화면이 그려진 후 실행됨(call stack) - 기본 로직(Task)이 실행된 후 동작함
  setTimeout(() => {
    // el의 clickEvent가 window까지 전파되지 않도록 처리
    el.addEventListener("click", focusinListener)
    // close edit-mode
    window.addEventListener("click", focusoutListener)
  })

  return {
    // el 요소가 파괴되면 destroy가 실행
    destroy() {
      el.removeEventListener("click", focusinListener)
      window.removeEventListener("click", focusoutListener)
    },
  }
}
