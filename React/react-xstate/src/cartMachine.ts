import { createMachine, setup } from "xstate";

// 상태 기계 정의
export const cartMachine = setup({
  types: {
    events: {} as {
      type: "ADD_ITEM";
    },
  },
}).createMachine({
  id: "cart",
  initial: "empty",
  // empty, hold 상태 정의
  states: {
    empty: {
      // 상태 전이를 위한 이벤트 생성
      on: {
        ADD_ITEM: {
          // 이벤트 발생 시 전이될 상태의 이름 - empty에서 ADD_ITEM 이벤트 발생 시 hold 상태로 전이
          target: "hold",
        },
      },
    },
    hold: {},
  },
});
