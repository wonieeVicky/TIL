# redux

## 1. 리덕스의 필요성에 대하여

리덕스는 상태관리 도구다. 리액트 뿐만 아니라 뷰, 앵귤러에서도 쓸 수 있음. 그러나 뷰나 앵귤러에서는 사용하는 주 상태관리 도구가 있기 때문에 리액트에서 주로 많이 쓰이고 있음. 리덕스는 단방향으로 데이터를 처리하며, 하나의 상태를 최상위(글로벌)에서 관리하여 서로 떨어져 있는 컴포넌트 간 state 공유를 간편하게 하기 위해 사용한다.

## 2. action과 리덕스 장단점

리덕스는 action을 묶어 state 객체를 어떻게 변경할 건지 정의한 후 dispatch로 변경 처리해주는 것만 반복한다. 또한, 데이터 변경 시 변경사항을 모두 history로 기록하여, 당시 처리 과정(timemachine)으로 돌아가서 확인할 수도 있음. 따라서 유지보수 면에서 매우 효율적이고, 상대적으로 에러가 적게나는 편이다.

단점은 모든 state 변경에 대한 action 정의를 미리해두어야 함. 또한 에러처리에 대한 타임머신을 위해서는 데이터의 불변성을 지켜줘야 하므로, 매번 새로운 객체를 복사하여 사용해야 하므로 이 또한 단점이다.

## 3. action 생성, 리듀서, 불변성과 subscribe

```jsx
const { createStore } = require('redux');

// 초기 state 정의
const initialState = {
  user: null,
  posts: [],
};

// 리듀서 정의 - 불변성
const reducer = (prevState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...prevState,
        user: action.data,
      };
    case 'LOG_OUT':
      return {
        ...prevState,
        user: null,
      };
    case 'ADD_POST':
      return {
        ...prevState,
        posts: [...prevState.posts, action.data],
      };
    default:
      return prevState;
  }
};

// 스토어 초기화
const store = createStore(reducer, initialState);

// subscribe로 액션 변경 감지(뷰 변경 발생)
store.subscribe(() => {
  console.log('changed!');
});

console.log('1:', store.getState()); // { user: null, posts: [] }

// -------------------------------------------------------

// action 생성
const logIn = (data) => ({ type: 'LOG_IN', data });
const logOut = () => ({ type: 'LOG_OUT' });
const addPost = (data) => ({ type: 'ADD_POST', data });

// action 실행
store.dispatch(logIn({ id: 1, name: 'vicky', admin: true }));
store.dispatch(addPost({ userId: 1, id: 1, content: 'hi redux!' }));
store.dispatch(logOut());

console.log('2:', store.getState()); // { user: null, posts: [ { userId: 1, id: 1, content: 'hi redux!' } ] }
```
