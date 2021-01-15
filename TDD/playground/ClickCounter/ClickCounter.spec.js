describe("App.ClickCounter", () => {
  let counter;
  const data = { value: 0 };

  it("초기값을 주입하지 않으면 에러를 던진다", () => {
    const actual = () => (counter = App.ClickCounter());
    expect(actual).toThrowError();
  });

  beforeEach(() => (counter = App.ClickCounter(data)));

  describe("getValue()", () => {
    it("초기값이 0인 카운터 값을 반환한다", () => {
      expect(counter.getValue()).toBe(0);
    });
  });

  describe("count()", () => {
    it("카운터를 1 올린다", () => {
      const initialValue = counter.getValue();
      counter.count();
      expect(counter.getValue()).toBe(initialValue + 1);
    });
  });

  describe("setCountFn()", () => {
    it("인자로 함수를 넘기면 count()를 대체한다", () => {
      const add2 = (value) => value + 2; // 바꿔치기할 함수 생성
      const expected = add2(data.value);
      counter.setCountFn(add2).count(); // setCountFn으로 함수 전달
      const actual = counter.getValue();
      expect(actual).toBe(expected); // 제대로 동작하는지 확인
    });
  });
});
