import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  timeout;
  startTime;
  endTime;

  onClickScreen = () => {
    const { state } = this.state;

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
        this.startTime = new Date(); // state에 담으면 렌더링이 다시 발생하므로 this 변수로 선언해준다.
      }, Math.floor(Math.random() * 1000) + 2000); // 2 ~ 3초 랜덤
    } else if (state === "ready") {
      clearTimeout(this.timeout);
      // 빨강색 : 성급하게 클릭
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
          result: [...prevState.result, this.endTime - this.startTime],
        };
      });
    }
  };

  onReset = () =>
    this.setState({
      result: [],
    });

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : (
      <>
        <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>
        <button onClick={this.onReset}>취소</button>
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

export default ResponseCheck;
