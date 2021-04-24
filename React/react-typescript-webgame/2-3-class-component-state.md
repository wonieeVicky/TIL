# Class 컴포넌트에서 State 사용 시 주의점

이제 반응속도 체크를 클래스형 컴포넌트로 타이핑해본다.
이번 클래스형 컴포넌트에서는 초기 선언하는 짧은 문법의 state 사용 시 나타나는 타입 에러와 타입스크립트의 한계로 인한 !사용에 대한 예시를 확인할 수 있다.

```tsx
import * as React from "react";
import { Component } from "react";

// 1. State에 대한 타입지정
interface State {
  state: "waiting" | "now" | "ready";
  message: string;
  result: number[];
}

class ResponseCheckClass extends Component<{}, State> {
  // 2.constructor를 사용하지않은 state 정의 시 타이핑
  state: State = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  // 3. useRef 메서드 타이핑
  timeout: number | null = null;
  startTime: number | null = null;
  endTime: number | null = null;

  onClickScreen = () => {
    const { state } = this.state;

    if (state === "waiting") {
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      // 4. window 이벤트임을 명시해준다.
      this.timeout = window.setTimeout(() => {
        this.setState({
          state: "now",
          message: "지금 클릭!",
        });
        this.startTime = new Date().getTime();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === "ready") {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.setState({
        state: "waiting",
        message: "너무 성급하시군요! 초록색이 된 후에 클릭하세요!!",
      });
    } else if (state === "now") {
      this.endTime = new Date().getTime();

      this.setState((prevState) => {
        // 5. !로 강제 타이핑 처리
        //실제 new Date().getTime()은 number가 확실함에도 타입추론 시 에러 발생
        // 즉 이런 경우 타입스크립트의 한계로 판단하여, 확실히 존재하는 것은 !로 처리해준다.
        return {
          state: "waiting",
          message: "클릭해서 시작하세요",
          result: [...prevState.result, this.endTime! - this.startTime!],
        };
      });
    }
  };

  onReset = () => this.setState({ result: [] });
  renderAverage = () => {
    /* codes.. */
  };
  render() {
    const { state, message } = this.state;
    return <>{/* codes... */}</>;
  }
}

export default ResponseCheckClass;
```

1. 클래스 컴포넌트 사용 시에는 반드시 초기에 Props와 State에 대한 타입정의를 해줘야 한다. 이를 위한 인터페이스 타입 정의이다. (`class ResponseCheckClass extends Component<{}, State>`)
2. 클래스 컴포넌트에서 constructor를 제외한 짧은 문법으로 state를 정의할 때 타입 추론이 되지 않아 에러가 발생한다. state, result의 타입 추론이 올바르게 되지 않는 경우이다. (유니온 타입, 초기값 빈배열의 경우)

   `state: "waiting" as "waiting" | "now" | "ready"`, `result: [] as number`로 직접 값에 타이핑하여 타입에러를 개선할 수 잇으나 불필요한 코드가 늘어나므로 간단하게 State 인터페이스를 대입하는 방법으로 처리해준다.

3. useRef의 초기 값에 대한 타이핑을 각각 해준다. `useRef`를 사용하는 이유는 값 변경은 하되 화면 렌더링이 발생하지 않도록 하는 변수들이나 값을 다룰 때 사용한다.
4. 타입스크립트는 node, window 가 동일한 이벤트를 가지고 있을 경우 두 가지 환경에 따른 타입이 각각 존재하므로 명확히 타입 지정을 하지 않을 경우 추론 과정에서 에러가 발생한다. 따라서 window.setTimeout으로 명확히 적어준다!
5. 느낌표`!`를 사용하여 강제 타이핑을 해준다.
   에러를 발생시키는 this.endTime, this.startTime의 경우 new Date().getTime()으로 number 타입이 명확함에도 타입스크립트에서 에러를 발생시킨다. 즉 이런 경우 타입스크립트의 한계로 판단하여 확실히 존재하는 값으로 !를 사용하여 타입을 number로 처리해준다.
