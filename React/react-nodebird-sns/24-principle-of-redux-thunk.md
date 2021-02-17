# redux-thunk 이해하기

Redux-thunk는 리덕스의 미들웨어로 리덕스의 기능을 향상시켜주는 역할을 담당한다.
특히 thunk는 redux가 비동기 액션을 dispatch할 수 있도록 도와주는 역할을 담당한다.

thunk는 프로그래밍 용어로 기존의 서브루틴에 추가적인 연산을 삽입할 때 사용되는 서브루틴을 의미한다. 보통 '지연'의 의미로 많이 사용한다. redux-thunk는 아래의 역할을 수행하도록 만들어준다.

```jsx
const INCREMENT_COUNTER = "INCREMENT_COUNTER";

// 동기 액션 함수
function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

// 비동기 액션 함수
function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}
```

위와 같이 비동기 액션을 thunk로 구현하면 하나의 비동기 액션에서 여러번 dispatch를 할 수 있다. 이러한 점은 기존의 Redux가 가지고 있지 않은 기능으로 기존 Redux 기능에서 더 확장을 시켜준 것이다.

아래와 같이 redux-thunk 파일의 index.js를 보면 실제 코드는 10줄에 그치는 단순한 구조이다.
이렇듯 thunk는 dispatch를 나중에 혹은 한번에 묶어서 동작할 수 있도록 만들어주는 동작방식을 의미한다.

```jsx
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    // action은 원래 객체인데, thunk에서는 action을 function으로 만들어서 지연함수를 만들 수 있는 구조이다.
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

보통 미들웨어는 고차함수 즉 3단함수의 구조를 가지는데, 위 thunk 코드를 착안하여 다양한 커스텀 미들웨어를 만들어 볼 수 있다. 만약 Redux 액션 dispatch를 로깅하는 함수를 만든다고 하자.

```jsx
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action); // 액션을 실행하기 전에 로깅
  return next(action);
};

// middlewares에 커스텀 미들웨어 추가
// 이후 action 실행될 때마다 {type: "LOG_IN", data: {…}} 등의 내용이 콘솔에 찍힌다.
const middlewares = [thunkMiddleware, loggerMiddleware];
```

위와 같이 미들웨어를 만들어서 사용하면 기존 configureStore에서 추가한 `composeWithDevTools`를 대신할 수도 있다. 이와 같이 thunk의 개념을 통해 redux의 기능을 middlewares로 확장시켜나갈 수 있다.

이제 thunk를 NodeBird에 넣어 대입해보자. 구현은 아니고 적용 정도만 진행

```bash
$ npm i redux-thunk
```

`/store/configureStore.js`

```jsx
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import reducer from "../reducers";

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
};

const configureStore = () => {
  // middlewares에 thunkMiddleware 적용, 추가적으로 커스텀 미들웨어도 추가 가능함
  const middlewares = [thunkMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);
  return store;
};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === "development" });
export default wrapper;
```

먼저 실제 웹서비스 구현 시 action은 단순한 구조가 Request, Success, Failure 이렇게 세 가지로 만들어진다. 실제 웹에서 발생하는 모든 이벤트는 기록들이 api로 서버와 통신하는 구조이기 때문이다. 따라서 user.js에서 만든 기존 loginAction과 logoutAction 함수는 아래와 같이 변경할 수 있다.

```jsx
// export const loginAction = (data) => ({ type: "LOG_IN", data });
// export const logoutAction = () => ({ type: "LOG_OUT" });

export const loginRequestAction = (data) => ({ type: "LOG_IN_REQUEST", data });
export const loginSuccessAction = (data) => ({ type: "LOG_IN_SUCCESS", data });
export const loginFailureAction = (data) => ({ type: "LOG_IN_FAILURE", data });

export const logoutRequestAction = () => ({ type: "LOG_OUT_REQUEST" });
export const logoutSuccessAction = () => ({ type: "LOG_OUT_SUCCESS" });
export const logoutFailureAction = () => ({ type: "LOG_OUT_FAILURE" });
```

이후 thunk로 action을 비동기 함수로 구현할 경우 아래와 같이 구현한다.
Thunk는 함수 실행 시 함수를 반환하는 구조이며 dispatch를 여러번 할 수 있게 해주는 기능이 전부이다.

```jsx
export const loginAction = (data) => {
  // 함수 실행 시 함수를 반환하며, dispatch를 한번에 여러개 실행할 수 있도록 함
  return (dispatch, getState) => {
    const state = getState();
    dispatch(loginRequestAction());
    axios
      .post("/api/login")
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      });
  };
};
```

왜 redux-saga를 사용하는가?

thunk의 경우 위 코드와 같이 dispatch를 여러번 발생시키는 기능이 전부이므로 이외의 기능은 모두 직접 구현해야하는 점 때문이다. 예를 들어 dispatch를 delay하려면 setTimeout 함수로 직접 구현해야 한다.

```jsx
export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    setTimeout(() => {
      dispatch(loginRequestAction());
    }, 2000);
  };
};
```

그러나 saga는 이러한 delay 메서드를 자체적으로 제공한다. 또 실수 두 번 클릭했을 때 thunk는 두번 api request가 실행되지만 saga는 take latest라는 기능으로 가장 마지막 요청을 실행시킨다. 그 외에도 debounce, throttle 등의 기능을 자체적으로 제공하므로 복잡한 액션이 발생할 경우 sage를 이용한다.
