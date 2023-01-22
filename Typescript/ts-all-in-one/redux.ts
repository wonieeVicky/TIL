import { combineReducers, legacy_createStore as createStore } from "redux";

const initialState = {
  user: {
    isLoggingIn: true,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: (state, action) => {},
  posts: (state, action) => {},
});

const store = createStore(reducer, initialState);
