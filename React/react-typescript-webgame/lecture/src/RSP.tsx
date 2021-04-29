import * as React from "react";
import { useState, useRef, useEffect } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const; // as const로 값 고정

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const; // as const로 값 고정

// type imgCoords = "0" | "-142px" | "-284px";
type ImgCoords = typeof rspCoords[keyof typeof rspCoords]; // code 중복이 없어진다.

// 강제 형변환 - undefined가 될 수도 있다는 것을 !를 사용하여 처리할 것
const computerChoice = (imgCoords: ImgCoords) =>
  (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => rspCoords[k] === imgCoords)!;

const RSP = () => {
  const [result, setResult] = useState("");
  const [imgCoord, setImgCoord] = useState<ImgCoords>(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    interval.current = window.setInterval(changeHand, 100);
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

  // 고차함수 타이핑
  const onClickBtn = (choice: keyof typeof rspCoords) => () => {
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
      interval.current = window.setInterval(changeHand, 100);
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
};

export default RSP;
