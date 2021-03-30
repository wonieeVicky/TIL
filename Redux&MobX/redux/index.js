const { createStore } = require("redux");

const initialState = {
  compA: "a",
  compB: 12,
  compC: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "CHANGE_COMP_A":
      return {
        ...prevState,
        compA: action.data,
      };
    case "CHANGE_COMP_B":
      return {
        ...prevState,
        compB: action.data,
      };
    case "CHANGE_COMP_C":
      return {
        ...prevState,
        compC: action.data,
      };
    default:
      return prevState;
  }
};

const store = createStore(reducer, initialState);

store.subscribe(() => {
  // react-redux 안에 기본적으로 들어있다.
  console.log("changed!"); // 화면 바꿔주는 코드는 여기서 실행한다.
});

console.log(store.getState()); // { compA: 'a', compB: 12, compC: null }

// action
const changeCompA = (data) => ({
  type: "CHANGE_COMP_A",
  data,
});

store.dispatch(changeCompA("b"));

console.log(store.getState()); // { compA: 'b', compB: 12, compC: null }
