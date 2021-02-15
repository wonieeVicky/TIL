# 리듀서 쪼개기

redux 액션을 구현하다보면 이벤트가 많아질수록 reducer가 매우 길고 복잡해진다.  
따라서 각 액션들을 분류에 맞게 적절하게 분리하여 관리해주는 것이 좋다.

`/reducers/user.js`

```jsx
export const initialState = {
  isLoggedIn: false,
  user: null,
  signUpData: {},
  loginData: {},
};

// Action Creator(액션 함수) : 데이터가 동적으로 주입되도록 구현
export const loginAction = (data) => ({ type: "LOG_IN", data });
export const logoutAction = () => ({ type: "LOG_OUT" });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
      };
    case "LOG_OUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
```

`/reducers/post.js`

```jsx
export const initialState = { mainPosts: [] };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
```

위와 같이 기존의 index.js에서 선언했던 이벤트를 행동에 맞게 분리해주었다.
이제 index.js에서 리듀서를 합쳐주면 된다. 아래의 코드처럼 reducer를 합쳐줄 때에는 redux에서 제공하는 `combineReducers`를 사용하여 합쳐주며, 초기 SSR을 위한 HYDRATE 옵션은 Index 요소에 넣어준다.

기존에 선언했던 initialState는 별도로 합쳐줄 필요없이 combineReducers 동작 시 함께 합쳐지니 참고하자.

```jsx
import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

// combineReducers로 reducer를 합쳐줄 때 각 initialState는 알아서 합쳐진다.
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      // HYDRATE 옵션은 SSR을 위해 추가된 요소이다.
      case HYDRATE:
        console.log("HYDRATE:", action);
        return { ...state, ...action.payload };
      // 초기 렌더링 시 리듀서가 실행되면서 state가 Undefined 되므로 반드시 initialState를 리턴해준다.
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
```

이제 분리한 액션함수들을 사용하는 컴포넌트에도 경로를 반영해주어야 한다.

`LoginForm.js`

```jsx
import { loginAction } from "../reducers/user";
```

`UserProfile.js`

```jsx
import { logoutAction } from "../reducers/user";
```
