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
