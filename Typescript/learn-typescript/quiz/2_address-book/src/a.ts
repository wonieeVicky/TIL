// 기본적으로 타입스크립트는 별도의 리턴 타입을 지정하지 않아도
// return 데이터를 보고 반환 타입을 추론할 수 있다.
/* function fetchItems() {
  let items = ['a', 'b', 'c'];
  return items;
}
fetchItems(); // string[] 으로 타입 추론된다.
 */

// 그러나 API 동작 등 비동기는 다르다.
// 타입스크립트는 return 당시의 Promise 객체만 보고 타입이 뭔지 추측할 수 없다.
// 따라서 비동기 코드 작업 시 반환값에 대한 자세한 타입정의를 해줘야한다.
function fetchItems(): Promise<string[]> {
  let items = ['a', 'b', 'c'];
  return new Promise(function (resolve) {
    resolve(items);
  });
}
fetchItems(); // Promise<unknown> 으로 타입 추론된다.
