# action, reducer 타이핑

먼저 Redux의 action과 Reducer 타이핑을 해보면 아래와 같다.

`actions/post.ts`

```tsx
export const ADD_POST = "ADD_POST" as const; // as const로 타입 고정

// action에 대한 interface 타입 정의
export interface AddPostAction {
  type: typeof ADD_POST;
  data: string;
}

// action Typing
export const addPost = (data: string): AddPostAction => {
  return {
    type: ADD_POST,
    data,
  };
};
```

`reducers/post.ts`

```tsx
// actions의 액션 상수와 interface import
import { ADD_POST, AddPostAction } from "../actions/post";

// 객체 내부의 빈 배열은 never[]로 타입추론, 그냥 빈 배열은 any[]로 타입추론
const initialState: string[] = [];

// reducer typing
const postReducer = (prevState = initialState, action: AddPostAction): string[] => {
  switch (action.type) {
    case ADD_POST:
      return [...prevState, action.data];
    default:
      return prevState;
  }
};

export default postReducer;
```

`actions/user.ts`

```tsx
// as const 타입 고정
export const LOG_IN_REQUEST = "LOG_IN_REQUEST" as const;
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS" as const;
export const LOG_IN_FAILURE = "LOG_IN_FAILURE" as const;
export const LOG_OUT = "LOG_OUT" as const;

// action interface 타입 정의
export interface LogInRequestAction {
  type: typeof LOG_IN_REQUEST;
  data: {
    id: string;
    password: string;
  };
}
export interface LogInSuccessAction {
  type: typeof LOG_IN_SUCCESS;
  data: {
    userId: string;
    nickname: string;
  };
}
export interface LogInFailureAction {
  type: typeof LOG_IN_FAILURE;
  error: Error;
}
export interface LogOutAction {
  type: typeof LOG_OUT;
}

// action Typing
export const logIn = (data: { id: string; password: string }) => {};
export const logOut = () => ({ type: LOG_OUT });
```

`reducers/user.ts`

```tsx
// actions의 액션 상수와 interface import
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

// initialState에 대한 interface 타입정의
export interface UserState {
  isLoggingIn: boolean;
  data: {
    nickname: string;
  } | null;
}

// initialState Typing
const initialState: UserState = {
  isLoggingIn: false,
  data: null,
};

// Actions 함수 타입 정의
type UserReducerActions = LogInRequestAction | LogInSuccessAction | LogInFailureAction | LogOutAction;

// reducer Typing
const userReducer = (prevState = initialState, action: UserReducerActions) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
    case LOG_IN_SUCCESS:
    case LOG_IN_FAILURE:
      return;
    case LOG_OUT:
      return {
        ...prevState,
        data: null,
      };
    default:
      return prevState;
  }
};

export default userReducer;
```
