# react-redux

리덕스는 데이터를 어떻게 구조화하느냐에 따라 코드의 방향과 전체적인 구조가 달라진다.
같은 성격의 이벤트끼리 묶어서 그룹화시키는 것이 핵심이다!

- redux에서 관리하는 데이터가 많아지면 메모리 부하가 발생하지 않을까?
- 클래스 컴포넌트와 함수형 컴포넌트 중 뭐가 더 좋은지 그 이유에 대해서 설명해주세요

## redux 분리 및 combineReducers 적용

### combineReducer로 리듀서 분리

reducer를 별도의 파일로 분리한다. reducer는 분리하기가 쉬운데 그 이유는 순수함수이기 때문이다.
(순수함수란 주어진 매개변수와 함수 내부에서 선언한 변수를 제외하고 다른 값을 참조하지 않는 함수이다)

`reducers/post.js`

```jsx
const initialState = [];

const postReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case 'ADD_POST':
      return [...prevState, action.data];
    default:
      return prevState;
  }
};

module.exports = postReducer;
```

`reducers/user.js`

```jsx
const initialState = {
  isLoggingIn: false,
  data: null,
};

const userReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        isLoggingIn: !prevState.isLoggingIn,
        data: action.data,
      };
    case 'LOG_OUT':
      return {
        isLoggingIn: !prevState.isLoggingIn,
        user: null,
      };
    default:
      return prevState;
  }
};

module.exports = userReducer;
```

`reducers/index.js`

분리한 리듀서를 index.js에서 `combineReducers`로 merge해준다.

```jsx
const { combineReducers } = require('redux');
const userReducer = require('./user');
const postReducer = require('./post');

module.exports = combineReducers({
  user: userReducer,
  posts: postReducer,
});
```

### Action 함수 분리

action도 reducers와 비슷하게 actions 폴더로 같은 성격의 데이터로 분리하여 보관한다.

`actions/user.js`

```jsx
const logIn = (data) => ({ type: 'LOG_IN', data });
const logOut = () => ({ type: 'LOG_OUT' });

module.exports = { logIn, logOut };
```

`actions/posts.js`

```jsx
const addPost = (data) => ({ type: 'ADD_POST', data });

module.exports = { addPost };
```

### 분리한 데이터 호출해오기

`index.js`

```jsx
const { createStore } = require('redux');
const reducer = require('./reducers');
const { logIn, logOut } = require('./actions/user');
const { addPost } = require('./actions/post');

const initialState = {
  user: {
    isLogginIn: false,
    data: null,
  },
  posts: [],
};

const store = createStore(reducer, initialState);
store.subscribe(() => console.log('changed!'));

console.log('1:', store.getState());

// -------------------------------------------------------

store.dispatch(logIn({ id: 1, name: 'vicky', admin: true }));
store.dispatch(addPost({ userId: 1, id: 1, content: 'hi redux!' }));
store.dispatch(addPost({ userId: 1, id: 2, content: 'seconds redux :)' }));
store.dispatch(logOut());

console.log('2:', store.getState());
```

## redux middleware

리덕스는 기본적으로 액션이 모두 동기이다. 액션이 일반 객체이고, dispatch는 객체를 받아서 update를 해주는 역할을 하기 때문에 비동기가 들어갈 틈이 없음. 이럴 때 사용하는 것이 **미들웨어**이다. 미들웨어는 dispatch와 리듀서의 사이에서 동작한다. 많이 사용되는 redux 미들웨어로 redux-thunk와 redux-saga가 있음

미들웨어는 대표적으로 비동기 액션을 위해 사용되어지나 비동기'만'을 위한 것은 아니며, **dispatch와 리듀서 사이**에서 어떤 동작이든 처리할 수 있도록 도와준다. 대표적으로 액션 로깅도 미들웨어로 구현할 수 있다.

```jsx
const firstMiddleware = (store) => (dispatch) => (action) => {
  console.log('미들웨어 로깅 시작:', action);
  // 기능 추가
  dispatch(action);
  // 기능 추가
  console.log('미들웨어 로깅 끝');
};
const enhancer = applyMiddleware(firstMiddleware);

const store = createStore(reducer, initialState, enhancer);
store.subscribe(() => console.log('changed!'));

// -------------------------------------------------------

store.dispatch(logIn({ id: 1, name: 'vicky', admin: true }));
store.dispatch(addPost({ userId: 1, id: 1, content: 'hi redux!' }));
store.dispatch(addPost({ userId: 1, id: 2, content: 'seconds redux :)' }));
store.dispatch(logOut());
```

위와 같이 `firstMiddleware`라는 미들웨어를 생성하여 액션 로깅을 해보면 아래의 순서대로 진행되는 것을 확인할 수 있다. 여기서 추가로 알 수 있는 것은 `subscribe`는 미들웨어 동작 후 dispatch 다음 단계에서 동작하는 것을 볼 수 있다.

