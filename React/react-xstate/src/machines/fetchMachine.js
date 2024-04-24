// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine(
  {
    id: "fetch",
    initial: "idle",
    state: {
      context: {
        id: "",
        password: "",
        error: null,
      },
      idle: {
        // idle 하위에 에러 관리를 위한 state 추가
        state: {
          noError: {},
          errors: {
            // 계층 구조가 필요한 경우, nested states 가능
            states: {
              tooShort: {},
            },
          },
        },
        on: {
          UPDATE_ID: {
            actions: assign((context, event) => ({ id: event.data })),
          },
          UPDATE_PASSWORD: [
            {
              target: ".erros.tooShort",
              cond: "isPasswordShort",
              action: "cachePassword",
            },
            { target: ".noError", actions: "cachePassword" },
          ],
          FETCHING: {
            target: "loading",
            cond: "isAvaliablePasswordLength",
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
  },
  {
    // actions에 호출되는 함수들을 config로 관리하도록 변경
    actions: {
      cachePassword: assign((context, event) => ({
        password: event.data?.password,
      })),
    },
    guards: {
      isPasswordShort: (context, evt) => evt.data?.password.length < 8,
      isAvaliablePasswordLength: (context, evt) =>
        evt.data?.password.length > 7,
    },
  }
);
