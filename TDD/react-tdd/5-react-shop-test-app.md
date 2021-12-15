## 여행 상품 판매 앱 TDD 구현

### 좀 더 복잡한 어플리케이션을 만들어보자.

이전에 만든 카운터 앱과 다른 점은 더 다양한 엘리먼트들을 다루고, 리액트만이 아닌 노드를 이용한 백엔드 서버와의 통신 부분에도 테스팅을 해보도록 한다.

### 프로젝트 setUp

```bash
> mkdir react-shop-test
> cd react-shop-test
> npx create-react-app ./
```

.eslintrc.json

- package.json의 `eslintConfig` 속성들을 eslintrc.json으로 이동

```json
{
  "extends": ["react-app", "react-app/jest"]
}
```

테스트에 필요한 플러그인 설치한다.

```bash
> npm i -D eslint-plugin-testing-library eslint-plugin-jset-dom
```

`.eslintrc.json`

```json
{
  "plugins": ["testing-library", "jest-dom"],
  "extends": ["react-app", "react-app/jest", "plugin:testing-library/react", "plugin:jest-dom/recommended"]
}
```

### 전체적인 구조 만들기

프로젝트를 시작하기 전에 전체적인 구조를 만들어본다. (하단 프로젝트 트리 참조)

```bash
% tree
.
├── components
└── pages
    ├── CompletePage
    │   ├── CompletePage.js
    │   └── tests
    ├── OrderPage
    │   ├── OderPage.js
    │   └── tests
    └── SummaryPage
        ├── SummaryPage.js
        └── tests
```

### Summary 페이지 Form 구현

가장 먼저 Summary 페이지의 Form 영역을 간단히 구현해보자.

- 해야 할 일은?
  - 주문 확인 체크 박스를 눌러야만 주문 확인 버튼을 누를 수 있다.
- 테스트 작성
  `App.test.js`

  ```jsx
  import { render, screen } from "@testing-library/react";
  import SummaryPage from "../SummaryPage";

  test("checkbox and butoon", () => {
    render(<SummaryPage />);
    const checkbox = screen.getByRole("checkbox", {
      name: "주문하려는 것을 확인하셨나요?",
    });
    expect(checkbox.checked).toEqual(false);

    const confirmButton = screen.getByRole("button", { name: "주문 확인" });
    expect(confirmButton.disabled).toBeTruthy();
  });
  ```

- 테스트 실행

  - Fail

    ```bash
    FAIL  src/2-react-shop-test/pages/SummaryPage/tests/SummaryPage.test.js
      ✕ checkbox and butoon (111 ms)

      ● checkbox and butoon
    ```

- 테스트 코드에 대응하는 실제 코드 작성
  `App.js`

  ```jsx
  import React, { useState } from "react";

  const SummaryPage = () => {
    const [checked, setChecked] = useState(false);

    return (
      <div>
        <form>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            id="confirm-checkbox"
          />{" "}
          <label htmlFor="confirm-checkbox">주문하려는 것을 확인하셨나요?</label>
          <br />
          <button type="submit" disabled={!checked}>
            주문 확인
          </button>
        </form>
      </div>
    );
  };

  export default SummaryPage;
  ```

- 테스트 실행

  - Success

    ```bash
    PASS  src/2-react-shop-test/pages/SummaryPage/tests/SummaryPage.test.js (12.548 s)
      ✓ checkbox and butoon (683 ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        20.389 s
    Ran all test suites related to changed files.
    ```
