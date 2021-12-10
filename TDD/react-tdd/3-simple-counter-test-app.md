## 카운터 앱 TDD로 구현하기

### 테스트 주도 개발(Test Driven Development)

실제 코드를 작성하기 전에 테스트 코드를 먼저 작성하여 개발하는 방식,
테스트 코드를 Pass 할 수 있는 실제 코드를 작성하는 것이 포인트이다.

원하는 기능의 테스트 코드 작성 → 테스트 실행(Fail) → 테스트 코드에 맞는 실제 코드 작성 → 테스트 실행(Success)

### TDD를 하면 좋은 점

1. TDD를 하므로 인해 많은 기능을 테스트하기에 소스 코드에 안정감이 부여
2. 실제 개발하면서 많은 시간이 소요되는 디버깅 시간을 TDD를 통해 줄여서 실제 개발시간을 줄여준다.
3. 소스 코드 하나하나를 더욱 신중히 짤 수 있으므로 클린 코드가 나올 확률이 높다.

### Jest 파일구조

```jsx
describe
	test(it)
	test(it)
	test(it)

// like this..
Describe(과일)
	it 사과
	it 바나나
```

- describe: `argument(name, fn)`
  - 여러 관련 테스트를 그룹화하는 블록을 만든다.
- it same as test: `argument(name, fn, timeout)`
  - 개별 테스트를 수행하는 곳. 각 테스트를 작은 문장처럼 설명한다.

### 간단한 카운터 앱을 TDD 방식으로 만들어본다.

- Counter 생성

  - 해야 할 일은?
    - Counter는 0부터 시작한다.
  - 테스트 작성
    `App.test.js`

    ```jsx
    import { render, screen } from "@testing-library/react";
    import App from "./App";

    test("renders learn react link", () => {
      // App 컴포넌트 렌더링
      render(<App />);
      // screen object를 이용해 원하는 엘리먼트에 접근(접근할 때는 ID로 접근한다.)
      const counterElement = screen.getByTestId("counter");
      // id가 counter인 엘리먼트의 텍스트가 0인지 테스트한다.
      expect(counterElement).toBe(0);
    });
    ```

  - 테스트 실행
    - Fail
  - 테스트 코드에 대응하는 실제 코드 작성
    `App.js`

    ```jsx
    import { useState } from "react";
    import "./App.css";

    function App() {
      const [counter, setCounter] = useState(0);

      return (
        <div className="App">
          <header className="App-header">
            <h3 data-testid="counter">{counter}</h3>
          </header>
        </div>
      );
    }

    export default App;
    ```

  - 테스트 실행

    - Fail

      ```bash
      FAIL  src/App.test.js (6.084 s)
        ✕ renders learn react link (118 ms)
        ● renders learn react link

          expect(received).toBe(expected) // Object.is equality

          Expected: 0
          Received: <h3 data-testid="counter">0</h3> // 0을 받아야하는데 엘리먼트를 받았기 때문에 에러
      ```

  - 테스트 코드 수정
    `App.test.js`

    ```jsx
    import { render, screen } from "@testing-library/react";
    import App from "./App";

    test("renders learn react link", () => {
      // 아래와 같이 메서드 수정
      expect(counterElement).toHaveTextContent(0);
    });
    ```

  - 테스트 실행

    - Success

      ```bash
      PASS  src/App.test.js
        ✓ renders learn react link (47 ms)

      Test Suites: 1 passed, 1 total
      Tests:       1 passed, 1 total
      Snapshots:   0 total
      Time:        6.194 s, estimated 7 s
      Ran all test suites related to changed files.
      ```

### 플러스, 마이너스 버튼 생성

카운터를 올리고 내리는 버튼을 생성해보자

- 해야할 일
  - +, - 버튼 두 개를 생성한다.
- 테스트 작성
  `App.test.js`

  ```jsx
  // ..
  test("minus button has correct text", () => {
    render(<App />);
    const minusButtonElement = screen.getByTestId("minus-button");
    expect(minusButtonElement).toHaveTextContent("-");
  });

  test("plus button has correct text", () => {
    render(<App />);
    const plusButtonElement = screen.getByTestId("plus-button");
    expect(plusButtonElement).toHaveTextContent("+");
  });
  ```

- 테스트 실행
  - Fail
    ```bash
    FAIL  src/App.test.js
      ✓ renders learn react link (35 ms)
      ✕ minus button has correct text (9 ms)
      ✕ plus button has correct text (5 ms)
    ```
