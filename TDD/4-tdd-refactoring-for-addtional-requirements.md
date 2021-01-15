# 프론트엔드 개발과 TDD

## 4. 추가 요구사항도 쉽게 받을 수 있는 코드 만들기

### 클릭 카운터 모듈 리팩토링 - 1

만약 감소 버튼이 추가되어야 하거나 한 번 클릭했을 때 2씩 증가하는 기능 개발이 필요하다면 어떻게 해야할까?
우리는 increase 함수와 비슷하게 decrease 함수가 동작하도록 해야하며, 하나의 공통 데이터로 관리할 필요가 있다.

세번째 스펙: **ClickCounter 모듈은 '하나의 공통 데이터'를 주입받는다.**

`git checkout ClickCounter-spec-3`
공통 데이터를 주입 받기위해 우선 테스트 코드부터 수정해준다.

```jsx
// ClickCounter.spec.js
describe("App.ClickCounter", () => {
  let counter, data; // data 값 추가

  // 초기값 생성 여부 테스트
  it("초기값을 주입하지 않으면 에러를 던진다", () => {
    const actual = () => (counter = App.ClickCounter());
    expect(actual).toThrowError();
  });

  beforeEach(() => {
    data = { value: 0 }; // 초기 값 생성
    counter = App.ClickCounter(data); // 초기 값 대입
  });

  describe("getValue()", () => {
    it("초기값이 0인 카운터 값을 반환한다", () => {
      expect(counter.getValue()).toBe(0);
    });
  });

  describe("increase()", () => {
    it("카운터를 1 올린다", () => {
      const initialValue = counter.getValue();
      counter.increase();
      expect(counter.getValue()).toBe(initialValue + 1);
    });
  });
});
```

그리고 난 뒤 실제 동작 코드에서도 변경 사항을 반영해준다 (초기값 부여)

```jsx
// ClickCounter.js
var App = App || {};

// 인자 값으로 _data 받음
App.ClickCounter = (_data) => {
  if (!_data) throw Error("_data"); // _data가 없으면 에러 발생

  const data = _data; // 데이터 주입

  data.value = data.value || 0; // 데이터의 프로퍼티 값으로 value 부여

  return {
    getValue() {
      return data.value; // 변경 사항 반영
    },

    increase() {
      data.value++; // 변경 사항 반영
    },
  };
};
```

```jsx
// ClickCounterView.spec.js
describe("App.ClickCountView 모듈", () => {
  let udpateEl, clickCounter, view;

  beforeEach(() => {
    const data = { value: 0 }; // data 초기값 설정
    clickCounter = App.ClickCounter(data); // data 초기값 인자로 추가
    // ...
  });

  // ...
});
```

### 클릭 카운터 모듈 리팩토링 - 2

위 리팩토링을 통해 두 개의 클릭 카운터가 하나의 데이터를 공유할 수 있게 되었다.
하지만 여전히 이 데이터를 변경하는 increase 함수는 1씩 증가만 할 수 있다.
우리는 데이터를 감소시키거나 증감의 단위가 2, 3으로 증가될 수 있도록 만들어야 한다.

네번째 스펙: **ClickCounter 모듈의 increase 함수는 대체될 수 있다.**

`git checkout ClickCounter-spec-4`

값을 올릴수도(increase) 있지만 내릴수도(decrease) 있어야 하므로 이름을 increase → count로 변경한다.

```jsx
// ClickCounter.spec.js
describe("App.ClickCounter", () => {
  let counter;
  const data = { value: 0 };

  // ...

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
```

```jsx
// ClickCounter.js
var App = App || {};

App.ClickCounter = (_data) => {
  if (!_data) throw Error("_data");
  const data = _data;
  data.value = data.value || 0;

  return {
    getValue() {
      return data.value;
    },

    // 함수명 변경
    count() {
      data.value++;
    },

    // setCountFn 함수 생성
    setCountFn(fn) {
      this.count = () => (data.value = fn(data.value));
      return this;
    },
  };
};
```
