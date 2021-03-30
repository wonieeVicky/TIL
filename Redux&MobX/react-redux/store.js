const { createStore, applyMiddleware, connect } = require('redux');
const { composeWithDevTools } = require('redux-devtools-extension');
const reducer = require('./reducers');

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};
const firstMiddleware = (store) => (dispatch) => (action) => {
  console.log('로깅:', action);
  dispatch(action);
};

const thunkMiddleware = (store) => (dispatch) => (action) => {
  // 비동기인 경우 action을 function으로 처리
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return dispatch(action);
};

const enhancer =
  process.env.NODE_ENV === 'production'
    ? connect(applyMiddleware(firstMiddleware, thunkMiddleware))
    : composeWithDevTools(applyMiddleware(firstMiddleware, thunkMiddleware));

const store = createStore(reducer, initialState, enhancer);

module.exports = store;
