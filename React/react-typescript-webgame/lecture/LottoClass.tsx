import * as React from "react";
import { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  const candidate = Array(45)
    .fill(null)
    .map((v, i) => i + 1);
  const shuffle = [];

  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

interface State {
  winNumbers: number[];
  winBalls: number[];
  bonus: number | null;
  redo: boolean;
}

// props, state 타이핑
class Lotto extends Component<{}, State> {
  state: State = {
    winNumbers: getWinNumbers(), // 당첨 숫자
    winBalls: [],
    bonus: null, // 보너스 공
    redo: false,
  };

  timeouts: number[] = [];

  runTimeouts = () => {
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      // window.setTimeout 지정
      this.timeouts[i] = window.setTimeout(
        () =>
          this.setState((prevState) => {
            return {
              winBalls: [...prevState.winBalls, winNumbers[i]],
            };
          }),
        (i + 1) * 1000
      );
    }

    this.timeouts[6] = window.setTimeout(
      () =>
        this.setState({
          bonus: winNumbers[6],
          redo: true,
        }),
      7000
    );
  };

  componentDidMount() {
    this.runTimeouts();
  }

  componentWillUnmount() {
    this.timeouts.forEach((t) => clearTimeout(t));
  }

  //componentDidUpdate 내 매개변수에 타입 별도 지정 필요
  componentDidUpdate(prevProps: {}, prevState: State) {
    if (!this.state.winBalls.length) {
      this.runTimeouts();
    }
    if (prevState.winNumbers !== this.state.winNumbers) {
      console.log("로또 숫자를 생성합니다");
    }
  }

  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <>
        <div>당첨 숫자</div>
        <div id="결과창">
          {winBalls.map((v) => (
            <Ball key={v} number={v} />
          ))}
        </div>
        <div>보너스!</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>한번 더!</button>}
      </>
    );
  }
}

export default Lotto;
