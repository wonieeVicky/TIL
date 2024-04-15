import { assign, createMachine } from "xstate";

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
            // 이벤트 발생 시 전이될 상태의 이름 - empty에서 ADD_ITEM 이벤트 발생 시 hold 상태로 전이 (1회 실행 후 hold 상태로 전이)
            target: "hold",
            actions: ["addItem"], // actions 객체에 정의된 액션 목록 중 실행될 액션 목록을 선언: addItem
          },
        },
      },
      hold: {
        // Eventless Transition: hold 상태에서 hold 상태로 전이될 때 실행되는 액션(항상 실행되는 always 액션)
        always: [
          {
            target: "empty",
            cond: "isEmpty",
          },
          { target: "full", cond: "isFull" },
        ],
        on: {
          // 자기 전이(hold -> hold) - ADD_ITEM 이벤트 발생 시 hold 상태로 전이
          ADD_ITEM: {
            actions: ["addItem"],
          },
          RESET_ITEMS: {
            target: "empty",
            actions: ["resetItems"],
          },
          // REMOVE_ITEM 이벤트가 발생하면 다시 Hold 상태로 자기 전이하므로 target은 필요없다.
          REMOVE_ITEM: {
            actions: ["removeItem"],
          },
        },
      },
    },
  },
  {
    /**
     * 1. actions 객체 생성 - 액션을 정의
     * createMachine의 두 번째 인자로 정의됨
     * 추가된 액션: addItem
     */
    actions: {
      // addItem: ({ context, event }) => context.items.push(event.item),
      // assign 함수를 사용하여 items 배열에 새로운 아이템 추가 - 불변성 유지
      addItem: assign({
        items: ({ context, event }) => [...context.items, event.item],
      }),
      // context, event에 접근하지 않아도 될 경우 값이나 리터럴을 그대로 사용해도 된다.
      resetItems: assign({ items: [] }),
      removeItem: assign({
        items: ({ context, event }) =>
          context.items.filter((item) => item !== event.name),
      }),
    },

    /**
     * 2. guards 객체 생성 - 가드를 정의
     * createMachine의 두 번째 인자로 정의됨
     * 상황을 판단하는 함수를 따로 정의하여 가드로 사용, 재사용에 용의
     */
    guards: {
      isEmpty: ({ context }) => context.items.length === 0,
      isFull: ({ context }) => context.items.length >= 5,
    },
  }
);