```bash
미들웨어 로깅 시작: { type: 'LOG_IN', data: { id: 1, name: 'vicky', admin: true } }
changed!
미들웨어 로깅 끝
미들웨어 로깅 시작: { type: 'ADD_POST', data: { userId: 1, id: 1, content: 'hi redux!' } }
changed!
미들웨어 로깅 끝
미들웨어 로깅 시작: { type: 'ADD_POST', data: { userId: 1, id: 2, content: 'seconds redux :)' } }
changed!
미들웨어 로깅 끝
미들웨어 로깅 시작: { type: 'LOG_OUT' }
changed!
미들웨어 로깅 끝
```

위 코드와 같이 미들웨어는 3단 함수의 로직을 가진다.

```jsx
const testMiddleware = (store) => (dispatch) => (action) => {
  dispatch(action);
};
```

## redux-thunk

리덕스 미들웨어 중 가장 많이 사용되는 것 중에 하나가 바로 `redux-thunk`이다. thunk는 action을 함수로 만들어 비동기 로직 등을 dispatch와 리듀서 사이에서 처리할 수 있다.

아래의 코드가 redux-thunk 코드이다. - action이 function으로 처리된 부분을 주의해서 볼 것

```jsx
const thunkMiddleware = (store) => (dispatch) => (action) => {
  // 비동기인 경우 action을 function으로 처리
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return dispatch(action);
};
```

위의 로직을 바탕으로 logIn 이벤트를 비동기로 구현해보자

`actions/user.js`

```jsx
// async action creator (비동기)
const logIn = (data) => {
  return (dispatch, getState) => {
    // async action (비동기 액션)
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(
          logInSuccess({
            userid: 1,
            nickname: 'vicky',
          })
        );
      }, 2000);
    } catch (err) {
      dispatch(logInFailure(err));
    }
  };
};

const logInRequest = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};

const logInSuccess = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  };
};

const logInFailure = (err) => {
  return {
    type: 'LOG_IN_FAILURE',
    err,
  };
};

// sync action Creator (동기)
// const logIn = (data) => ({ type: 'LOG_IN', data });
const logOut = () => ({ type: 'LOG_OUT' });

module.exports = {
  logIn,
  logOut,
};
```

위와 같이 설정 후 index.js 에서 logIn 액션을 dispatch 해주면 비동기 액션이 발생한다.

```jsx
store.dispatch(logIn({ id: 1, name: 'vicky', admin: true }));
```

어려워보이지만 생각보다 간단하다. 그냥 동기 액션을 실행한 뒤(logInRequest) 비동기 작업을 실행하고, 비동기 작업이 완료(logInSuccess) 혹은 실패(logInFailure)했을 때 비동기 작업을 한번 더 실행해주는 개념이다.

이렇게 thunk의 구조를 보면 간단히 비동기 작업을 구현할 수 있을 것처럼 보이지만, 실제 서비스에서는 비동기 사이에서 여러 사이드 이펙트들이 동작하고 복잡하므로 이때는 thunk 만으로는 기능 면에서 부족한 상태가 된다. 그때 이용하는 것이 `redux-saga`이다.

즉 간단한 api작업(비동기)에 는 thunk를 쓰고 복잡한 비동기 처리를 구현해야 할 때에는 saga를 쓰는 것이 효율적이다.

## react-redux

위에 만든 기능을 react에 직접 적용하여 로그인/로그아웃 기능을 구현하면 아래와 같다.

`App.js`

```jsx
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const { logIn, logOut } = require('./actions/user');

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onClick = useCallback(() => dispatch(logIn({ id: 'vicky', password: '0326!!' })), []);
  const onLogout = useCallback(() => dispatch(logOut()), []);

  return (
    <div>
      {user.isLoggingIn ? <div>로그인 중입니다.</div> : user.data ? <div>{user.data.nickname}</div> : '로그인 해주세요'}
      {!user.data ? <button onClick={onClick}>로그인</button> : <button onClick={onLogout}>로그아웃</button>}
    </div>
  );
};

export default App;
```

`reducers/user.js`

```jsx
const { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } = require('../actions/constantAction');

const initialState = {
  isLoggingIn: false,
  data: null,
};

const userReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...prevState,
        isLoggingIn: true,
      };
    case LOG_IN_SUCCESS:
      return {
        ...prevState,
        isLoggingIn: false,
        data: action.data,
      };
    case LOG_IN_FAILURE:
      return {
        ...prevState,
        isLoggingIn: false,
        data: null,
      };
    case 'LOG_OUT':
      return {
        isLoggingIn: false,
        user: null,
      };
    default:
      return prevState;
  }
};

module.exports = userReducer;
```

`actions/user.js`

