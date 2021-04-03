const { observable, autorun, reaction, action, runInAction } = require("mobx");

const userState = observable({
  isLoggingIn: true,
  data: null,
});

const postState = observable([]);

runInAction(() => {
  postState.push({ id: 1, content: "aa" });
  userState.data = { id: 1, nickname: "vicky" };
});

const state = observable({
  compA: "a",
  compB: 12,
  compC: null,
});

// autorun은 바뀐 것을 감지해주는 역할을 한다.
autorun(() => {
  console.log("changed", state.compA);
});

reaction(
  () => {
    return state.compB; // return 값이 바뀌었을 때만 실행이 된다.
  },
  () => {
    console.log("reaction:", state.compB);
  }
);

const change = action(() => {
  state.compA = 1; // 값을 직접 바꿔주면 dispatch 된다.
});

change();
// 하나의 액션 안에 여러 이벤트를 담을 수 있다.

runInAction(() => {
  state.compB = 2; // 같은 값으로 바꿔주면 update 이벤트는 발생하지 않는다.
});
runInAction(() => {
  state.compC = "c";
});
