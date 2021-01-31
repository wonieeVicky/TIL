# 가위바위보 만들기

## 5-1. 리액트 라이프사이클 소개

- class 컴포넌트에서 무조건 PureComponent를 사용해야 할까?

리액트는 ReactDOM을 통해 렌더링이 되어 jsx를 돔에 붙여주는 순간에 특정한 동작을 할 수 있도록 라이프사이클을 제공한다. 주로 사용하는 라이프 사이클은 아래와 같다.

- `componentDidMount`

  컴포넌트가 첫 렌더링이 된 후 최초 1회만 실행, 리렌더링 시에는 동작하지 않는다.

- `componentWillUnmount`

  컴포넌트가 제거되기 직전 실행된다.

- `componentDidUpdate`

  컴포넌트가 리렌더링 되었을 때 실행된다.

위의 라이프사이클을 기준으로 클래스형 컴포넌트의 경우 아래와 같은 주기를 가진다.

- 초기

  constructor → render → ref rendering → componentDidMount

- setState / props 바뀔 때

  shouldComponentUpdate(true) _→_ render _→_ componentDidUpdate

- 부모가 나를 없앴을 때

  componentWillUnmount _→_ 소멸

## 5-2. setInterval과 라이프사이클 연동하기

setInterval과 같은 비동기 요청은 보통 componentDidMount에서 많이 한다. 또한 리액트에서는 해당 요청 비동기에 대한 종료를 따로 해주지 않기 때문에 componentWillUnmount에서 해당 비동기 요청을 정리해준다.

만약 setInterval이나 setTimeout 등의 완료되지 않은 비동기 요청을 별도로 정리해주지 않으면 이 모두가 메모리를 소요하는 것들이므로 나중에 터질 위험성이 있으니 유의하자

```jsx
// RSP.jsx
import React, { Component } from "react";

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

class RSP extends Component {
  state = {
    result: "",
    imgCoord: "0",
    score: 0,
  };

  interval;

  componentDidMount() {
    // 1. 비동기 요청
    this.interval = setInterval(() => {
      // 2. 변수 선언
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
    }, 1000);
  }

  componentWillUnmount() {
    // 3. 비동기 요청 정리
    clearInterval(this.interval);
  }

  onClickBtn = (choice) => {};

  render() {
    const { result, score, imgCoord } = this.state;
    return (
      <>
        <div
          id="computer"
          style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }}
        ></div>
        {/* ... */}
      </>
    );
  }
}

export default RSP;
```

1. componentDidMount에서 비동기 요청 시작
2. javascript에서 비동기함수가 바깥 변수를 참조하면 클로저가 발생하므로 setInterval 안에서는 반드시 참조하는 변수를 안에서 선언해줘야한다. (imgCoord)
3. componentWillUnmount에서 비동기 요청 정리

## 5-3. 가위바위보 게임 만들기

class형 컴포넌트로 가위바위보 게임 만들기

```jsx
import React, { Component } from "react";

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

  // 컴포넌트가 첫 렌더링된 후,(최초 1회) : 비동기 요청
  componentDidMount() {
    this.interval = setInterval(this.changeHand, 100);
  }

  // 컴포넌트가 제거되기 직전: 요청한 비동기 요청 정리
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // setInteval 상세 동작
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

  onClickBtn = (choice) => {
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
          <button id="rock" className="btn" onClick={() => this.onClickBtn("바위")}>
            바위
          </button>
          <button id="scissor" className="btn" onClick={() => this.onClickBtn("가위")}>
            가위
          </button>
          <button id="paper" className="btn" onClick={() => this.onClickBtn("보")}>
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
```

## 5-4. 고차 함수와 Q&A

1. onClick 등 이벤트 메서드 안에 함수를 호출하는 부분은 고차함수로 바꿀 수 있다.
   기존 jsx 내에 `<button onClick={()⇒this.onClickBtn('바위')}></button>`로 되어있던 문법을 아래와 같이 변경할 수 있는데, onClick 메서드 안에 함수 호출 부분인 `()⇒`는 실제 함수의 오른쪽 부분(`choice ⇒ (e) ⇒`)으로 위치시키면 된다.

```jsx
import React, { Component } from "react";

class RSP extends Component {
  onClickBtn = (choice) => (e) => {
    // ...
  };

  render() {
    return (
      <>
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
      </>
    );
  }
}

export default RSP;
```

2. 만약 setInterval 함수의 시간을 매우 빠르게 하면 setState와 render까지의 시간 사이에 엇갈리는 경우가 발생할까? 아니다. 해당 state와 render 사이에 엇갈리는 경우는 없다. 다만 setState를 동시에 여러번 실행시키면 해당 상태 변경마다 render가 되는 것이 아니라 모두 state가 변경된 뒤 최후 1번만 렌더링이 되므로 이 점 유의하자
