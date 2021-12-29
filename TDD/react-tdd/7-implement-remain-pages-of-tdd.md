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
