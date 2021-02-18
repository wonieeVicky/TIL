# saga 설치하고 generator 이해하기

## redux-saga 설치

테스트를 위해 설치한 redux-thunk 삭제 후 실제 구현할 redux-saga, next-redux-saga를 설치한다.

```bash
$ npm rm redux-thunk
$ npm i redux-saga
$ npm i next-redux-saga
```

`/store/createStore.js`

```jsx
import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-thunk";

import reducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
};

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware(); // saga setting
  const middlewares = [sagaMiddleware, loggerMiddleware]; // saga setting

  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);

  store.sagaTask = sagaMiddleware.run(rootSaga); // saga setting
  return store;
};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === "development" });
export default wrapper;
```

`/pages/_app.js`

```jsx
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import Head from "next/head";
import withReduxSaga from "next-redux-saga";

import wrapper from "../store/configureStore";

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(NodeBird)); // saga hoc setting
```

## generator 이해하기

saga를 활용하기 전에 제너레이터를 먼저 이해해야 한다. 제너레이터는 함수에 \*가 붙은 것으로 자세한 내용은 함수형 프로그래밍 공부했던 내용 중 [3. Generator & Iterator](https://www.notion.so/3-Generator-Iterator-cddf9f28c45642859f7e874b31e0084a) 요기를 참조하자.

- 제너레이터: 이터레이터이자 이터러블을 생성하는 함수
  - 자바스크립트는 제너레이터를 통해서 어떠한 상태(혹은 값)든 순회할 수 있는 이터러블을 만들 수 있다.

```jsx
// 일반함수에 *을 붙여 generator를 만들고, generator는 iterator를 반환한다.
const gen = function* () {
  console.log(1);
  yield 11;
  console.log(2);
  yield 22;
  console.log(3);
  yield;
  console.log();
  yield 44;
};

const generator = gen();
generator; // gen {<suspended>}
generator.next();
// 1
// { value: 11, done: false }
generator.next();
// 2
// { value: 22, done: false }
generator.next();
// 3
// { value: undefined, done: false }
generator.next();
// 4
// { value: 44, done: false }
generator.next();
// { value: undefined, done: true }
```

위 generator를 `next()`로 실행시켜보면 `yield`라는 중단점을 기준으로 나뉘어 실행되는 것을 알 수 있다.  
즉 **제너레이터 함수는 중단점이 있는 함수**라고 이해하면 쉽다. 위의 이론을 기반으로 redux-saga가 만들어졌다.

또한 generator를 통해 무한의 개념을 표현하는 함수를 구현할 수도 있다. 아래의 코드를 보면 일반 함수에서는 브라우저를 먹통으로 만들어버리는 무서운 코드이지만 제너레이터 함수에서는 절대 멈추지 않는 코드로 동작한다. (무한의 개념을 표현)

```jsx
let i - 0
const gen = function* (){
	while(true){
		yield i++;
	}
}

const g = gen();
g.next(); // { value: 0, done: false }
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: 3, done: false }
```

어떤 특정 코드를 클릭했을 때 `g.next()`를 실행하면 이벤트리스너의 역할을 하게되는 개념이다. saga는 이러한 개념을 착안하여 비동기 액션을 dispatch하도록 구현했고, 때문에 saga에서는 절대 멈추지 않는 제너레이터 기능을 지원할 수 있게되었다.
