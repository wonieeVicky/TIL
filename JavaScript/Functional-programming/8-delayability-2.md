# 지연성 2

### 결과를 만드는 함수 reduce, take

map, filter 함수는 보통 지연성을 가질 수 있는 함수라고 볼 수 있고, reduce 함수는 실제로 연산을 시작하는 시작점을 알리는 역할을 한다. a로부터 b라는 값을 만들려고 할 때, map, filter를 통해 값을 정리하고, 최종적인 값을 만들 때 reduce를 사용한다.

take함수는 특정 갯수의 배열로 축약하고 완성을 짓는 성질을 가진다. 따라서 지연성을 가진 함수라기 보단 해당 시점에 연산이 이루어지는 함수이다. 즉 reduce와 take 함수는 값을 연산하여 결과를 만들 때 사용하는 함수이다.

### queryStr 함수 만들기

reduce, take 함수들이 실제로 지연성 함수인 map, filter와 조합하여 사용되는지 확인해보려고 한다. 객체로부터 url query-string을 얻어내는 코드를 만들어보려고 하는데, 이 때 map, filter, reduce를 어떤 관점으로 바라보면서 만드는지 살펴보자

```jsx
const queryStr = (obj) =>
  go(
    obj,
    Object.entries, // ["limit", 10], ["offset", 10], ["type", "notice"]
    map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
    reduce((a, b) => `${a}&${b}`)
  );
log(queryStr({ limit: 10, offset: 10, type: "notice" })); // limit=10&offset=10&type=notice
```

위 queryStr 함수는 객체값을 가져와 Object.entries로 분리해주고, map 함수를 통해 원하는 값으로 데이터를 변경한 뒤, reduce로 원하는 결과값을 도출해내는 함수이다.

여기서 급 궁금..! 굳이 reduce를 사용할 필요가 있을까? `join('&')`를 통해서도 충분히 도출되는 값을 만들 수 있을 것 같다. 그러나 join은 Array.prototype에 있는 함수로 `reduce`는 이터러블 객체를 모두 순회하면서 축약할 수 있으므로 더 다형성이 높은 `join` 함수라고 볼 수 있다.

위 함수는 아래와 같이 리팩토링 할 수 있다.

```jsx
// 아래의 join 함수는 배열이 아닌 것도 사용할 수 있다. 받는 값을 reduce를 통해 축약하기 때문
const join = curry((sep = ",", iter) => reduce((a, b) => `${a}${sep}${b}`, iter));

const queryStr = pipe(
  Object.entries, // ["limit", 10], ["offset", 10], ["type", "notice"]
  map(([k, v]) => `${k}=${v}`), // ["limit=10", "offset=10", "type=notice"]
  join("&")
);

log(queryStr({ limit: 10, offset: 10, type: "notice" })); // limit=10&offset=10&type=notice
```

위와 같이 join 함수를 만든 것처럼 함수형 프로그래밍 사고를 하면 pipe 사이에 있는 함수들을 꺼내 조합성과 재사용성을 살려 프로그래밍 할 수 있다. 위에서 만든 join 함수는 배열이 아닌 값도 처리한다.

```jsx
function* a() {
  yield 10;
  yield 11;
  yield 12;
  yield 13;
  yield 14;
}
// log(a().join(",")); // a(...).join is not a function
log(join("-", a())); // 10-11-12-13-14
```
