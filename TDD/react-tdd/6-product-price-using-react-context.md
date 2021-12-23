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
