# Class 컴포넌트 State Typing

### GuGuDan Class 컴포넌트 구현

```tsx
import * as React from "react";
import { Component } from "react";

// 1. state 타이핑
interface State {
  first: number;
  second: number;
  value: string;
  result: string;
}

// 1. state에 대한 타이핑을 제네릭으로 추가해준다.
class GuGuDan extends Component<{}, State> {
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: "",
    result: "",
  };

  // 2. 별도로 제외한 이벤트는 매개변수에 타입지정을 해줘야 한다.
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parseInt(this.state.value) === this.state.first * this.state.second) {
      this.setState((prevState) => {
        return {
          result: "정답:" + prevState.value,
          first: Math.ceil(Math.random() * 9),
          second: Math.ceil(Math.random() * 9),
          value: "",
        };
      });
      // 4. this.input Type Error 대비
      if (this.input) {
        this.input.focus();
      }
    } else {
      this.setState({
        result: "땡",
        value: "",
      });
      // 4. this.input Type Error 대비
      if (this.input) {
        this.input.focus();
      }
    }
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ value: e.target.value });

  // 3. input에 대한 타이핑
  input: HTMLInputElement | null = null;
  onRefInput = (c: HTMLInputElement) => (this.input = c);

  render() {
    return (
      <>
        <div>
          {this.state.first}곱하기 {this.state.second}는?
        </div>
        <form onSubmit={this.onSubmit}>
          <input ref={this.onRefInput} type="number" value={this.state.value} onChange={this.onChange} />
        </form>
        <div>{this.state.result}</div>
      </>
    );
  }
}

export default GuGuDan;
```

1. 클래스 컴포넌트의 경우 state에 대한 초기값을 타이핑해줘야 한다. interface로 타이핑을 추가해준 뒤 이 State 인터페이스를 Component의 두번째 제네릭 인자에 대입해준다. 첫번째에는 props에 대한 타입, 두번째에는 state에 대한 타입이 들어가기 때문에 두번째 인자에 넣는 것이다!
2. onSubmit, onChange, onRefInput 등 render 바깥에 분리한 이벤트의 경우 매개변수 인자로 넘어오는 데이터에 대한 타입 지정을 별도로 해줘야 한다. 어떤 데이터인지 모르겠을 때는 하위에 마우스를 올려 추론되는 값을 넣어준다 !
3. input에 대한 타입 지정 시 초기 값은 null로 설정하므로, 해당 타이핑도 `HTMLInputElement | null`로 해준다.
4. 해당 영역에 this.input.focus()만 넣어주면 타입 에러가 발생한다. 즉 해당 엘리먼트가 반드시 있을 것이라는 의미로 `!`를 사용해서 타입 에러를 막거나 `this.input`이 `null`이 아닌 경우를 if 분기로 체크해줘야 타입 에러가 발생하지 않는다.
