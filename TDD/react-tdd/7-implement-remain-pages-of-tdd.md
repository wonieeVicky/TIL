## 주문 요약, 주문 완료 페이지 TDD 구현

### 페이지마다 스텝 부여

주문 페이지에서 주문 확인 페이지 및 주문 완료 페이지로 이동해야 하는데, 이러한 페이지 이동에 스텝을 부여해본다. 주문 페이지(Step 0) → 주문 확인(Step 1) → 주문 완료(Step 2)

- 해야 할 일?
  - 주문 페이지에서 주문 후 주문 버튼 클릭 → 주문 확인 페이지에서 체크박스와 버튼 클릭 → 주문 완료 페이지에서 완료 확인
- 테스트 코드 작성
  App 컴포넌트는 test-utils를 사용하지 않아도 된다! 이미 Provider로 감싸져있기 때문이다.
  `./App.test.js`

  ```jsx
  import userEvent from "@testing-library/user-event";
  import App from "./App";
  const { render, screen } = require("@testing-library/react");

  test("From order to order completion", async () => {
    // App 컴포넌트 안에는 이미 provider가 Wrap되어 있다.
    render(<App />);

    // America 여행 상품 2개 추가
    const americaInput = await screen.findByRole("spinbutton", { name: "America" });
    userEvent.clear(americaInput);
    userEvent.type(americaInput, "2");

    // England 여행 상품 3개 추가
    const englandInput = screen.getByRole("spinbutton", { name: "England" });
    userEvent.clear(englandInput);
    userEvent.type(englandInput, "3");

    // Insurance 옵션 체크
    const InsuranceCheckbox = await screen.findByRole("checkbox", { name: "Insurance" });
    userEvent.click(InsuranceCheckbox);

    // 모든 주문을 한 이후 주문 버튼 클릭!
    const orderButton = screen.getByRole("button", {
      name: "주문하기",
    });
    userEvent.click(orderButton);
  });
  ```

- 실제 코드 구현
  `App.js`

  ```jsx
  // ..
  import OrderPage from "./2-react-shop-test/pages/OrderPage/OrderPage";
  import SummaryPage from "./2-react-shop-test/pages/SummaryPage/SummaryPage";
  import CompletePage from "./2-react-shop-test/pages/CompletePage/CompletePage";

  function App() {
    const [step, setStep] = useState(0);

    return (
      <div>
        <OrderContextProvider>
          {step === 0 && <OrderPage setStep={setStep} />}
          {step === 1 && <SummaryPage setStep={setStep} />}
          {step === 2 && <CompletePage setStep={setStep} />}
        </OrderContextProvider>
      </div>
    );
  }
  ```

  `OrderPage.js`

  ```jsx
  // setStep 상속하여 버튼 클릭이벤트에 연결
  function OrderPage({ setStep }) {
    const [orderDatas] = useContext(OrderContext);
    return (
      <div>
        {/* codes.. */}
        <div style={{ display: "flex", marginTop: 20 }}>
          {/* codes.. */}
          <div style={{ width: "50%" }}>
            {/* codes.. */}
            <button onClick={() => setStep(1)}>주문하기</button>
          </div>
        </div>
      </div>
    );
  }
  ```

- 테스트

  ```bash
  PASS  src/App.test.js (9.47 s)
    ✓ From order to order completion (1756 ms)

  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total
  Snapshots:   0 total
  Time:        14.957 s
  ```

### 주문 확인 페이지

주문 페이지에서 주문하기 버튼을 누르는 것까지 구현이 완료되었다. 이제 주문 확인 페이지를 만들어보자

