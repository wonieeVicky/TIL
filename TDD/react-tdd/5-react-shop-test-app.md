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

### Mock Service Worker

첫 번째 페이지에서 Products(여행 상품), Options(여행 옵션)들은 백엔드 서버에서 가져온다.(사진, 이름, 설명) 여행 상품의 가격은 각각 동일하며, 옵션들도 동일하다. 그리고 여행 상품 선택 개수와 옵션 선택에 따라 총 가격을 계산해주면 된다. 그렇다면 이러한 부분은 어떻게 테스트 해줄까? Mock Service Worker 모듈을 사용한다.

백엔드에서 데이터를 가져오는 부분을 테스트하기 위해서는 실제로 서버에 호출하는 end-to-end 테스트를 할 수 있지만 여기서는 서버에 요청을 보낼 때 그 요청을 가로채서 Mock Service Worker라는 것으로 요청을 처리하고 모의 응답(mocked response)을 보내준다.

![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5cdEJyb3dzZXIgLT4-IFNlcnZpY2UgV29ya2VyOiAxLiByZXF1ZXN0XG4gIFNlcnZpY2UgV29ya2VyIC0tPj4gbXN3OiAyLiByZXF1ZXN0IGNsb25lXG4gIG1zdyAtLT4-IG1zdzogMy4gbWF0Y2ggYWdhaW5zdCBtb2Nrc1xuICBtc3cgLS0-PiBTZXJ2aWNlIFdvcmtlcjogNC4gTW9ja2VkIHJlc3BvbnNlXG4gIFNlcnZpY2UgV29ya2VyIC0-PiBCcm93c2VyOiA1LiByZXNwb25kV2l0aChtb2NrZWRSZXNwb25zZSlcblx0XHRcdFx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

### [MSW 작동 방식](https://mswjs.io/docs/getting-started/mocks/rest-api)

브라우저에 서비스 워커를 등록하여 외부로 나가는 네트워크 리퀘스트를 감지한다. 그리고 그 요청을 실제 서버로 갈 때 중간에 가로채서(intercept) MSW 클라이언트 사이드 라이브러리로 보낸다. 그 후 등록된 핸들러에서 요청을 처리한 후 모의 응답을 브라우저로 보낸다.

- 브라우저와 통합
  - 브라우저에 서비스 워커를 등록해서 네트워크를 가로챈다.
- 노드와 통합(Jest 사용하는 테스트 환경)
  - MSW가 서버를 생성해서 데이터를 전송해준다.

### MSW 설치하기

1. msw 설치

```bash
> npm i msw --save
```

1. 핸들러 생성

`src/mocks/handlers.js`

```jsx
import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:5000/products", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "America",
          imagePath: "/images/america.jpeg",
        },
        {
          name: "England",
          imagePath: "/images/england.jpeg",
        },
      ])
    );
  }),
  rest.get("http://localhost:5000/options", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Insurance",
        },
        {
          name: "Dinner",
        },
      ])
    );
  }),
];
```

- 핸들러 Type
  - Rest 또는 Graphql
- HTTP method
  - get, post, delete, ..
- 매개변수
  - req: 매칭 요청에 대한 정보
  - res: 모의 응답을 생성하는 기능적 유틸리티
  - ctx: 모의 응답의 상태 코드, 헤더, 본문 등을 설정하는 데 도움이 되는 함수 그룹

1. 노드와 통합(Jest 사용하는 테스트 환경)

- 서버 생성
  `src/mocks/server.js`

  ```jsx
  import { setupServer } from "msw/node";
  import { handler } from "./handlers";

  // This configures a request mocking server
  // with the given request handlers.
  export const server = setupServer(...handler);
  ```

  `root/setupTests.js`

  ```jsx
  // jest-dom adds custom jest matchers for asserting on DOM nodes.
  // allows you to do things like:
  // expect(element).toHaveTextContent(/react/i)
  // learn more: https://github.com/testing-library/jest-dom
  import "@testing-library/jest-dom";

  // 아래부터 추가
  // src/setupTests.js
  import { server } from "./mocks/server.js";
  // Establish API mocking before all tests.
  beforeAll(() => server.listen());
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers());
  // Clean up after the tests are finished
  afterAll(() => server.close());
  ```

### MSW를 이용한 테스트 - 상품 이미지 가져오기

mock service worker를 사용해 여행 상품부분 products를 테스트해본다.

1. Type 파일 생성
2. Type.test.js 테스트 파일 생성
3. Products 파일 생성

- 해야 할 일은?
  - 서버에서 여행 상품 이미지를 가져온다.
- 테스트 작성
  `Type.test.js`

  ```jsx
  import { screen, render } from "@testing-library/react";
  import Type from "../Type";

  test("displays product images from server", async () => {
    render(<Type orderType="products" />);

    // 이미지 찾기
    const productImages = await screen.findAllByRole("img", {
      name: /product$/i,
    });
    expect(productImages).toHaveLength(2);

    const altText = productImages.map((element) => element.alt);
    expect(altText).toEqual(["America product", "England product"]);
  });
  ```

- 테스트 실행
  - Fail
- 테스트 코드에 대응하는 실제 코드 작성
  `Type.js`

  ```jsx
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import Products from "./Products";

  export default function Type({ orderType }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
      loadItems(orderType);
    }, [orderType]);

    const loadItems = async (orderType) => {
      try {
        let response = await axios.get(`http://localhost:5000/${orderType}`);
        setItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const ItemComponent = orderType === "products" ? Products : null;

    const optionItems = items.map((item) => (
      <ItemComponent key={item.name} name={item.name} imagePath={item.imagePath} />
    ));

    return <div>{optionItems}</div>;
  }
  ```

  `Products.js`

  ```jsx
  import React from "react";

  function Products({ name, imagePath }) {
    return (
      <div style={{ textAlign: "center" }}>
        <img style={{ width: "75%" }} src={`http://localhost:5000/${imagePath}`} alt={`${name} product`} />
        <form style={{ marginTop: "10px" }}>
          <label style={{ textAlign: "right" }}>{name}</label>
          <input style={{ marginLeft: 7 }} type="number" name="quantity" min="0" defaultValue={0} />
        </form>
      </div>
    );
  }

  export default Products;
  ```

- 테스트 실행

  - Success

    ```bash
    PASS  src/2-react-shop-test/pages/OrderPage/tests/Type.test.js
    PASS  src/2-react-shop-test/pages/SummaryPage/tests/SummaryPage.test.js (6.762 s)

    Test Suites: 3 passed, 3 total
    Tests:       9 passed, 9 total
    Snapshots:   0 total
    Time:        9.278 s
    Ran all test suites.
    ```

### 서버에서 데이터를 가져올 때 에러 발생 시 UI 처리

서버에서 데이터를 가져올 때 에러가 발생할 경우 에러 표시를 적절하게 해주고자 한다.

- 해야 할 일은?
  - 서버에서 에러 발생 시 에러 문구를 표출해준다.
- 테스트 작성
  `Type.test.js`
  ```jsx
  test("when fetching product datas, face an error", async () => {
    server.resetHandlers(rest.get("http://localhost:5000/products", (req, res, ctx) => res(ctx.status(500))));

    render(<Type orderType="products" />);

    const errorBanner = await screen.findByTestId("error-banner");
    expect(errorBanner).toHaveTextContent("에러가 발생했습니다.");
  });
  ```
- 테스트 실행
  - Fail
- 테스트 코드에 대응하는 실제 코드 작성
  `Type.js`
  ```jsx
  // ...
  import ErrorBanner from "../../components/ErrorBanner";

  export default function Type({ orderType }) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
      loadItems(orderType);
    }, [orderType]);

    const loadItems = async (orderType) => {
      try {
        let response = await axios.get(`http://localhost:5000/${orderType}`);
        setItems(response.data);
      } catch (error) {
        setError(true); // error state 변경
      }
    };

    if (error) {
      return <ErrorBanner message="에러가 발생했습니다." />;
    }

    // ..
  }
  ```
  `components/ErrorBanner.js`
  ```jsx
  import React from "react";

  const ErrorBanner = ({ message }) => {
    let errorMessage = message || "에러입니다.";

    return (
      <div
        data-testid="error-banner"
        style={{
          backgroundColor: "red",
          color: "white",
        }}
      >
        {errorMessage}
      </div>
    );
  };

  export default ErrorBanner;
  ```
- 테스트 실행
  - Success
    ```bash
    PASS  src/2-react-shop-test/pages/OrderPage/tests/Type.test.js
      ✓ displays product images from server (268 ms)
      ✓ when fetching product datas, face an error (157 ms)

    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    ```
