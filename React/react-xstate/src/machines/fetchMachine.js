// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    context: {
      id: "",
      password: "",
      error: null,
    },
    idle: {
      on: {
        UPDATE_ID: {
          actions: assign((context, event) => ({ id: event.data })),
        },
        UPDATE_PASSWORD: {
          actions: assign((context, event) => ({ password: event.data })),
        },
        FETCHING: {
          target: "loading",
        },
      },
    },
    loading: {
      entry: assign((context, event) => ({ error: null })),
      invoke: {
        id: "signUpForm",
        src: (context, event) => signUp(event.data),
        onDone: {
          target: "resolve",
        },
        onError: {
          target: "rejected",
          actions: assign((context, event) => ({ error: event.data })),
        },
      },
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
