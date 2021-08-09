# 장바구니 예제

5번 주제를 통해 배워 본 함수형 프로그래밍을 기반으로 장바구니 예제를 만들어본다.

### 총 수량, 총 가격

```jsx
const products = [
  {name: '반팔티', price: 15000, quantity: 1, is_selected: true},
  {name: '긴팔티', price: 20000, quantity: 2, is_selected: false},
  {name: '핸드폰케이스', price: 15000, quantity: 3, is_selected: true},
  {name: '후드티', price: 30000, quantity: 4, is_selected: false},
  {name: '바지', price: 25000, quantity: 5, is_selected: false}
];

// 장바구니에 담긴 총 수량을 배열로 담기
go(
	products,
	map(p => p.quantity),
	log
); // [1, 2, 3, 4, 5]

const add = (a, b) => a + b;

// currying의 개념을 넣어 추상화 레벨을 높여본다.
const sum = curry((f, iter) => go(
	iter,
	map(f),
	reduce(add);
));

// 장바구니에 담긴 총 수량
const total_quantity = sum(p => p.quantity);
total_quantity(products); // 15

const total_price = sum(p => p.price * p.quantity);
total_price(products); // 345000

sum(u => u.age, [{age: 30},{age: 20},{age: 10}]; // 60
```

### HTML로 출력하기

위에서 만든 `total_quantity`와 `total_price`, `sum`를 바탕으로 HTML을 출력하는 함수를 아래와 같이 간단히 축약하여 구성할 수 있다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>HTML 출력해보기 - 장바구니</title>
    <script src="../lib/fx.js"></script>
  </head>
  <body>
    <div id="cart"></div>

    <script>
      const products = [
        { name: "반팔티", price: 15000, quantity: 1, is_selected: true },
        { name: "긴팔티", price: 20000, quantity: 2, is_selected: false },
        { name: "핸드폰케이스", price: 15000, quantity: 3, is_selected: true },
        { name: "후드티", price: 30000, quantity: 4, is_selected: false },
        { name: "바지", price: 25000, quantity: 5, is_selected: false },
      ];

      const add = (a, b) => a + b;

      const sum = curry((f, iter) => go(iter, map(f), reduce(add)));

      const total_quantity = sum((p) => p.quantity);
      const total_price = sum((p) => p.price * p.quantity);

      document.querySelector("#cart").innerHTML = `
    <table>
      <tr>
        <th></th>
        <th>상품 이름</th>
        <th>가격</th>
        <th>수량</th>
        <th>총 가격</th>
      </tr>
      ${go(
        products,
        sum(
          (p) => `
          <tr>
            <td><input type="checkbox" ${p.is_selected ? "checked" : ""}></td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><input type="number" value="${p.quantity}"></td>
            <td>${p.price * p.quantity}</td>
          </tr>
      `
        )
      )}
      <tr>
        <td colspan="3">합계</td>
				<!-- 선택된 상품의 총 수량 및 총 가격 -->
        <td>${total_quantity(filter((p) => p.is_selected, products))}</td>
        <td>${total_price(filter((p) => p.is_selected, products))}</td>
      </tr>
    </table>
  `;
    </script>
  </body>
</html>
```
