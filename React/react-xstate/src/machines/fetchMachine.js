// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine(
  {
    id: "fetch",
    // initial: "idle",
    state: {
      // context: {
      //   id: "",
      //   password: "",
      //   error: null,
      // },
      idle: {
        type: "parallel", // 추가 및 하위 id, password 에러 상태를 병렬로 구성
        states: {
          id: {
            initial: "noError",
            states: {
              noError: {},
              errors: {
                states: {
                  tooShort: {},
                },
              },
            },
          },
          password: {
            initial: "noError",
            states: {
              noError: {},
              errors: {
                states: {
                  empty: {},
                  tooShort: {},
                },
              },
            },
          },
        },
        on: {
          UPDATE_ID: [
            // 상태는 idle 내부의 id, password 병렬 상태로 구성되므로 .id로 표현
            {
              target: ".id.errors.empty",
              cond: "isInputIdEmpty",
              actions: "cacheId",
            },
            {
              target: ".id.noError",
              actions: "cacheId",
            },
          ],
          UPDATE_PASSWORD: [
            {
              target: ".password.errors.empty",
              cond: "isInputPasswordEmpty",
              actions: "cachePassword",
            },
            {
              target: ".password.errors.tooShort",
              cond: "isInputPasswordTooShort",
              actions: "cachePassword",
            },
            { target: ".password.noError", actions: "cachePassword" },
          ],
          FETCHING: [
            {
              target: ".id.errors.empty",
              cond: "isContextIdEmpty",
            },
            {
              target: ".passwrod.errors.empty",
              cond: "isContextPasswordEmpty",
            },
            {
              target: ".password.errors.tooShort",
              cond: "isContextPasswordTooShort",
            },
            {
              target: "loading",
            },
          ],
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
      // guards에는 context와 event를 구분 짓게 나눠본다.
      isContextIdEmpty: (context, _) => context.id?.length === 0,
      isInputIdEmpty: (_, evt) => evt.data?.id.length === 0,
      isPasswordTooShort: (_, evt) => evt.data?.password.length < 8,
      isAvaliablePasswordLength: (_, evt) => evt.data?.password.length > 7,
    },
  }
);
