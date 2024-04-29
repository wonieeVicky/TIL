export const snackbarMachine = createMachine(
  {
    id: "snackbar",
    initial: "invisible",
    context: {
      severity: undefined,
      message: undefined,
    },
    states: {
      invisible: {
        entry: "resetSnackbar",
        on: { SHOW: "visible" },
      },
      visible: {
        entry: "setSnackbar",
        on: { HIDE: "invisible" },
        after: {
          // 3초 후 invisible 상태로 변경
          3000: "invisible",
        },
      },
    },
  },
  {
    actions: {
      setSnackbar: assign((ctx, evt) => ({
        severity: evt.severity,
        message: evt.message,
      })),
      resetSnackbar: assign({
        severity: undefined,
        message: undefined,
      }),
    },
  }
);
