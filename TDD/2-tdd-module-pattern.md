# 프론트엔드 개발과 TDD

## 2.모듈 패턴으로 기존 코드 개선하기

### 클릭 카운터 모듈

**ClickCounter**는 카운터 데이터를 다루는 모듈이다.
전역 공간에 있는 counter 변수를 ClickCounter 모듈에 캡슐화하여 관리한다.

- 스펙은 다음과 같다
  - ClickCounter 모듈의
    - getCounter() 는
      - 카운터 값을 반환한다
    - increase() 는
      - 카운터를 1 올린다
    - decrease() 는
      - 카운터를 1 내린다

1.  첫번째 스펙: **ClickCounter 모듈의 getValue()는 카운터 값을 반환한다.**
    `git checkout —force ClickCounter-spec-1`
    (\*force 옵션은 모든 변경사항을 무시하고 브랜치를 이동하는 옵션이다)

        ```jsx
        // ClickCounter.js
        var App = App || {};
        App.ClickCounter = () => {
            let value = 0;
            return {
                getValue() {
                    return value;
                },
            };
        };
        ```

        ```jsx
        // ClickCounter.spec.js
        describe("App.ClickCounter", () => {
            describe("getValue()", () => {
                it("초기값이 0인 카운터 값을 반환한다", () => {
                    const counter = App.ClickCounter();
                    expect(counter.getValue()).toBe(0);
                });
            });
        });
        ```

        `$ open ClickCounter/index.spec.html`
        테스트 코드가 있기 때문에 안심하고 리팩토링을 할 수 있다.
        TDD는 하나의 기능에 대해 Red - Green - Refactor 사이클로 개발한다.

2.  두번째 스펙: **ClickCounter 모듈의 increase()는 카운터 값을 1만큼 증가한다.**

    `git checkout —force ClickCounter-spec-2`

    - 코드 실행 전에 `beforeEach` 함수에 대해 알아보자!

    ```jsx
    // beforeEach 자스민 함수를 이용해 dry한 코드를 작성했다.
    describe("App.ClickCounter", () => {
      let counter;
      beforeEach(() => {
        counter = App.ClickCounter();
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

### 클릭 카운트뷰 모듈

**ClickCountView**는 카운터 데이터가 반영될 돔(DOM)의 역할을 하는 모듈이다.
데이터를 출력하고 이벤트 핸들러를 바인딩하는 일을 담당한다.

- 스펙은 다음과 같다

  - ClickCountView 모듈은
    - 클릭 이벤트가 발생하면 increseAndUpdateView를 실행한다
    - increseAndUpdateView()는
      - ClickCounter의 increase 함수를 실행한다
      - updateView 함수를 실행한다
      - updateEl의 텍스트를 설정한다
    - updateView()는
      - 클릭한적이 없으면 "0"을 출력한다

- ClickCountView 모듈 로직 코드 테스팅
  - 버튼 클릭 이벤트 처리기의 역할
    - 총 클릭 횟수를 저장한 변수값을 증가한다
    - 돔 업데이트 함수 호출
- DOM을 바꾸는 코드 테스팅
- 이벤트 처리기 동작 코드 테스팅
  - 마크업에 할당문을 넣지 말고 모듈 스스로 타깃 요소의 클릭 처리기로 할당할 수 있게 만들자

1. 첫번째 스펙: **ClickCountView 모듈의 updateView()는 카운트 값을 출력한다.**

   `git checkout ClickCountView-spec-1`

   - 데이터를 조회할 ClickCounter를 어떻게 얻어올 수 있을까?

     ⇒ 주입한다. ClickCounter는 객체를 만들어 파라미터로 전달 받는다.

   - 게다가 데이터를 출력할 돔 엘리먼트는 어떻게 테스트할까?

     ⇒ **주입한다.** 데이터를 출력할 돔 엘리먼트도 만들어 전달 받는다.

   TDD 방식으로 사고하다 보면 이런식으로 필요한 **모듈을 주입**받아 사용하는 경향이 생긴다.
   이러한 경향은 하나의 기능 단위로 모듈을 분리할 수 있기 대문에 **단일 책임 원칙**을 지킬 수 있다.

   ```jsx
   // ClickCountView.spec.js
   describe("App.ClickCountView", () => {
     let updateEl, clickCounter, view;

     beforeEach(() => {
       // ClickCounter 객체 생성
       clickCounter = App.ClickCounter();
       updateEl = document.createElement("span");
       view = App.ClickCountView(clickCounter, updateEl);
     });

     describe("updateView()", () => {
       it("ClickCounter의 getValue() 값을 출력한다", () => {
         const counterValue = clickCounter.getValue();
         view.updateView();
         expect(updateEl.innerHTML).toBe(counterValue.toString());
       });
     });
   });
   ```

   ```jsx
   // ClickCountView.js
   var App = App || {};

   App.ClickCountView = (clickCounter, updateEl) => {
     return {
       updateView() {
         updateEl.innerHTML = clickCounter.getValue();
       },
     };
   };
   ```

   ClickCountView에 의존성 주입이 잘되었는지(매개변수 인자가 잘담겨있는지)는 어떻게 체크할 수 있을까?

   - 코드 실행 전에 `toThrowError()` 함수에 대해 알아보자!

   ```jsx
   // ClickCountView.spec.js
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
   ```

   ```jsx
   // ClickCountView.js
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
   ```
