# ThunkDispatch와 immer, Hooks typing

### ThunkDispatch

redux-thunk까지 타이핑이 완료되고 프로젝트를 로컬로 실행시켜보면 에러가 떨어진다.  
바로 mapDispatchToProps의 dispatch 매개변수 타이핑에 에러가 발생하는 이슈 때문이다.

`App.tsx`

```tsx
// codes..
// const mapDispatchToProps = (dispatch: Dispatch) => ({
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  dispatchLogIn: (data: { id: string; password: string }) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

기존에는 redux의 Dispatch로 타이핑을 해주었으나 thunk 는 action을 객체가 아닌 함수로 바꿔서 처리하므로 해당 내용에 대한 타이핑 추가 필요 ! 이는 `actions/user.ts` 에서 만들어준 ThunkDispatch 인터페이스 타입을 import해서 사용한다

`actions/user.ts`

```tsx
// ...
export interface ThunkDispatch {
  (thunkAction: ThunkAction): void; // thunkAction인 경우 - 리턴값 없음
  <A>(action: A): A; // 임의의 액션인 경우 - 리턴값 있음
  <TAction>(action: TAction | ThunkAction): TAction; // 또는 thunkAction이거나 임의의 액션인 경우
}
// ...
```

ThunkDispatch에 대한 타이핑이 어려울 경우 redux-thunk를 다운로드 받고, 이에 따른 @types 파일을 다운로드 받아서 제공하는 타이핑을 사용해도 된다. 단, 이렇게 되면 이미 만들어진 타입에 지나치게 의존하게 되므로 직접 타이핑을 해보고, 안되는 부분은 다운로드받아서 해결해보는 방법으로 해결해나가보면 좋을 것 같다 : )

### immer

immer를 사용하여 리듀서 내 액션 처리도 불변성 고민없이 해결해준다.

```bash
$ npm i immer
```

`reducers/user.ts`

```tsx
import { produce } from "immer";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT,
  LogInRequestAction,
  LogInSuccessAction,
  LogInFailureAction,
  LogOutAction,
} from "../actions/user";

export interface UserState {
  isLoggingIn: boolean;
  data: {
    nickname: string;
  } | null;
}

const initialState: UserState = {
  isLoggingIn: false,
  data: null,
};

type UserReducerActions = LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction;

const userReducer = (prevState = initialState, action: UserReducerActions) => {
  return produce(prevState, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.data = null;
        draft.isLoggingIn = true;
        break;
      case LOG_IN_SUCCESS:
        draft.data = action.data;
        draft.isLoggingIn = false;
        break;
      case LOG_IN_FAILURE:
        draft.data = null;
        draft.isLoggingIn = false;
        break;
      case LOG_OUT:
        draft.data = null;
        break;
      default:
        break;
    }
  });
};

export default userReducer;
```

`reducers/post.ts`

```tsx
import produce from "immer";
import { ADD_POST, AddPostAction } from "../actions/post";

const initialState: string[] = []; // 객체 내부의 빈 배열은 never[]로 타입추론, 그냥 빈 배열은 any[]로 타입추론

const postReducer = (prevState = initialState, action: AddPostAction): string[] => {
  return produce(prevState, (draft) => {
    switch (action.type) {
      case ADD_POST:
        draft.push(action.data);
        break;
      default:
        break;
    }
  });
};

export default postReducer;
```

### Hooks Typing

Class 컴포넌트로 구현한 App 컴포넌트를 Hooks로 변환하면 아래와 같다.

`App.tsx`

```tsx
import * as React from "react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logIn, logOut } from "./actions/user";
import { RootState } from "./reducers";
import { UserState } from "./reducers/user";

const App: FC = () => {
  // useSelector Typing
  const { isLoggingIn, data } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  const onClick = () =>
    dispatch(
      logIn({
        id: "vicky",
        password: "비밀번호",
      })
    );

  const onLogout = () => dispatch(logOut());

  return (
    <div>
      {isLoggingIn ? <div>로그인 중</div> : data ? <div>{data.nickname}</div> : "로그인 해주세요."}
      {!data ? <button onClick={onClick}>로그인</button> : <button onClick={onLogout}>로그아웃</button>}
    </div>
  );
};

export default App;
```

위와 같이 `useSelector`에 타이핑만 해주면 Hooks 컴포넌트는 아주 간단하게 타입정의를 끝낼 수 있다. TypeScript 프로젝트를 할 때에도 Hooks 형태로 개발하는 것이 바람직하다. (코드량이 훨씬 줄어든다.)