- 테스트 코드에 대응하는 실제 코드 작성
  `App.js`
  ```jsx
  function App() {
    // ..
    return (
      <div className="App">
        <header className="App-header">
          {/* ... */}
          <div>
            <button data-testid="minus-button">-</button>
            <button data-testid="plus-button">+</button>
          </div>
        </header>
      </div>
    );
  }
  ```
- 테스트 실행

  - Success

    ```bash
    PASS  src/App.test.js
      ✓ renders learn react link (108 ms)
      ✓ minus button has correct text (12 ms)
      ✓ plus button has correct text (6 ms)

    Test Suites: 1 passed, 1 total
    Tests:       3 passed, 3 total
    Snapshots:   0 total
    Time:        6.413 s
    Ran all test suites related to changed files.
    ```

### 플러스 마이너스 버튼 기능 추가(fire event)

카운터를 올리고 내리는 버튼의 기능을 넣어 카운터를 변화시켜본다.
이때 FireEvent API를 사용하는데, 유저가 발생시키는 액션(이벤트)에 대한 테스트를 해야 하는 경우에 사용한다.

- 해야할 일
  - - 버튼을 누르면 카운터가 1로 변하고, - 버튼을 누르면 -1로 변한다.
- 테스트 작성
  `App.test.js`

  ```jsx
  // ..
  test("when the + button is pressed, the counter changes to 1", () => {
    render(<App />);
    const buttonElement = screen.getByTestId("plus-button");
    // click plus button
    fireEvent.click(buttonElement);
    // 카운터가 0 > 1로 변경된다.
    const counterElement = screen.getByTestId("counter");
    expect(counterElement).toHaveTextContent(1);
  });

  test("when the - button is pressed, the counter changes to 1", () => {
    render(<App />);
    const buttonElement = screen.getByTestId("minus-button");
    // click minus button
    fireEvent.click(buttonElement);
    // 카운터가 0 > -1로 변경된다.
    const counterElement = screen.getByTestId("counter");
    expect(counterElement).toHaveTextContent(-1);
  });
  ```

- 테스트 실행
  - Fail
    ```bash
    FAIL  src/App.test.js
      ✓ ...
      ✕ when the + button is pressed, the counter changes to 1 (9 ms)
      ✕ when the - button is pressed, the counter changes to 1 (10 ms)
    ```
- 테스트 코드에 대응하는 실제 코드 작성
  `App.js`
  ```jsx
  function App() {
    // ..
    return (
      <div className="App">
        <header className="App-header">
          <h3 data-testid="counter">{counter}</h3>
          <div>
            <button data-testid="minus-button" onClick={() => setCounter((count) => count - 1)}>
              -
            </button>
            <button data-testid="plus-button" onClick={() => setCounter((count) => count + 1)}>
              +
            </button>
          </div>
        </header>
      </div>
    );
  }
  ```
- 테스트 실행

  - Success

    ```bash
    PASS  src/App.test.js
      ✓ ...
      ✓ when the + button is pressed, the counter changes to 1 (19 ms)
      ✓ when the - button is pressed, the counter changes to 1 (10 ms)

    Test Suites: 1 passed, 1 total
    Tests:       5 passed, 5 total
    Snapshots:   0 total
    Time:        6.103 s, estimated 8 s
    Ran all test suites related to changed files.
    ```

### on/off 버튼 생성

- 해야할 일
  - on/off 버튼을 생성한다.
- 테스트 작성
  `App.test.js`
  ```jsx
  test("on/off button has blue **color**", () => {
    render(<App />);
    const buttonElement = screen.getByTestId("on/off-button");
    expect(buttonElement).toHaveStyle({ backgroundColor: "blue" });
  });
  ```
- 테스트 실행
  - Fail
    ```bash
    FAIL  src/App.test.js
      ✓ ...
      ✕ when the + button is pressed, the counter changes to 1 (9 ms)
      ✕ when the - button is pressed, the counter changes to 1 (10 ms)
    ```
- 테스트 코드에 대응하는 실제 코드 작성
  `App.js`

  ```jsx
  function App() {
  	// ..
    return (
      <div className="App">
        <header className="App-header">
          {/* codes.. */}
  				<div>
            <button data-testid="on/off-button" style={{ backgroundColor: 'blue' }}>
              on/off
            </button>
          </div>
      </div>
    );
  }

  ```

- 테스트 실행
  - Success
    ```bash
    PASS  src/App.test.js (8.434 s)
      ✓ ...
      ✓ on/off button has blue color (289 ms)
    ```
