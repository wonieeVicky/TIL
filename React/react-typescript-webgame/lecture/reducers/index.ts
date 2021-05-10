import { combineReducers } from "redux";
import userReducer from "./user";
import postReducer from "./post";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});

// reducer에 대한 타입정의는 아래와 같이 한다.
// ReturnType 유틸리티는 함수의 리턴 타입을 가져온다.
export type RootState = ReturnType<typeof reducer>;

export default reducer;
