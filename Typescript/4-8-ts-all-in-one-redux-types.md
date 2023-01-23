## Redux 타입 분석

### named exports만 있는 Redux 알아보기

Redux 타입을 분석하기 위해 먼저 redux 라이브러리를 설치해준다.
이후 `redux/index.d.ts` 에 접근해보면 별도 export 되고 있는 부분을 확인할 수 없음
각 메서드들이 직접 export function(named exports라고도 불린다.)으로 구현되어 있는데, 이는 redux의 경우 모듈 자체를 export 해주지 않으며 각 메서드들을 아래와 같이 가져와야 한다는 것을 의미한다.

```tsx
// import redux from "redux"; // 이렇게 쓸 일은 없다.
import { combineReducers, legacy_createStore as createStore } from "redux"; // 이렇게 직접 사용할 named export

const initialState = {
  user: {
    isLoggingIn: true,
    data: null,
  },
  posts: [],
};

// type Error
const reducer = combineReducers({
  user: null,
  posts: null,
});

const store = createStore(reducer, initialState);
```

위와 같이 기본 포맷을 하나씩 타이핑 해보면, 가장 먼저 reducer에서 타입 에러가 발생한다.
아마도 user, posts 값이 올바르지 않아서 인 것으로 느껴진다. combineReducers 타입을 확인해보자

```tsx
// index.d.ts
export function combineReducers<S>(reducers: ReducersMapObject<S, any>): Reducer<CombinedState<S>>;
export function combineReducers<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<CombinedState<S>, A>;
export function combineReducers<M extends ReducersMapObject<any, any>>(
  reducers: M
): Reducer<CombinedState<StateFromReducersMapObject<M>>, ActionFromReducersMapObject<M>>;
// ..
```

오버로딩된 3가지 타입이 위와 같이 적혀있음.. 위 타입 중 Reducer 타입을 상세히 보자

```
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S
```

위와 같이 state, action을 매개변수로 해서 state를 리턴해주는 구조라는 것을 알 수 있다.

```tsx
const reducer = combineReducers({
  user: (state, action) => state,
  posts: (state, action) => state,
});
```

이에 따라 위와 같이 combineReducers에 필요한 데이터를 넣어주면 reducer 타입 에러가 사라짐.
이 밖에도 `combineReducers` 타입에 적용된 `ReducersMapObject` 타입을 보면 아래와 같다.

```tsx
/**
 * Object whose values correspond to different reducer functions.
 *
 * @template A The type of actions the reducers can potentially respond to.
 */
export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
```

위 타이핑으로 코드에 적용된 정보를 대입해보면 아래와 같다.

```tsx
const initialState = {
  // S = initialState
  user: {
    // S[k] or keyof S
    isLoggingIn: true,
    data: null,
  },
  posts: [], // S[k] or keyof S
};
```

위 타입 적용 구조를 이해해두고, 사용법을 알아둬야 나중에 직접 타이핑 시 활용할 수 있음
