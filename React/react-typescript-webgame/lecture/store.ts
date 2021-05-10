import { createStore } from "redux";
import reducer from "./reducers";

const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};

const store = createStore(reducer, initialState);

export default store;
