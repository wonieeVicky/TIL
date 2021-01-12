describe("App.ClickCountView", () => {
  let updateEl, clickCounter, view;
  beforeEach(() => {
    // ClickCounter 객체 생성
    clickCounter = App.ClickCounter();
    updateEl = document.createElement("span");
    view = App.ClickCountView(clickCounter, updateEl);
  });

  it("clickCounter를 주입하지 않으면 에러를 던진다", () => {
    const clickCounter = null;
    const updateEl = document.createElement("span");
    // App.ClickCountView(clickCounter, updateEl);
    const actual = () => App.ClickCountView(clickCounter, updateEl);
    expect(actual).toThrowError();
  });

  it("updateEl을 주입하지 않으면 에러를 던진다", () => {
    const clickCounter = App.ClickCounter();
    const updateEl = null;

    const actual = () => App.ClickCountView(clickCounter, updateEl);
    expect(actual).toThrowError();
  });

  describe("updateView()", () => {
    it("ClickCounter의 getValue() 값을 출력한다", () => {
      const counterValue = clickCounter.getValue();
      view.updateView();
      expect(updateEl.innerHTML).toBe(counterValue.toString());
    });
  });
});
