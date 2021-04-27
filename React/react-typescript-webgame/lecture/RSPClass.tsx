import * as React from "react";
import { Component } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

type ImgCoords = typeof rspCoords[keyof typeof rspCoords];

const computerChoice = (imgCoord: ImgCoords) =>
  (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((v) => rspCoords[v] === imgCoord);

interface State {
  result: string;
  imgCoord: ImgCoords;
  score: number;
}

class RSP extends Component<{}, State> {
  state: State = {
    result: "",
    imgCoord: rspCoords.바위,
    score: 0,
  };

  interval: number | null = null;

  // 컴포넌트가 첫 렌더링된 후,(최초 1회) 리렌더링 시에는 동작하지 않음: 비동기 요청(setInterval 등)
  componentDidMount() {
    this.interval = window.setInterval(this.changeHand, 100);
  }
  // 컴포넌트가 제거되기 직전: 요청한 비동기 요청 정리
  componentWillUnmount() {
    clearInterval(this.interval!);
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

  onClickBtn = (choice: keyof typeof rspCoords) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const { imgCoord } = this.state;
    clearInterval(this.interval!);

    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)!];
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

    setTimeout(() => {
      this.interval = window.setInterval(this.changeHand, 100);
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
