## React Context를 이용한 상품 가격 처리

### 상품 가격을 위한 테스트 케이스 구현

앱에서 여행 상품과 옵션의 값을 더해 총 가격이 나오는 부부이 있다. 이 부분을 구현해보자 😎

- 해야할 일
  - 여행 상품과 옵션의 개수에 따라 가격을 계산해준다.
- 테스트 작성
  `pages/OrderPage/tests/calculate.test.js`

  ```jsx
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import Type from "../Type";

  test("update product's total when products change", async () => {
    render(<Type orderType="products" />);

    // 여행 상품 가격은 0원부터 시작한다.
    const productsTotal = screen.getByText("상품 총 가격: ", { exact: false }); // 상품 총 가격: 뒤에 다른 텍스트가 있어도 값을 가져옴
    expect(productsTotal).toHaveTextContent("0");

    // 아메리카 여행 상품 한 개 올리기
    const americaInput = await screen.findByRole("spinbutton", {
      name: "America",
    });
    userEvent.clear(americaInput);
    userEvent.type(americaInput, "1");
    expect.any(productsTotal).toHaveTextContent("1000");

    // 영국 여행 상품 3개 더 올리기
    const englandInput = await screen.findByRole("spinbutton", {
      name: "England",
    });
    userEvent.clear(englandInput);
    userEvent.type(englandInput, "3");
    expect(productsTotal).toHaveTextContent("4000");
  });
  ```

  - userEvent.clear()
    input이나 textarea에 텍스트를 선택(select) 한 후 제거(delete) 해준다.
    이 부분은 없어도 테스트 결과에 영향을 미치지 않음. 하지만 만약 현재 소스 코드 보다 위에서 같은 엘리먼트를 위한 userEvent를 사용한 경우 clear 해준 뒤 `userEvent.type()`을 사용하는 것이 바람직!

- 테스트 실행
  - Fail
    ```bash
    FAIL  src/2-react-shop-test/pages/OrderPage/tests/calculate.test.js
      ✕ update product's total when products change (52 ms)
    ```
- 테스트에 대응하는 실제코드 작성
  - 다음 chapter에서 진행한다!

### 리액트에서 컴포넌트 간 데이터 흐름을 컨트롤 하는 법 (state 관리방법)

- 리액트에서는 컴포넌트 간 데이터 흐름 컨트롤을 아래와 같은 방법을 사용해 처리한다.
  - state와 props를 사용해 컴포넌트 간 전달
  - React Context 사용 (이것을 사용!)
  - mob, redux 사용 등..
- 리액트 테스트에서는 각 주문 금액을 OrderPage, CompletePage 등에서 공유하여 사용해야 하므로 이러한 컴포넌트 간 데이터 전달에 대한 테스트 코드는 React context를 사용해 구현해보기로 한다.

### context를 사용한 컴포넌트 데이터 제공

- context를 이용하면
  일반적인 react 애플리케이션에서 데이터는 위에서 아래로, 즉 부모에서 자식에게 props를 통해 정보를 내려주는 구조를 가지지만, 애플리케이션 안의 여러 컴포넌트들에 전해줘야 하는 props의 경우 이 과정이 매우 중복적이고 번거로울 수 있다. 이때 context를 이용하며 트리 단계마다 명시적으로 props를 넘겨주지 않고 많은 컴포넌트가 값을 공유하도록 만들 수 있음
- context를 사용해서 할 일
  - 어떠한 컴포넌트에서 총 가격을 Update해주는 것
  - 어떠한 컴포넌트에서 총 가격을 보여주는 것
