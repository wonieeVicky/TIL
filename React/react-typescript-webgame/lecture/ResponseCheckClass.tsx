import * as React from "react";
import { Component } from "react";

interface State {
  state: "waiting" | "now" | "ready";
  message: string;
  result: number[];
}

class ResponseCheckClass extends Component<{}, State> {
  // constructor를 제외한 짧은 문법으로 state 정의 시
  // state, result의 타입 추론이 되지않아 에러 발생
  // 아래와 같이 적을 수 있으나 매우 불필요한 코드가 늘어나므로 직접 State 인터페이스를 대입하여 처리한다.
  // state: "waiting" as "waiting" | "now" | "ready",
  // result: [] as number,
  state: State = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  timeout: number | null = null;
  startTime: number | null = null;
  endTime: number | null = null;

  onClickScreen = () => {
    const { state } = this.state;

    if (state === "waiting") {
      // 파란색
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      this.timeout = window.setTimeout(() => {
        // window 이벤트임을 명시해준다.
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
        return {
          state: "waiting",
          message: "클릭해서 시작하세요",
          result: [...prevState.result, this.endTime! - this.startTime!], // 타입스크립트의 한계, 확실히 존재하는 것은 !로 처리해준다.
        };
      });
    }
  };

  onReset = () => this.setState({ result: [] });

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : (
      <>
        <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
        <button onClick={this.onReset}>리셋</button>
      </>
    );
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

export default ResponseCheckClass;