```jsx
const { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } = require('../actions/constantAction');

// async action creator (비동기)
const logIn = (data) => (dispatch, getState) => {
  // async action (비동기 액션)
  dispatch(logInRequest(data));
  try {
    setTimeout(() => dispatch(logInSuccess({ userid: 1, nickname: 'vicky' })), 2000);
  } catch (err) {
    dispatch(logInFailure(err));
  }
};

// async action (비동기 액션)
const logInRequest = (data) => ({ type: LOG_IN_REQUEST, data });
const logInSuccess = (data) => ({ type: LOG_IN_SUCCESS, data });
const logInFailure = (err) => ({ type: LOG_IN_FAILURE, err });

// sync action Creator (동기)
const logOut = () => ({ type: 'LOG_OUT' });

module.exports = { logIn, logOut };
```

위와 같이 처리하면 로그인 동작의 비동기 처리를 직접 확인할 수 있다.

그런데 하다보면 궁금한 점이 생긴다. 컴포넌트에 직접 비동기 액션을 구현해 넣으면 되지 않을까? 왜 굳이 비동기 액션 크리에이터(Async Action Creator)로 분리하는걸까? 정답은 [그렇게 해도 된다.] 이다. 그렇게 해도 동작하지만 컴포넌트를 유지보수하는데 있어 Action을 하나로 묶어 관리할 수 있는 점은 데이터 처리에 대한 관리를 action과 리듀서가 관리하므로 컴포넌트는 뷰의 로직만 처리하면 되는 것이다.

## redux-devtools 와 connect

### redux-devtools 스토어에 적용

`store.js`

```jsx
const { createStore, applyMiddleware, connect } = require('redux');
const { composeWithDevTools } = require('redux-devtools-extension');
// middlewares....

const enhancer =
  process.env.NODE_ENV === 'production'
    ? connect(applyMiddleware(firstMiddleware, thunkMiddleware))
    : composeWithDevTools(applyMiddleware(firstMiddleware, thunkMiddleware));

// store..
module.exports = store;
```

### 클래스 컴포넌트에서 connect를 활용해 redux 적용해보기

react-redux에서는 클래스 컴포넌트에서 redux를 사용하게 하기 위해 `connect`라는 함수를 제공한다.

```jsx
import React from 'react';
import { connect } from 'react-redux';
const { logIn, logOut } = require('./actions/user');

class App {
  onClick = () => this.props.dispatchLogIn({ id: 'vicky', password: '0326!!' });
  onLogout = () => this.props.dispatchLogOut();

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.isLoggingIn ? (
          <div>로그인 중입니다.</div>
        ) : user.data ? (
          <div>{user.data.nickname}</div>
        ) : (
          '로그인 해주세요'
        )}
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
}); // reselect, user가 바뀌었을 때 posts도 같이 업데이트 된다.

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (data) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

기존에 함수형으로 작업한 App 컴포넌트를 클래스 컴포넌트로 변환하면 위와 같으며, 기존에 `useSelector`와 `useDispatch`로 가져오던 state와 dispatch를 모두 `connect` 함수로 호출해와서 App 컴포넌트를 확장해주는 방법으로 연결한다.

해당 영역에서 어떤 state와 dispatch를 가져올건지 정의하고, 이를 props에 mapping해주면 액션이 실행 가능해진다. 클래스 컴포넌트에서 `connect` 역할을 해주는 방법에서 정말 다양한 추상화 방법이 있으므로 업체별로 코드 구조가 다양해질 수 밖에 없음. 따라서 범용성 면에서 함수형 컴포넌트 보다는 번거로운 구조이다.

## immer

immer는 reducer 함수에서 불변성 처리를 효과적으로 처리할 수 있도록 도와주는 도구이다.
기존에는 immutable.js을 사용했으나 현재는 immer가 훨씬 가독성이 좋은 라이브러리인 듯하다.

immer의 기본적인 개념은 아래와 같다.

```jsx
nextState = produce(prevState, (draft) => {});
```

draft에 복사된 store 객체가 들어오므로 불변성을 고려하지 않고 draft의 값을 바꿔줘도 알아서 불변성이 지켜진 데이터로 얕은 복사처리가 된다. 기존의 reducers 폴더에 있던 userReducer와 postReducer에 immer를 적용시키면 아래와 같다.

`reducers/post.js`

```jsx
const { produce } = require('immer');

const initialState = [];

const postReducer = (prevState = initialState, action) => {
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

module.exports = postReducer;
```

`reducers/user.js`

```jsx
const { produce } = require('immer');
const { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT } = require('../actions/constantAction');

const initialState = {
  isLoggingIn: false,
  data: null,
};

const userReducer = (prevState = initialState, action) => {
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

module.exports = userReducer;
```

기존의 spread operator를 이용해 처리해주던 불변성을 draft를 사용해 직관적으로 변경해주었다.
