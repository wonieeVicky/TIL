describe("App.ClickCountView 모듈", () => {
  let udpateEl, clickCounter, view;

  beforeEach(() => {
    const data = { value: 0 };
    clickCounter = App.ClickCounter(data);
    updateEl = document.createElement("span");
    triggerEl = document.createElement("button");
    view = App.ClickCountView(clickCounter, { updateEl, triggerEl });
  });

  describe("네거티브 테스트", () => {
    it("ClickCounter를 주입하지 않으면 에러를 던진다", () => {
      const actual = () => App.ClickCountView(null, updateEl);
      expect(actual).toThrowError(App.ClickCountView.messages.noClickCounter);
    });

    it("updateEl를 주입하지 않으면 에러를 던진다", () => {
      const actual = () => App.ClickCountView(clickCounter, { triggerEl });
      expect(actual).toThrowError(App.ClickCountView.messages.noUpdateEl);
    });

    it("triggerEl를 주입하지 않으면 에러를 던진다", () => {
      const actual = () => App.ClickCountView(clickCounter, { updateEl });
      expect(actual).toThrowError(App.ClickCountView.messages.noTriggerEl);
    });
  });

  describe("updateView()", () => {
    it("ClickCounter의 getValue() 실행결과를 출력한다", () => {
      const counterValue = clickCounter.getValue();
      view.updateView();
      expect(updateEl.innerHTML).toBe(counterValue.toString());
    });
  });

  describe("countAndUpdateView()는", () => {
    it("ClickCounter의 count 를 실행한다", () => {
      spyOn(clickCounter, "count");
      view.countAndUpdateView();
      expect(clickCounter.count).toHaveBeenCalled();
    });

    it("updateView를 실행한다", () => {
      spyOn(view, "updateView");
      view.countAndUpdateView();
      expect(view.updateView).toHaveBeenCalled();
    });
  });

  it("클릭 이벤트가 발생하면 countAndUpdateView를 실행한다", () => {
    spyOn(view, "countAndUpdateView");
    triggerEl.click();
    expect(view.countAndUpdateView).toHaveBeenCalled();
  });
});
