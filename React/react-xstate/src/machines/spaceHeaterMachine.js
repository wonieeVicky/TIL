// deep history
const spaceHeaterMachine = Machine({
  id: "spaceHeater",
  initial: "poweredOff",
  states: {
    poweredOff: {
      on: { TOGGLE_POWER: "poweredOn.hist" },
    },
    poweredOn: {
      on: { TOGGLE_POWER: "poweredOff" },
      type: "parallel",
      states: {
        heated: {
          initial: "lowHeat",
          states: {
            lowHeat: {
              on: { TOGGLE_HEAT: "lowHeat" },
            },
            highHeat: {
              on: { TOGGLE_HEAT: "highHeat" },
            },
          },
        },
        oscillation: {
          initial: "disabled",
          states: {
            disabled: {
              on: { TOGGLE_OSC: "enabled" },
            },
            enabled: {
              on: { TOGGLE_OSC: "disabled" },
            },
          },
        },
        hist: {
          type: "history", // powerOff 상태를 벗어날 때 직전 상태를 history 타입으로 기억
          history: "deep", // shallow, deep 두 가지 기록 유형이 존재. 최상위 기록 값만 기억하거나 모든 하위 상태를 기억
        },
      },
    },
  },
});
