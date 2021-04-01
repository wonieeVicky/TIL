const { configureStore, getDefaultMiddleware } = require("@reduxjs/toolkit");

const reducer = require("./reducers");

const firstMiddleware = (store) => (dispatch) => (action) => {
  console.log("로깅:", action);
  dispatch(action);
};

const store = configureStore({
  reducer,
  middleware: [firstMiddleware, ...getDefaultMiddleware()], // getDefaultMiddleware 기본 미들웨어 추가
  devTools: process.env.NODE_ENV !== "production",
  // enhancer
  // preloadedState, // SSR용 설정
});

module.exports = store;
