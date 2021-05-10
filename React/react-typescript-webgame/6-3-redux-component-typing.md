# redux component typing

리덕스 컴포넌트 App에 대한 타이핑을 해보면 아래와 같다.

`App.tsx`

```tsx
import * as React from "react";
import { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { logIn, logOut } from "./actions/user";
import { RootState } from "./reducers";
import { UserState } from "./reducers/user";

// 1. Props Typing - State와 Dispatch를 분리하여 타입 정의
interface StateToProps {
  user: UserState;
}
interface DispatchToProps {
  dispatchLogIn: ({ id, password }: { id: string; password: string }) => void;
  dispatchLogOut: () => void;
}

// 2. 각 State, Dispatch 타입 정의를 &을 사용하여 merge
class App extends Component<StateToProps & DispatchToProps> {
  onClick = () => {
    this.props.dispatchLogIn({
      id: "vicky",
      password: "비밀번호",
    });
  };

  onLogout = () => {
    this.props.dispatchLogOut();
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.isLoggingIn ? <div>로그인 중</div> : user.data ? <div>{user.data.nickname}</div> : "로그인 해주세요."}
        {!user.data ? (
          <button onClick={this.onClick}>로그인</button>
        ) : (
          <button onClick={this.onLogout}>로그아웃</button>
        )}
      </div>
    );
  }
}

// 3. mapStateToProps 매개변수에 들어가는 state는 combineReducers된 reducer를 의미한다.
// 이때, user와 posts에 대한 타입정의를 어떻게 가져올까? reducers/index.ts의 RootState 타입 참고!
const mapStateToProps = (state: RootState) => ({
  user: state.user,
  posts: state.posts,
}); // reselect

// { id: string, password: string } 은 중복되는 타입정의이므로 한 곳에서 관리하고 재사용하면 좋다.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLogin: (data: { id: string; password: string }) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

`reducers/index.ts`

combineReducers를 통해 도출된 reducer의 타입정의는 아래와 같이 해준다.

```tsx
import { combineReducers } from "redux";
import userReducer from "./user";
import postReducer from "./post";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});

// ReturnType 유틸리티는 함수의 리턴 타입을 가져온다.
// reducer의 type을 가져와 리턴타입으로 넣는다는 의미임
export type RootState = ReturnType<typeof reducer>;

export default reducer;
```
