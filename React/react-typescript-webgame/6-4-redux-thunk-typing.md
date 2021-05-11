# redux-thunk typing

redux는 미들웨어를 사용하지 않으면 useReducer와 contextAPI로 대체 가능하다.
redux를 사용하는 이유는 비동기처리를 도와주는 미들웨어 때문이다! 미들웨어는 삼단 고차함수로 되어있다.

미들웨어 적용 전에 사용환경에 따른 미들웨어 적용 분기를 위해 redux-devtools-extension을 설치해준다.

```bash
$ npm i redux-devtools-extension
```

먼저 thunk 미들웨어를 store에 추가해주자

`store.ts`

```tsx
import { createStore, MiddlewareAPI, Dispatch, AnyAction, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};

// 1. 미들웨어는 삼단 고차함수로 되어있음
// 아래와 같이 함수가 3개의 단계로 분리되어있으면 타이핑이 필요함
const firstMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  console.log("로깅:", action);
  next(action);
};

// 2. thunk middleware 구현 및 타이핑 - thunk는 액션을 객체가 아닌 함수로 바꿔서 비동기처리를 구현한다.
const thunkMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: any) => {
  if (typeof action === "function") {
    // 비동기
    return action(store.dispatch, store.getState); // 타입 재정의 필요
  }
  return next(action); // 동기
};

// 3. 미들웨어 장착 - 보통 NODE_ENV에 따라 미들웨어 설정이 다르다
const enhance =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware(firstMiddleware, thunkMiddleware))
    : composeWithDevTools(applyMiddleware(firstMiddleware, thunkMiddleware));
const store = createStore(reducer, initialState, enhance); // 3번째 인자로 들어감

export default store;
```

그리고 logIn 액션에 대한 thunk 액션 creator 구현 및 타이핑을 해보자

`actions/user.ts`

```tsx
import { AnyAction } from "redux";
import { addPost } from "./post";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST" as const;
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS" as const;
export const LOG_IN_FAILURE = "LOG_IN_FAILURE" as const;
export const LOG_OUT = "LOG_OUT" as const;

export interface LogInRequestAction {
  type: typeof LOG_IN_REQUEST;
  data: {
    id: string;
    password: string;
  };
}
// 1. action creator
export const logInRequest = (data: { id: string; password: string }): LogInRequestAction => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export interface LogInSuccessAction {
  type: typeof LOG_IN_SUCCESS;
  data: {
    userId: number;
    nickname: string;
  };
}
// 1. action creator
export const logInSuccess = (data: { userId: number; nickname: string }): LogInSuccessAction => {
  return {
    type: LOG_IN_SUCCESS,
    data,
  };
};

export interface LogInFailureAction {
  type: typeof LOG_IN_FAILURE;
  error: Error;
}
// action creator
export const logInFailure = (error: Error): LogInFailureAction => {
  return {
    type: LOG_IN_FAILURE,
    error,
  };
};

// 4. thunk 함수 내 dispatch 타이핑
// TypeScript에서는 상호참조에 대한 타이핑도 지원한다 ThunkAction - ThunkDispatch
interface ThunkDispatch {
  (thunkAction: ThunkAction): void; // thunkAction인 경우 - 리턴값 없음
  <A>(action: A): A; // 임의의 액션인 경우 - 리턴값 있음
  <TAction>(action: TAction | ThunkAction): TAction; // 또는 thunkAction이거나 임의의 액션인 경우
}

// 3. thunk 함수 타이핑
type ThunkAction = (dispatch: ThunkDispatch) => void;

// 2. thunk action 함수 구현
export const logIn = (data: { id: string; password: string }): ThunkAction => {
  return (dispatch) => {
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(
          logInSuccess({
            userId: 123,
            nickname: "빅히언니",
          })
        );
        dispatch(addPost(""));
      }, 1000);
    } catch (err) {
      dispatch(logInFailure(err));
    }
  };
};

// 아래는 비동기가 아닌 동기 액션에 대한 처리이다.
// 위 비동기 처리 코드와 비교해볼 것
export interface LogOutAction {
  type: typeof LOG_OUT;
}

export const logOut = () => {
  return {
    type: LOG_OUT,
  };
};
```
