// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    idle: {
      on: {
        FETCHING: {
          target: "loading",
        },
      },
    },
    loading: {
      on: {
        SUCCESS: {
          target: "resolved",
        },
        FAILURE: {
          target: "rejected",
        },
      },
    },
    resolved: {
      type: "final",
    },
    rejected: {},
  },
});
