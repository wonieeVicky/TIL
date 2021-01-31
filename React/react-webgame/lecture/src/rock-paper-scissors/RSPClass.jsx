import React, { Component } from "react";

// 클래스의 경우 아래의 주기를 가진다.
// 초기: constructor -> render -> ref 설정 -> componentDidMount
// setState / props 바뀔 때: -> shouldComponentUpdate(true) -> render -> componentDidUpdate
// 부모가 나를 없앴을 때: componentWillUnmount -> 소멸

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

const computerChoice = (imgCoord) => Object.entries(rspCoords).find((v) => v[1] === imgCoord)[0];

class RSP extends Component {
  state = {
    result: "",
    imgCoord: "0",
    score: 0,
  };

  interval;

  // 컴포넌트가 첫 렌더링된 후,(최초 1회) 리렌더링 시에는 동작하지 않음: 비동기 요청(setInterval 등)
  componentDidMount() {
    this.interval = setInterval(this.changeHand, 100);
  }
  // 컴포넌트가 제거되기 직전: 요청한 비동기 요청 정리
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeHand = () => {
    const { imgCoord } = this.state;
    if (imgCoord === rspCoords.바위) {
      this.setState({
        imgCoord: rspCoords.가위,
      });
    } else if (imgCoord === rspCoords.가위) {
      this.setState({
        imgCoord: rspCoords.보,
      });
    } else {
      this.setState({
        imgCoord: rspCoords.바위,
      });
    }
  };

  onClickBtn = (choice) => (e) => {
    const { imgCoord } = this.state;

    // setInterval 리셋
    clearInterval(this.interval);

    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;

    if (diff === 0) {
      this.setState({
        result: "비겼습니다",
      });
    } else if ([-1, 2].includes(diff)) {
      this.setState((prevState) => {
        return {
          result: "이겼습니다~!",
          score: prevState.score + 1,
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          result: "졌습니다ㅠㅠ",
          score: prevState.score - 1,
        };
      });
    }

    // 2초 간 결과 확인 후 재 실행
    setTimeout(() => {
      this.interval = setInterval(this.changeHand, 100);
    }, 2000);
  };

  render() {
    const { result, score, imgCoord } = this.state;
    return (
      <>
        <div
          id="computer"
          style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }}
        ></div>
        <div>
          <button id="rock" className="btn" onClick={this.onClickBtn("바위")}>
            바위
          </button>
          <button id="scissor" className="btn" onClick={this.onClickBtn("가위")}>
            가위
          </button>
          <button id="paper" className="btn" onClick={this.onClickBtn("보")}>
            보
          </button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
  }
}

export default RSP;