- context를 사용하는 방법

  1. context 생성

     `contexts/OrderContext.js`

     ```jsx
     import { createContext, useMemo } from "react";

     const OrderContext = createContext();

     export function OrderContextProvider(props) {
       return <OrderContext.Provider value {...props} />;
     }
     ```

  2. context는 Provider 안에서 사용 가능하기 때문에 Provider 생성

     `App.js`

     ```jsx
     // ..
     import { OrderContextProvider } from "./contexts/OrderContext";

     function App() {
       return (
         <div style={{ padding: "4rem" }}>
           <OrderContextProvider>
             <OrderPage />
           </OrderContextProvider>
         </div>
       );
     }
     ```

  3. value로 넣을 데이터 만들어주기(필요한 데이터와 데이터를 업데이트 해줄 함수들)

     - 필요한 데이터 형식 만들기
       `contexts/OrderContext.js`

       ```jsx
       // ..
       export function OrderContextProvider(props) {
         // Map은 간단한 키와 값을 서로 연결(매핑)시켜 저장하며
         // 저장된 순서대로 각 요소들을 반복적으로 접근할 수 있도록 함
         const [orderCounts, setOrderCounts] = useState({
           products: new Map(),
           options: new Map(),
         });

         // value가 바뀔 때마다 OrderContext를 사용하는 모든 컴포넌트들이 모두 리렌더링됨
         // 따라서 useMemo를 사용해서 성능을 최적화해준다.
         const value = useMemo(() => [{ ...orderCounts }], [orderCounts]);

         return <OrderContext.Provider value={value} {...props} />;
       }
       ```

     - 데이터를 업데이트 해주는 함수 만들기
       `context/OrderContext.js`

       ```jsx
       // ..
       export function OrderContextProvider(props) {
         // ..
         const value = useMemo(() => {
           function updateItemCount(itemName, newItemCount, orderType) {
             const newOrderCounts = { ...orderCounts };
             console.log("newOrderCount before: ", newOrderCounts);

             const orderCountsMap = orderCounts[orderType];
             orderCountsMap.set(itemName, parseInt(newItemCount));

             console.log("newOrderCount after: ", newOrderCounts);
             setOrderCounts(newOrderCounts);
           }

           return [{ ...orderCounts }, updateItemCount];
         }, [orderCounts]);

         return <OrderContext.Provider value={value} {...props} />;
       }
       ```

     - 상품 Count를 이용한 가격 계산
       `context/OrderContext.js`

       ```jsx
       //..
       import { useEffect } from "react";

       const pricePerItem = {
         products: 1000,
         options: 500,
       };

       const calculateSubtotal = (orderType, orderCounts) => {
         let optionCount = 0;
         for (const count of orderCounts[orderType].values()) {
           optionCount += count;
         }

         return optionCount * pricePerItem[orderType];
       };

       export function OrderContextProvider(props) {
         // 상품 count를 이용한 가격 계산
         const [totals, setTotals] = useState({
           products: 0,
           options: 0,
           total: 0,
         });

         useEffect(() => {
           const productsTotal = calculateSubtotal("products", orderCounts);
           const optionsTotal = calculateSubtotal("options", orderCounts);
           const total = productsTotal + optionsTotal;
           setTotals({
             products: productsTotal,
             options: optionsTotal,
             total: total,
           });
         }, [orderCounts]);

         const value = useMemo(() => {
           // totals 추가
           return [{ ...orderCounts, totals }, updateItemCount];
         }, [orderCounts, totals]);
       }
       ```

  4. orderContext 사용하기

     `contexts/OrderContext.js`

     ```jsx
     export const OrderContext = createContext();
     ```

     `Type.js`

     ```jsx
     // ..
     import React, { useEffect, useState, useContext } from "react";
     import { OrderContext } from "../../contexts/OrderContext";

     export default function Type({ orderType }) {
       // ..
       const [orderDatas, updateItemCount] = useContext(OrderContext);

       // ..
     }
     ```

### Context를 사용해 가격 계산하기

context를 사용할 준비가 끝났다면 이 context를 통해 여행 상품, 옵션을 추가함에 따라 여행상품의 총 가겨과 옵션의 총가격 그리고 여행상품과 옵션의 총가격을 더한 전체 총 가격을 나타내보자

- 해야할 일?
  - 여행 상품의 총 가격, 옵션의 총 가격을 구한다.
- 코드 작성

  - Products, Options 두 컴포넌트에 updateItemCount를 Prop로 전달
    `Type.js`

    ```jsx
    // ..
    import React, { useEffect, useState, useContext } from "react";
    import { OrderContext } from "../../contexts/OrderContext";

    export default function Type({ orderType }) {
      // ..
      const [orderDatas, updateItemCount] = useContext(OrderContext);
      const optionItems = items.map((item) => (
        <ItemComponent
          key={item.name}
          name={item.name}
          imagePath={item.imagePath}
          // updateItemCount props 추가
          updateItemCount={(itemName, newItemCount) => updateItemCount(itemName, newItemCount, orderType)}
        />
      ));
    }
    ```

  - 여행 가격은 각 상품의 숫자를 올리거나 내릴 때(Products 컴포넌트)
    `Products.js`
    ```jsx
    function Products({ name, imagePath, updateItemCount }) {
      const handleChange = (e) => {
        const currentValue = e.target.value;
        updateItemCount(name, currentValue);
      };
      return (
        <div style={{ textAlign: "center" }}>
          {/* codes.. */}
          <form style={{ marginTop: "10px" }}>
            {/* codes.. */}
            <input
              style={{ marginLeft: 7 }}
              type="number"
              name="quantity"
              min="0"
              defaultValue={0}
              onChange={handleChange} // add handleChange event
            />
          </form>
        </div>
      );
    }
    ```
  - 옵션은 각 옵션의 체크박스를 체크하거나 제거할 때(Options 컴포넌트)
    `Options.js`
    ```jsx
    const Options = ({ name, updateItemCount }) => {
      return (
        <form>
          <input
            type="checkbox"
            id={`${name} option`}
            onChange={(e) => updateItemCount(name, e.target.checked ? 1 : 0)}
          />
          {/* codes.. */}
        </form>
      );
    };
    ```

