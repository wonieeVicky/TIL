## 더 나은 리액트 테스트 하기

### [Query 사용 우선 순위](http://testing-library.com/docs/queries/aboue/#priority)

`screen.getByTestId()`

현재까지는 `getByTestId()` 쿼리를 이용하여 엘리먼트에 접근 후 테스트 진행. 이외로도 testing library에서 추천하는 쿼리 사용 우선 순위가 있으니 확인해본다.

- getByRole: 접근성 준수할 수 있는 엘리먼트 접근 메서드
  - `getByRole('button', { name: /submit/i })`
- getByLabelText: 폼 에서 사용하기 좋은 엘리먼트 접근 메서드
- getByPlaceholderText
- getByText: 폼 영역 바깥에 접근해야하는 엘리먼트 접근 메서드(div, span, paragraph)
- getByDisplayValue
- getByAltText: img. area. input 등 접근 시 사용
- getByTitle
- getByTestId: 어떤 경우에도 사용할 수 있는 방법이 없을 때, id값으로 찾는다.

### userEvent > fireEvent

버튼 클릭 이벤트 테스트 코드에서 사용했던 fireEvent API보다 userEvent API를 사용하는 것이 더 좋은 방법이다. fireEvent.click(element) < userEvent.click(element)

- userEvent
  userEvent는 fireEvent를 사용해서 만들어짐. userEvent의 내부 코드를 보면 fireEvent를 사용하면서 엘리먼트 타입에 따라 Label을 클릭했을 때, checkbox, radio를 클릭했을 때 그 엘리먼트 타입에 맞는 더욱 적절한 대응을 할 수 있다.
  예를 들어 fireEvent로 버튼을 클릭하면, fireEvent.click(button) 버튼이 focus 되지 않으나 userEvent를 사용할 경우 userEvent.click(button) 버튼이 focus 된다. 이렇게 실제 사용하는 유저가 보기에 실제 버튼을 클릭하는 행위를 더 잘 표현할 수 있으므로 userEvent를 사용하는 것이 더 추천됨.

```jsx
function click(element, init, { skipHover = false, clickCount = 0 } = {}) {
  if (!skipHover) hover(element, init);
  switch (element.tagName) {
    case "LABEL":
      clickLabel(element, init, { clickCount });
      break;
    case "INPUT":
      if (element.type === "checkbox" || element.type === "radio") {
        clickBooleanElement(element, init, { clickCount });
      } else {
        clickElement(element, init, { clickCount });
      }
      break;
    default:
      clickEvent(element, init, { clickCount });
  }
}
```
