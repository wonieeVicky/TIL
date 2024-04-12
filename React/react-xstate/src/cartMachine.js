import { createMachine } from "xstate";

// // 상태 기계 정의
export const cartMachine = createMachine(
  {
    id: "cart",
    initial: "empty",
    context: {
      items: [],
    },
    // empty, hold 상태 정의
    states: {
      empty: {
        // 상태 전이를 위한 이벤트 생성
        on: {
          ADD_ITEM: {
            // 이벤트 발생 시 전이될 상태의 이름 - empty에서 ADD_ITEM 이벤트 발생 시 hold 상태로 전이
            target: "hold",
            actions: ["addItem"], // actions 객체에 정의된 액션 목록 중 실행될 액션 목록을 선언: addItem
          },
        },
      },
      hold: {},
    },
  },
  {
    /**
     * 1. actions 객체 생성 - 액션을 정의
     * createMachine의 두 번째 인자로 정의됨
     * 추가된 액션: addItem
     */
    actions: {
      addItem: ({ context, event }) => {
        console.log(context.items, event.item);
        context.items.push(event.item);
      },
    },
  }
);