### context wrapper 추가로 에러 개선

- 현재까지 구현한 context를 테스트하면 아래와 같다.

  ```bash
  ● update product's total when products change
  TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))

     9 |   const [items, setItems] = useState([]);
    10 |   const [error, setError] = useState(false);
  > 11 |   const [orderDatas, updateItemCount] = useContext(OrderContext);
       |                                         ^
  ```

- 에러가 나는 이유는?
  - 에러가 발생하는 이유는 OrderContextProvider로 실제 코드를 감싸주었으나 테스트 코드에서는 별도로 감싸주지 않았기 때문에 Context 사용과정에서 에러가 발생!
- 에러 해결 방법은?

  - App.js 에서 감싸준 것처럼 테스트 코드에도 wrapper로 감싸준다. 단, 방법이 다르다.
    `calculate.test.js`

    ```jsx
    // ..
    import { OrderContextProvider } from "../../../contexts/OrderContext";

    test("update product's total when products change", async () => {
      // wrapper로 OrderContextProvider 씌워주기
      render(<Type orderType="products" />, { wrapper: OrderContextProvider });

      // ..
    });
    ```

- 테스트로 확인(단, 테스트할 때 p를 입력하여 해당 파일만 테스트를 해야한다.)
  - 에러 발생!
    `Products.js`
    form 태그 내부의 label과 input에 id, htmlFor 속성에 `{name}` 추가
  - 테스트 성공!
    ```bash
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        21.982 s
    Ran all test suites matching /ca/i.
    ```

### 모든 테스트 케이스를 wrapper로 감싸주기

