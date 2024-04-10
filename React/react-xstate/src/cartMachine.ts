import { createMachine } from "xstate";

export const cartMachine = createMachine({
  id: "cart",
  initial: "empty",
  states: {
    empty: {
      on: {
        ADD_ITEM: {
          target: "hold",
        },
      },
    },
    hold: {},
  },
});
