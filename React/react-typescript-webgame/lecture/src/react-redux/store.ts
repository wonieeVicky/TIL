import { createStore, MiddlewareAPI, Dispatch, AnyAction, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};

// 함수가 분리되어있으면 타이핑을 해야한다. 미들웨어는 아래와 같이 타이핑을해준다.
const firstMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  console.log("로깅:", action);
  next(action);
};

const thunkMiddleware = (store: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: any) => {
  if (typeof action === "function") {
    // 비동기
    return action(store.dispatch, store.getState);
  }
  return next(action); // 동기
};

// 미들웨어 장착
const enhance =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware(firstMiddleware, thunkMiddleware))
    : composeWithDevTools(applyMiddleware(firstMiddleware, thunkMiddleware));
const store = createStore(reducer, initialState, enhance);

export default store;
