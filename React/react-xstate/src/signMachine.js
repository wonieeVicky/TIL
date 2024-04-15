import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

/**
 * 인증 도메인 상태 정의
 * selection > email or oauth > registry > done
 */
export const signMachine = createMachine({
  id: "sign",
  initial: "selection",
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
});

const [state, send, service] = useMachine(signMachine);
const currentState = state.value;
const onSend = () => send("REGISTRY");
