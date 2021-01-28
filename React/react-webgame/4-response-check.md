# 반응속도 체크 만들기

## 4-1. React 조건문

React에서는 render 함수 안에서 for과 if문을 사용하지 못한다. 반복문은 지난 시간 `map` 함수를 사용하는 것으로 그 활용법을 배워보았는데, 조건문은 어떻게 사용할까?

```jsx
// ResponseCheck.jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  onClickScreen = () => {};

  render() {
    return (
      <>
        <div id="screen" className={this.state.state} onClick={this.onClickScreen}>
          {this.state.message}
        </div>
        {
          // 조건부 연산자, 삼항 연산자
          this.state.result.length === 0 ? null : (
            <div>평균 시간: {this.state.result.reduce((a, b) => a + b) / this.state.result.length}ms</div>
          )
        }
      </>
    );
  }
}

export default ResponseCheck;
```

위 코드 처럼 조건부 연산자(혹은 삼항 연산자) 방식으로 많이 쓰며,
보통 return할 값이 없을 경우에는 null을 써주면 된다.

혹은 논리 AND연산자(&&)로도 아래와 같은 방법으로 쓸 수 있다.

```jsx
render() {
	// 논리 AND연산자(&&) 사용
	this.state.result.length && (
		<div>평균 시간: {this.state.result.reduce((a, b) => a + b) / this.state.result.length}ms</div>
	)
}
```

이와 별개로 render 함수 안이 조건문, 반복문 등으로 지저분해져 가독성이 떨어진다면 어떻게 해야할까?
조건문, 반복문으로 그려지는 돔을 별도의 함수로 분리하면 조금 더 가독성을 살릴 수 있다.(구조 분해도 함께!)

```jsx
// ResponseCheck.jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  // ..

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>;
  };

  render() {
    const { state, message } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage()} {/* 별도의 함수로 돔 렌더링 분리 */}
      </>
    );
  }
}

export default ResponseCheck;
```

## 4-2. setTimeout을 넣어 반응속도 체크

setTimeout을 넣어서 반응속도를 체크하는 코드를 작성해보자. 다만 `ready` 상태에서 성급하게 누른 경우에는 콜스택으로 넘어간 setTimeout에 대하여 clearTimeout을 해줘야 한다.

```jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  // 1. 렌더링이 필요없는 값 this 변수로 선언
  timeout;
  startTime;
  endTime;

  onClickScreen = () => {
    const { state, message, result } = this.state;
    if (state === "waiting") {
      // 파란색
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      this.timeout = setTimeout(() => {
        this.setState({
          state: "now",
          message: "지금 클릭!",
        });
        this.startTime = new Date();
      }, Math.floor(Math.random() * 1000) + 2000); // 2. 2 ~ 3초 랜덤
    } else if (state === "ready") {
      // 빨강색 : 성급하게 클릭
      // 3. setTimeout 취소
      clearTimeout(this.timeout);
      this.setState({
        state: "waiting",
        message: "너무 성급하시군요! 초록색이 된 후에 클릭하세요!!",
      });
    } else if (state === "now") {
      // 초록색 : 반응속도 체크
      this.endTime = new Date();
      this.setState((prevState) => {
        return {
          state: "waiting",
          message: "클릭해서 시작하세요",
          result: [...prevState.result, this.endTime - this.startTime], // 4. 값을 복사해준다.
        };
      });
    }
  };

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>;
  };

  render() {
    const { state, message } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage()}
      </>
    );
  }
}

export default ResponseCheck;
```

1. this.state에 해당 값을 담으면 렌더링이 다시 발생하므로 this 변수로 선언해주었다.
2. Math.floor(Math.random() \* 1000) + 2000 함수로 2 ~3초의 랜덤 시간을 뽑는다.
3. ready 상태에서 성급하게 누른 경우 콜스택에 들어간 setTimeout을 초기화 시켜준다.
4. 전개연산자를 사용해 값을 복사하여 immutable하게 관리한다.