이전 영상의 테스트 케이스에서 context가 필요했으므로 wrapper로 감싸줌. 하지만 다른 테스트에서도 context가 필요하므로 다 씌워주는 것이 불편.. 따라서 Custom render를 만들어 적용해본다. ([참고](https://testing-library.com/docs/react-testing-library/setup/#custom-render))

- Custom Render를 만들 파일 생성 후 Custom Render 생성
  `test-utils.js`

  ```jsx
  import { render } from "@testing-library/react";
  import { OrderContextProvider } from "./2-react-shop-test/contexts/OrderContext";

  // ui: 렌더하고자하는 jsx
  // options: wrapper 옵션 이외에 우리가 주고자 하는 다른 옵션들
  const customRender = (ui, options) => render(ui, { wrapper: OrderContextProvider, ...options });

  // render 메소드 이외에도 tlr에서 제공하는 모든 것을 다시 export
  export * from "@testing-library/react";
  // 원래 tlr에서 제공하는 render 메소드를 customRender로 override 해주기
  export { customRender as render };
  ```

- 원래 tlr에서 import 했던 것을 방금 생성한 파일에서 Import
  `calculate.test.js`, `Type.test.js`
  ```jsx
  // import { render, screen } from '@testing-library/react';
  import { render, screen } from "../../../test-utils";
  ```

### 옵션 가격 TDD 구현

context를 이용해 상품 가격을 계산하고 그에 대한 테스트를 구현해보았다. 이번에는 옵션 가격을 위한 테스트도 구현해보자..!

- 해야 할 일?
  - 옵션 체크 박스를 체크해서 옵션 총 가격을 업데이트 한다.
- 테스트 작성
  `pages/OrderPagecalculate.test.js`
  ```jsx
  test("update option's total when options change", async () => {
    render(<Type orderType="options" />);

    // 옵션 총 가격이 0부터 시작
    const optionsTotal = screen.getByText("옵션 총 가격:", { exact: false });
    expect(optionsTotal).toHaveTextContent("0");

    // 보험 옵션 추가
    const insuranceCheckbox = await screen.findByRole("checkbox", {
      name: "Insurance",
    });
    userEvent.click(insuranceCheckbox);
    expect(optionsTotal).toHaveTextContent("500");

    // 디너 옵션 추가
    const dinnerCheckbox = screen.getByRole("checkbox", { name: "Dinner" });
    userEvent.click(dinnerCheckbox);
    expect(optionsTotal).toHaveTextContent("1000");

    // 디너 옵션 제거
    userEvent.click(dinnerCheckbox);
    expect(optionsTotal).toHaveTextContent("500");
  });
  ```
- 테스트
  - FAIL : `screen.getByText('옵션 총 가격:', { exact: false })`이 미존재하므로
- 실제 코드 작성
  `Type.js`
  ```jsx
  export default function Type({ orderType }) {
    // ..
    const orderTypeKorean = useMemo(() => (orderType === "products" ? "상품" : "옵션"), [orderType]);

    useEffect(() => {
      loadItems(orderType);
    }, [orderType]);

    //..
    return (
      <>
        {/* codes.. */}
        <p>
          {orderTypeKorean} 총 가격:{orderDatas.totals[orderType]}
        </p>
      </>
    );
  }
  ```
- 테스트
  - Success
    ```bash
    PASS  src/2-react-shop-test/pages/OrderPage/tests/calculate.test.js
    	✓ update product's total when products change (363 ms)
    	✓ update option's total when options change (183 ms)
    ```

### 상품 가격, 옵션 가격을 더한 총 가격 산출

상품 가격과 옵션 가격을 모두 구했으니 이 둘을 합친 총 가격도 구해본다.

- 해야 할 일?
    - 상품 총 가격, 옵션 총 가격 합치기
- 테스트 작성
    
    `calculate.test.js`
    
    같은 분류의 테스트들은 describe 하위로 그룹핑 할 수 있다.
    
    ```jsx
    **describe('total price of goods and options', () => {
      test('total price starts with 0 and Updating total price when adding one product', async () => {
        render(<OrderPage />);
    
        // const total = screen.getByRole('heading:', { name: /Total Price: i$/ });
        const total = screen.getByText('Total Price:', { exact: false });
        expect(total).toHaveTextContent('0');
    
        const americaInput = await screen.findByRole('spinbutton', { name: 'America' });
        userEvent.clear(americaInput);
        userEvent.type(americaInput, '1');
        expect(total).toHaveTextContent('1000');
      });
      test('Updating total price when adding one option', async () => {
        render(<OrderPage />);
    
        const total = screen.getByText('Total Price:', { exact: false });
        const insuranceCheckbox = await screen.findByRole('checkbox', {
          name: 'Insurance',
        });
        userEvent.click(insuranceCheckbox);
        expect(total).toHaveTextContent('500');
      });
      test('Updating total price when removing option and product', async () => {
        render(<OrderPage />);
    
        const total = screen.getByText('Total Price:', { exact: false });
        const insuranceCheckbox = await screen.findByRole('checkbox', {
          name: 'Insurance',
        });
        userEvent.click(insuranceCheckbox);
    
        const americaInput = await screen.findByRole('spinbutton', { name: 'America' });
        userEvent.clear(americaInput);
        userEvent.type(americaInput, '3');
    
        userEvent.clear(americaInput);
        userEvent.type(americaInput, '1');
    
        expect(total).toHaveTextContent('1500');
      });
    });**
    ```
    
- 테스트
    - FAIL : 
    **`const total = screen.getByText('Total Price:', { exact: false });`에 값이 들어오고 있지 않으므로 :)**
- 실제 코드 작성
    
    `OrderPage.js`
    
    ```jsx
    // ..
    import { OrderContext } from '../../contexts/OrderContext';
    
    function OrderPage() {
      const [orderDatas] = useContext(OrderContext); // orderDatas 가져오기
      return (
        <div>
          {/* codes.. */}
          <div style={{ display: 'flex', marginTop: 20 }}>
            {/* codes.. */}
            <div style={{ width: '50%' }}>
              <h2>Total Price: {orderDatas.totals.total}</h2>
              <br />
              <button>주문</button>
            </div>
          </div>
        </div>
      );
    }
    ```
    
- 테스트
    - Success
    
    ```bash
    PASS  src/2-react-shop-test/pages/OrderPage/tests/calculate.test.js
      ✓ update product's total when products change (561 ms)
      ✓ update option's total when options change (117 ms)
      total price of goods and options
        ✓ total price starts with 0 and Updating total price when adding one product (152 ms)
        ✓ Updating total price when adding one option (145 ms)
        ✓ Updating total price when removing option and product (174 ms)
    ```