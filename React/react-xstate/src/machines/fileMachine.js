const fileMachine = createMachine({
  // ..
  type: "parallel",
  // initial: ?? // parallel state는 initial state를 가질 수 없다.
  states: {
    upload: {
      initial: "idle",
    },
    download: {
      initial: "idle",
    },
  },
});
