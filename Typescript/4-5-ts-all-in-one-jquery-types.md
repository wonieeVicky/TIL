## 제이쿼리 타입 분석

### 분석 전: 타입 지원 여부 확인하기

보통 npm에서 라이브러리 타이틀 우측에 TS 마크를 보고 타입 지원 여부를 확인할 수 있다.
하지만 위 타입 지원 형태는 라이브러리에 따라 조금씩 다를 수 있음

먼저 Redux의 경우는 아예 typescript로 작성된 코드가 주를 이룬다.

![](../img/230104-1.png)

package.json에도 type 정보에 대한 내용을 확인할 수 있다.

```json
{
  "name": "redux",
  // ..
  "main": "lib/redux.js",
  "typings": "./index.d.ts"
  // ..
}
```

Axios의 경우 JavaScript 코드로 작성되어 있다.

![](../img/230104-2.png)

pacakge.json에도 동일하게 파일 root 위치와 types 정보를 안내하고 있음

```json
{
  "name": "axios",
  // ..
  "main": "index.js",
  "types": "index.d.ts"
  // ..
}
```

jQuery의 경우에는 라이브러리 자체에서 types 를 지원하지 않는다. DT 아이콘으로 노출됨
`@types/jquery` 를 함께 받아야하며, 다양한 사람들이 타이핑을 만들어놓은 것, 누구나 contributor가 될 수 있음. 단, 틀린 타입이 제공될 수 있다.

아무것도 붙어있지 않은 타입 파일 미지원 라이브러리는 필요 시 직접 타이핑을 해야 한다. (index.d.ts 생성)
