import { combineReducers, legacy_createStore as createStore } from "redux";

const initialState = {
  user: {
    isLoggingIn: true,
    data: null,
  },
  posts: [],
};

const reducer = combineReducers({
  user: (state, action) => {
    switch (action.type) {
      case "LOG_IN":
        return {
          isLoggingIn: true,
          data: {
            nickname: "vicky",
            password: 1234,
          },
        };
      default:
        return state;
    }
  },
  posts: (state, action) => {
    switch (action.type) {
      case "ADD_POST":
        return [...state, action.data];
      default:
        return state;
    }
  },
});

const store = createStore(reducer, initialState);
store.dispatch({ type: "LOG_IN" });
store.dispatch({ type: "ADD_POST", data: { title: "hello", content: "redux" } });
store.getState();
