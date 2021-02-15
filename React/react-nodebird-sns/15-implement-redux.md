# 리덕스 실제 구현하기

이제 리듀서를 구현해 볼 차례이다.

리듀서는 reducers 폴더 안에 index.js를 생성하여 작업하며 rootReducer를 기존에 만들었던store(configureStore)에 적용하여 구현한다. 리듀서는 초기값(initialState), 액션함수, 리듀서로 구성되어있다. (아래 코드 참고)

- 초기 값은 객체형태의 데이터로 초기 작업 시에 필요한 데이터에 대한 초기 값을 설정해놓는 것이 좋다.
- 액션함수(Action Creator)는 보통 데이터가 동적으로 주입되도록 구현한다.
  비동기 액션함수(async action creator)가 필요한 순간이 오면 redux-saga나 redux-thunk로 구현한다.
- 리듀서는 Switch 문이 포함된 함수로 이전상태와 액션을 인자로 받아 다음 상태를 도출하는 역할을 담당한다.

이렇게 만들어진 액션 함수를 각 컴포넌트에서 `store.dispatch(login("wonny"));` 와 같은 방법으로
사용하면 해당 액션을 디스패치하고 있던 모든 컴포넌트에 데이터 업데이트가 발생한다.

`/reducers/index.js`

```jsx
// initial state
const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

// Action Creator
export const loginAtion = (data) => ({ type: "LOG_IN", data });
export const logoutAction = () => ({ type: "LOG_OUT" });

// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
  }
};

export default rootReducer;
```

이제 위 설정에 따라 실제 컴포넌트에 리덕스를 적용해볼 차례이다. 해당 작업 전 react-redux를 설치해주자

```bash
$ npm i react-redux
```

`/container/AppLayout.js`

```jsx
import React from "react";
import { useSelector } from "react-redux";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const AppLayout = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.user.isLoggedIn);

  return (
    <div>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
      </Row>
    </div>
  );
};

export default AppLayout;
```

기존의 useState 구문이 모두 redux로 대체되면서 UserProfile, LoginForm에 상속해주던 setState 함수도 모두 삭제 처리해준다. state를 가져올 때에는 useSelector로 state를 가져오면 된다.

하위 컴포넌트들은 모두 useDispatch를 통해 action이 발생하도록 처리해준다.

`/container/LoginForm`

```jsx
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../reducers";

const LoginForm = () => {
  const dispatch = useDispatch();

  // action Dispatch
  const onSubmitForm = useCallback(() => dispatch(loginAction({ id, password })), [id, password]);

  return <FormWrapper onFinish={onSubmitForm}>{/* ...codes */}</FormWrapper>;
};

export default LoginForm;
```

`/container/UserProfile`

```jsx
import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../reducers";

const UserProfile = () => {
  const dispatch = useDispatch();
  const onLogout = useCallback(() => dispatch(logoutAction()), []);
  return (
    <>
      {/* ...codes */}
      <Button onClick={onLogout}>로그아웃</Button>
    </>
  );
};

export default UserProfile;
```
