import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  console.log("getWinNumbers");
  // 0 ~ 45까지 숫자가 들어간 배열 만들기
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];

  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

class Lotto extends Component {
  state = {
    winNumbers: getWinNumbers(), // 당첨 숫자
    winBalls: [],
    bonus: null, // 보너스 공
    redo: false,
  };

  timeouts = [];

  componentDidMount() {
    // let을 사용하면 클로저 문제가 발생하지 않는다.
    for (let i = 0; i < this.state.winNumbers.length - 1; i++) {
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]],
          };
        });
      }, (i + 1) * 1000);
    }
    // bonus 점수 노출
    setTimeout(() => {
      this.timeouts[6] = this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  }

  componentWillUnmount() {
    // 반드시 setTimeout을 clear해줘야 한다. 그렇지 않으면 메모리 누수가 발생하여 성능 저하를 일으킨다.
    this.timeouts.forEach((t) => clearTimeout(t));
  }

  onClickRedo = () => {};

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
        <button onClick={redo ? this.onClickRedo : () => {}}>한번 더!</button>
      </>
    );
  }
}

export default Lotto;