- 해야 할 일?

  - 주문 확인 페이지에서 체크박스와 버튼 클릭
  - 테스트 작성
    `./App.test.js`

    ```jsx
    // ..

    test("From order to order completion", async () => {
      // ..

      // 주문 확인 페이지
      // 제목
      const summaryHeading = screen.getByRole("heading", { name: "주문 확인" });
      expect(summaryHeading).toBeInTheDocument();

      // 여행 상품 총 가격
      const productsHeading = screen.getByRole("heading", { name: "여행 상품: 5000" });
      expect(productsHeading).toBeInTheDocument();

      // 옵션 총 가격
      const optionsHeading = screen.getByRole("heading", { name: "옵션: 500" });
      expect(optionsHeading).toBeInTheDocument();

      // 특정 상품 나열
      expect(screen.getByText("2 America")).toBeInTheDocument();
      expect(screen.getByText("3 England")).toBeInTheDocument();
      expect(screen.getByText("Insurance")).toBeInTheDocument();

      // 체크 박스 체크
      const confirmCheckbox = screen.getByRole("checkbox", { name: "주문하려는 것을 확인하셨나요?" });
      userEvent.click(confirmCheckbox);

      const confirmOrderButton = screen.getByRole("button", {
        name: "주문 확인",
      });
      userEvent.click(confirmOrderButton);
    });
    ```

  - 실제 코드 구현
    `Summary.js`

    ```jsx
    import React, { useContext, useState } from "react";
    import { OrderContext } from "../../contexts/OrderContext";

    const SummaryPage = ({ setStep }) => {
      const [checked, setChecked] = useState(false);
      const [orderDatas] = useContext(OrderContext);

      const productArray = Array.from(orderDatas.products); // 배열 객체 복사
      const productList = productArray.map(([key, value]) => (
        <li key={key}>
          {value} {key}
        </li>
      ));

      const hasOptions = orderDatas.options.size > 0;
      let optionRender = null;

      if (hasOptions) {
        const optionsArray = Array.from(orderDatas.options.keys());
        const optionList = optionsArray.map((key) => <li key={key}>{key}</li>);
        optionRender = (
          <>
            <h2>옵션: {orderDatas.totals.options}</h2>
            <ul>{optionList}</ul>
          </>
        );
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
      };

      return (
        <div>
          <h1>주문 확인</h1>
          <h2>여행 상품: {orderDatas.totals.products}</h2>
          <ul>{productList}</ul>
          {optionRender}
          <form onSubmit={handleSubmit}>
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

  - 테스트

    ```bash
    PASS  src/App.test.js (10.481 s)
      ✓ From order to order completion (2600 ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        15.615 s
    ```

### 주문 완료 페이지

마지막 페이지인 주문 완료 페이지를 구현해본다.

- 해야할 일
  - 주문 완료 페이지에서 완료 기능 확인
- 테스트 작성
  `App.test.js`
  ```jsx
  //..

  test("From order to order completion", async () => {
    // //
    // 주문 완료 페이지
    // 백엔드에서 데이터를 가져오는 동안 loading 문구
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();

    // getByRole이 아닌 findByRole을 사용하는 이유는 주문 완료 페이지에 올 때
    // post request를 보내서 async 작업이 이뤄지고 주문이 성공했습니다. 문구가 나오기 때문
    const completeHeader = await screen.findByRole("heading", {
      name: "주문이 성공했습니다.",
    });
    expect(completeHeader).toBeInTheDocument();

    // 데이터를 받아온 후에 loading 문구는 사라진다.
    const loadingDisappeared = screen.queryByText("loading");
    expect(loadingDisappeared).not.toBeInTheDocument();

    // 첫 페이지로 버튼 클릭
    const firstPageButton = screen.getByRole("button", { name: "첫페이지로" });
    userEvent.click(firstPageButton);
  });
  ```
  `handlers.js`
  order API request에 대한 response를 handler에 추가해준다.
  ```jsx
  export const handlers = [
    // order API 추가
    rest.post("http://localhost:5000/order", (req, res, ctx) => {
      let dummyData = [{ orderNumber: 123455676, price: 2000 }];
      return res(ctx.json(dummyData));
    }),
  ];
  ```
- 실제 코드 작성
  `pages/CompletePageCompletePage.js`
  ```jsx
  import React, { useContext, useEffect, useState } from "react";
  import axios from "axios";
  import { OrderContext } from "../../contexts/OrderContext";
  import ErrorBanner from "../../components/ErrorBanner";

  function CompletePage({ setStep }) {
    const [orderDatas] = useContext(OrderContext);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => orderCompleted(orderDatas), [orderDatas]);

    const orderCompleted = async (orderDatas) => {
      try {
        let response = await axios.post(`http://localhost:5000/order`, orderDatas);
        setOrderHistory(response.data); // [{ orderNumber: 123455676, price: 2000 }]
        setLoading(false);
      } catch (err) {
        setError(true);
      }
    };

    if (error) {
      return <ErrorBanner message="에러가 발생했습니다." />;
    }

    const orderTable = orderHistory.map((item) => (
      <tr key={item.orderNumber}>
        <td>{item.orderNumber}</td>
        <td>{item.price}</td>
      </tr>
    ));

    if (loading) {
      return <div>loading</div>;
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <h2>주문이 성공했습니다.</h2>
          <h3>지금까지 모든 주문</h3>
          <table style={{ margin: "auto" }}>
            <tbody>
              <tr>
                <th>주문 번호</th>
                <th>주문 가격</th>
              </tr>
              {orderTable}
            </tbody>
          </table>
          <br />
          <button className="rainbow rainbow-1" onClick={() => setStep(0)}>
            첫페이지로
          </button>
        </div>
      );
    }
  }

  export default CompletePage;
  ```
  - 테스트 실행
    - Success
    ```bash
    PASS  src/App.test.js (8.292 s)
      ✓ From order to order completion (2475 ms)
    ```
