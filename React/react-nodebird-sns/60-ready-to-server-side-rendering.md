# 서버사이드렌더링 준비하기

이번에는 Next의 특성을 알아보고 서버사이드 렌더링을 준비해보자.  
Next를 사용하는 이유는 서버사이드 렌더링을 편하게 구현해주기 때문에 사용한다.

현재 구현한 노드버드 화면을 새로고침하면 로그인을 한 상태더라도 로그인 input 창이 잠깐 떴다가 로그인 정보를 가져온 이후에 해당 input 창이 사라지고 있다. 왜 그럴까?

```
1번째 호출
브라우저 -> 요청 -> 프론트 서버
	=> 데이터가 빈 상태의 레이아웃을 브라우저에게 반환
2번째 호출
브라우저 -> 요청 -> 프론트 서버(LOAD_MY_INFO_REQUEST) -> 요청 -> 백엔드 서버
	=> 백엔드 서버 -> 데이터 반환 -> 프론트 서버 -> 데이터 반환 -> 브라우저
```

위 flow로 브라우저의 데이터 호출(요청)이 두 번에 나뉘어져 있기 때문이다. 위와 같은 방식을 CSR 즉, 클라이언트 사이드 렌더링이라고 한다. 우리가 원하는 것은 SSR 즉, 서버 사이드 렌더링인데 이 과정은 아래와 같다.

```
1번째 호출
브라우저 -> 요청 -> 프론트 서버(LOAD_MY_INFO_REQUEST) -> 요청 -> 백엔드 서버
	=> 백엔드 서버 -> 데이터 반환 -> 프론트 서버 -> 데이터 반환 -> 브라우저
```

위와 같이 1번의 호출과정에서 백엔드에게 필요한 데이터를 호출하여 가지고와 뿌려주는 방식을 말한다. 위와 같이 설정하면 콘텐츠가 바로 뿌려지므로 초기 로딩 속도가 조금 더 빨라지는 느낌을 받을 수 있다. (컨텐츠가 빨리 보이는 느낌)

먼저 SSR을 구현하려면 몇 가지 설정이 필요한데, 그 전에 변경된 사항을 업데이트 해보자.  
우선, \_app.js에 넣어둔 withReduxSaga를 굳이 넣을 필요가 없게 되었다. 실제 그냥 넣어두어도 되지만 최대한 필요없는 디펜던시는 제거해주는 것이 좋으므로 삭제해준다. (package.json 내 next-redux-saga도 삭제)

`pages/_app.js`

```jsx
import Head from "next/head";
import "antd/dist/antd.css";
// import withReduxSaga from "next-redux-saga"; // delete

import wrapper from "../store/configureStore";

const NodeBird = ({ Component }) => {
  return <>{/* codes.. */}</>;
};

// export default wrapper.withRedux(withReduxSaga(NodeBird));
export default wrapper.withRedux(NodeBird); // withReduxSaga 디펜던시 제거
```

그 다음 초기 화면 새로고침 시 가장 먼저 들어와야할 데이터가 있는 index.js 에 Next 메서드를 사용해 SSR을 설정을 추가해준다.

`pages/index.js`

```jsx
import wrapper from "../store/configureStore";

const Home = () => {
  /* useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []); */

  return <AppLayout>{/* codes.. */}</AppLayout>;
};

// 이 부분이 Home 컴포넌트보다 먼저 실행된다.
export const getServerSideProps = wrapper.getServerSideProps((context) => {
  console.log(context);
  // context 안에 store가 들어있다.
  // 리덕스의 데이터가 처음부터 존재한 상태로 화면이 렌더링 된다.
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
});

export default Home;
```

위와 같이 getServerSideProps를 설정하면 Home 컴포넌트보다 먼저 getServerSideProps이 실행된다. context 안에 store가 들어있으며, context.store에 직접 dispatch 해주는 방식으로 진행된다. 리덕스의 데이터가 처음부터 존재한 상태로 화면에 렌더링된다.

하지만 실제 위와 같이 설정해도 SSR이 정상적으로 동작하지 않는데, 이는 리듀서의 `HYDRATE` 리듀서 설정이 잘못되었기 때문이다. 먼저 next를 사용하면 dispatch 이벤트가 HYDRATE 라는 액션으로 들어간다. 해당 액션의 결과에 대해 리듀서를 확인해보면 기존 user, post로 분리되던 데이터 구조에서 Index 내에 index, user, post가 존재하는 형태. 즉, 해당 리듀서 구조를 기존 구조로 렌더링되게끔 바꿔주어야 한다.

`reducers/index.js`

```jsx
import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};
```

위와 같이 설정 후 화면을 다시 재실행 해보면 이제 user, post 이렇게 두 개의 정보로 나뉘는 것을 확인할 수 있다! 하지만 액션의 상태가 성공으로 반환되지 못하고 loadMyInfoLoading 상태에서 종료되므로 올바르게 액션을 업데이트 해주어야 한다. 이때는 미리 준비된 액션인 redux-saga의 END 메서드를 사용한다.

```jsx
import { END } from "redux-saga";
import wrapper from "../store/configureStore";

const Home = () => {
  return <AppLayout>{/* codes.. */}</AppLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
```

위와 같이 END 메서드를 dispatch 후 async, await으로 configureStore에서 만들어 둔 store.sagaTask에 toPromise()를 반환하면, 모든 데이터가 들어온 뒤에 화면이 그려지게 된다.
