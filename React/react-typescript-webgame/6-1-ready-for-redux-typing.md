# 리덕스 구조 잡기

리덕스 타이핑을 위해 구조를 먼저 잡아본다.
lecture 폴더에 redux와 react-redux 설치, redux 패키지에는 types가 이미 존재하므로 별도로 types를 설치할 필요가 없다. react-redux만 추가로 설치해준다.

```bash
$ npm i redux react-redux
$ npm i @types/react-redux
```

로그인, 로그아웃 액션에 대한 리덕스 기본 구조를 잡아본다.

### store 구현

`store.ts`

```jsx
import { createStore } from "redux";
import reducer from "./reducers";

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};

const store = createStore(reducer, initialState);

export default store;
```

### reducers 구현

`reducers/index.ts`

```jsx
import { combineReducers } from "redux";
import userReducer from "./user";
import postReducer from "./post";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});

export default reducer;
```

`reducers/user.ts`

```jsx
const initialState = {
  isLoggingIn: false,
  data: null,
};

const userReducer = (prevState, action) => {
  switch (action.type) {
    default:
      return prevState;
  }
};

export default userReducer;
```

`reducers/post.ts`

```jsx
const initialState = [];

const postReducer = (prevState, action) => {
  switch (action.type) {
    default:
      return prevState;
  }
};

export default postReducer;
```

### actions 구현

`actions/user.ts`

```jsx
export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";
export const LOG_OUT = "LOG_OUT";

export const logIn = () => {};

export const logOut = () => {
  return {
    type: LOG_OUT,
  };
};
```

`actions/post.ts`

```jsx
export const ADD_POST = "ADD_POST";

export const addPost = (data) => {
  return {
    type: ADD_POST,
    data,
  };
};
```

### redux Provider로 store 주입

`client.tsx`

```jsx
import * as React from "react"; // index.d.ts에서 export default를 지원하지 않으므로 * as를 사용한다.
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```

### App 컴포넌트 상세

`App.tsx`

```jsx
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { logIn, logOut } from "./actions/user";

class App extends Component {
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
        {user.isLoggignIn ? <div>로그인 중</div> : user.data ? <div>{user.data.nickname}</div> : "로그인 해주세요."}
        {!user.data ? (
          <button onClick={this.onClick}>로그인</button>
        ) : (
          <button onClick={this.onLogout}>로그아웃</button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  posts: state.posts,
}); // reselect

const mapDispatchToProps = (dispatch) => ({
  dispatchLogin: (data: { id; password }) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```
