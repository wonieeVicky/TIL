import { createMachine } from "xstate";

interface User {}

interface UserContext {
  user: User | null;
}

export type UserEvent =
  | { type: "OAUTH" }
  | { type: "EMAIL" }
  | { type: "EMAIL" }
  | { type: "CLEAR" }
  | { type: "REGISTRY"; user: User }
  | { type: "DONE" }
  | { type: "BACK" };

/**
 * 인증 도메인 상태 정의
 * selection > email or oauth > registry > done
 */
export const signMachine = createMachine<UserContext, UserEvent>(
  {
    id: "sign",
    initial: "selection",
    predictableActionArguments: true,
    context: {
      user: null,
    },
    states: {
      // 인증 유형 선택
      selection: {
        on: {
          REGISTRY: {
            target: "registry",
            actions: "updateUser",
          },
          OAUTH: {
            target: "oauth",
          },
          EMAIL: {
            target: "email",
          },
        },
      },
      // 이메일 인증
      email: {
        on: {
          CLEAR: {
            target: "selection",
          },
          REGISTRY: {
            target: "registry",
            actions: "updateUser",
          },
          DONE: {
            target: "done",
          },
        },
      },
      // 소셜 로그인
      oauth: {
        on: {
          CLEAR: {
            target: "selection",
          },
        },
      },
      // 등록 완료(이메일 등록 후 서버에 사용자 정보가 등록된 상태)
      registry: {
        on: {
          CLEAR: {
            target: "done",
          },
          BACK: {
            target: "email",
          },
        },
      },
      // 초기화
      done: {
        type: "final",
      },
    },
  },
  {
    action: {
      updateUser: ({ context, payload }) => {
        const copyContext = { ...context };
        if (payload.type === "REGISTRY") {
          const { user } = payload;
          localStorage.setItem("user", JSON.stringify(user));
          copyContext.user = user;
        }
      },
    },
  }
);

export type SignMachineType = typeof signMachine;
// const [state, send, service] = useMachine(signMachine);
// const currentState = state.value;
// const onSend = () => send("REGISTRY");
