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

### no wrapped in act 경고

위 테스트를 실행하면 성공이 나오지만 no wrapped in act 경고가 발생한다. 이 에러는 뭘까?

```bash
console.error
    Warning: An update to Type inside a test was not wrapped in act(...).

    When testing, code that causes React state updates should be wrapped into act(...):

    act(() => {
      /* fire events that update state */
    });
    /* assert on the output */
```

- 왜 나는 건가?
  리액트에서 나오는 act 경고는 우리가 컴포넌트에 아무것도 일어나지 않을 것으로 예상하고 있을 대 컴포넌트에 어떤 일이 일어나면 나오는 경고이다. 원래 컴포넌트에서 무언가 일어난다고 해주려면 act라는 함수로 감싸주어야 함
  ```jsx
  act(() => {
    /* fire events that update state */
  });
  ```
  이렇게 감싸주면 리액트는 이 컴포넌트에서 어떤 일이 일어날 것이라고 생각하며, 만약 일어나지 않는다면 리액트가 경고를 보여주게 된다.
- 지금까지 act로 감싸주지 않은 이유?
  RTL 내부 API에 act를 이미 내포하고 있어서 우리가 일부러 act로 감싸서 호출하지 않고 렌더링과 업데이트를 할 수 있다.(리액트의 콜 스택 안에 있을 때, 예를 들면 아래와 같다.)

  ```jsx
  it("should render and update a counter", () => {
    // 컴포넌트 렌더링
    act(() => {
      ReactDOM.render(<Counter />, container);
    });

    // 컴포넌트 업데이트를 트리거하는 이벤트 발생
    act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  });

  // With react-testing-library
  it("should render and update a counter", () => {
    // 컴포넌트 렌더링
    const { getByText } = render(<Counter />);

    // 컴포넌트 업데이트를 트리거하는 이벤트 발생
    fireEvent.click(getByText("Save"));
  });
  ```

- 그런데 이미 act로 감싸주었는데 지금은 왜 에러가 났을까?
  컴포넌트가 비동기 API 호출을 할 때나 렌더링이나 어떠한 것이 업데이트 되기 전에 테스트가 종료될 때는 따로 act로 감싸주어야 한다. (리액트 콜 스택 밖에 있을 떄) 그래서 이 때는 `waitFor API`를 이용해서 테스트가 끝나기 전에 컴포넌트가 다 업데이트 되기를 기다려주어야 한다.
- 그렇다면 act 경고를 어떠헥 해결해야 하는가?
  만들고 있는 앱의 주문 완료 페이지에 “첫페이지로” 버튼을 누르면

  ```jsx
  // 첫 페이지로 버튼 클릭
  const firstPageButton = screen.getByRole("button", { name: "첫페이지로" });
  userEvent.click(firstPageButton);
  ```

  첫페이지로 갔기 때문에 리액트는 첫 페이지에서 어떠한 일이 일어날거라고 생각한다.(America 여행 상품이나 Insurance 옵션 등을 비동기로 가져오는..) 하지만 테스트 코드에서는 첫 페이지 부분으로 가는 버튼을 누르고 바로 테스트가 끝나버린다. 따라서 리액트가 act 경고를 보여줌

  ```jsx
  // 첫 페이지로 버튼 클릭
  const firstPageButton = screen.getByRole("button", { name: "첫페이지로" });
  userEvent.click(firstPageButton);

  /* await waitFor(() => {
  	screen.getByRole("spinbutton", { name: "America" });
  }); */
  await screen.findByRole("spinbutton", { name: "America" });
  ```

  위와 같이 첫 페이지에 온 후의 일어날 일들을 waitFor API를 이용해 넣어주면 경고가 사라진다.

### 다른 예제

회원가입 → 비동기 요청 → 데이터 베이스 → 새로운 유저 정보

```jsx
// "정보를 저장 중입니다." 가 지워지기 까지 기다린다.를 의미하는 코드
await waitForElementToBeRemoved(() => screen.getByText("정보를 저장 중입니다."));
```

위와 같이 넣어줘야 act 경고가 발생하지 않음. react는 “정보가 저장 중입니다.”가 없어지고 있는 걸 예상하고 실제로 테스트에서 없애줘야 경고가 나타나지 않게 된다. waitForElementToBeRemoved는 어떠한 요소(element)가 돔에서 사라지는 것을 기다리는 것이다.
### 첫 페이지로 돌아갈 때 State Reset!

결제 완료 페이지에서 첫 페이지로 버튼을 눌러 첫 페이지로 돌아갈 때 OrderContext 안에 있는 State를 Reset시켜줘보자!

- 해야 할 일?
    - 첫 페이지로 돌아올 때 모든 값이 초기화되게 만들기
- 테스트 작성
    
    `App.test.js`
    
    ```jsx
    // 첫 페이지로 버튼 클릭
    const firstPageButton = screen.getByRole('button', { name: '첫페이지로' });
    userEvent.click(firstPageButton);
    
    // 여행 상품 총 가격 옵션 총 가격이 reset 되었는지 확인
    const productsTotal = screen.getByText('상품 총 가격: 0');
    expect(productsTotal).toBeInTheDocument();
    const optionsTotal = screen.getByText('옵션 총 가격: 0');
    expect(optionsTotal).toBeInTheDocument();
    
    await screen.findByRole('spinbutton', { name: 'America' });
    await screen.findByRole('checkbox', { name: 'Insurance' });
    ```
    
- 테스트에 대응하는 실제 코드 작성
    
    `context/OrderContext.js`
    
    ```jsx
    //..
    export function OrderContextProvider(props) {
      // ..
      const value = useMemo(() => {
        // ..
        const resetOrderDatas = () => {
          setOrderCounts({ products: new Map(), options: new Map() });
        };
        return [{ ...orderCounts, totals }, updateItemCount, resetOrderDatas];
      }, [orderCounts, totals]);
    
      return <OrderContext.Provider value={value} {...props} />;
    }
    ```
    
    `CompletePage.js`
    
    ```jsx
    function CompletePage({ setStep }) {
      const [orderDatas, , resetOrderDatas] = useContext(OrderContext); // resetOrderDatas 호출
    	// ..
    
      const handleClick = () => {
        // order data를 reset
        resetOrderDatas();
        // 첫 페이지로 보내기
        setStep(0);
      };
    
      if (loading) {
        return <div>loading</div>;
      } else {
        return (
          <div style={{ textAlign: 'center' }}>
            {/* codes.. */}
            <button className="rainbow rainbow-1" onClick={handleClick}>
              첫페이지로
            </button>
          </div>
        );
      }
    }
    ```
    
    `resetOrderDatas` 함수를 OrderContext에서 호출하여 handleClick event에 바인드
    
- 테스트
    - success
    
    ```bash
    PASS  src/App.test.js (9.183 s)
      ✓ From order to order completion (2690 ms)
    
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        12.535 s, estimated 14 s
    Ran all test suites matching /src\/App\.test\.js/i.
    ```
    