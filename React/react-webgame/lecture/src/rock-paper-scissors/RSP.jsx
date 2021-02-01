import React, { useState, useEffect, useRef, memo } from "react";

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

const RSP = memo(() => {
  const [result, setResult] = useState("");
  const [imgCoord, setImgCoord] = useState(rspCoords.바위); // 상수가 있으면 상수로 적용해주는 것이 바람직하다.
  const [score, setScore] = useState(0);
  const interval = useRef(null);

  // useEffect: componentDidMount + componentDidUpdate + componentWillUnmount 역할(1대 1 대응은 아님)
  // []에 있는 imgCoord의 상태가 바뀔 때마다 함수 전체가 리렌더링 된다.
  // 두번째 인자에 [] 빈배열을 두면 첫 렌더링 후 한번만 실행된다. (componentDidMount)
  useEffect(() => {
    interval.current = setInterval(changeHand, 100);
    // componentWillUnmount 역할
    return () => clearInterval(interval.current);
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = (choice) => (e) => {
    // setInterval 리셋
    clearInterval(interval.current);

    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;

    if (diff === 0) {
      setResult("비겼습니다");
    } else if ([-1, 2].includes(diff)) {
      setResult("이겼습니다");
      setScore((prevState) => prevState + 1);
    } else {
      setResult("졌습니다ㅠㅠ");
      setScore((prevState) => prevState - 1);
    }

    // 2초 간 결과 확인 후 재 실행
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100);
    }, 2000);
  };

  return (
    <>
      <div
        id="computer"
        style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }}
      ></div>
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
});

export default RSP;
