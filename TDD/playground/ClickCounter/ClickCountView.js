var App = App || {};

App.ClickCountView = (clickCounter, updateEl) => {
  if (!clickCounter) {
    throw Error("clickCounter");
  }
  if (!updateEl) {
    throw Error("updateEl");
  }
  return {
    updateView() {
      updateEl.innerHTML = clickCounter.getValue();
    },
  };
};
