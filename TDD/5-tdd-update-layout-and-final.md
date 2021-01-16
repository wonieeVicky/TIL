# 프론트엔드 개발과 TDD

## 5. 변경사항 화면 업데이트 및 최종 정리

`git checkout index.html-3`

```html
<!-- index.html -->
<html>
  <body>
    <button id="btn-decs">-</button
    ><!-- decrease -->
    <span id="counter-display"></span>
    <button id="btn-inc">+</button
    ><!-- increase -->

    <script src="ClickCounter.js"></script>
    <script src="ClickCountView.js"></script>

    <script>
      (() => {
        // 초기값 설정
        const data = { value: 0 };
        // 감소 카운터 모듈 생성
        const counterDesc = App.ClickCounter(data).setCountFn((v) => v - 1);
        // 증가 카운터 모듈 생성
        const counterInc = App.ClickCounter(data);

        // 사용할 돔 엘리먼트 선언
        const updateEl = document.querySelector("#counter-display");
        const btnDesc = document.querySelector("#btn-decs");
        const btnInc = document.querySelector("#btn-inc");

        // 감소 카운터 뷰 모듈 생성
        const descCounterView = App.ClickCountView(counterDesc, { updateEl, triggerEl: btnDesc });
        // 증가 카운터 뷰 모듈 생성
        const incCounterView = App.ClickCountView(counterInc, { updateEl, triggerEl: btnInc });

        // 감소 카운터 뷰에 업데이트 하는 함수 실행 (incCounterView에서 호출해도 된다)
        descCounterView.updateView();
      })();
    </script>
  </body>
</html>
```

위 코드처럼 우리는 감소와 증가가 ±1씩 가능한 상태로 만들었다.
만약 2씩 증가하는 모듈을 만들기 위해서는 어떻게 해야할까? setCountFn 함수를 이용해 오버라이드하면 된다.

```html
<!-- index.html -->
<html>
  <body>
    <button id="btn-decs">-</button>
    <span id="counter-display"></span>
    <button id="btn-inc">+</button>

    <script src="ClickCounter.js"></script>
    <script src="ClickCountView.js"></script>

    <script>
      (() => {
        const data = { value: 0 };
        const counterDesc = App.ClickCounter(data).setCountFn((v) => v - 1);
        // 기존 모듈을 수정하지 않고 override 하는 형식으로 수정이 가능하다!
        const counterInc = App.ClickCounter(data).setCountFn((v) => v + 2);

        const updateEl = document.querySelector("#counter-display");
        const btnDesc = document.querySelector("#btn-decs");
        const btnInc = document.querySelector("#btn-inc");

        const descCounterView = App.ClickCountView(counterDesc, { updateEl, triggerEl: btnDesc });
        const incCounterView = App.ClickCountView(counterInc, { updateEl, triggerEl: btnInc });

        descCounterView.updateView();
      })();
    </script>
  </body>
</html>
```

### 정리

자바스크립트 개발에는 독특한 마음가짐을 가져야 한다.
타입 체크(컴파일러)처럼 다른 프로그래밍 언어가 가지고 있는 단계가 없기 때문에
테스트가 최선이므로 테스트 주도 개발(TDD)에 익숙해져야 한다.
Solid하고 Dry한 코드(Counter, CounterView)가 만들어지므로 견고한 어플리케이션을 만들 수 있다.
