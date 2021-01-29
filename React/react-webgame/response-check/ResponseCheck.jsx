import React, { useState, useRef } from "react";

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요");
  const [result, setResult] = useState([]);

  // Hooks에서는 this의 속성들을 ref가 표현한다.
  // useState와 useRef의 차이? state는 값이 바뀌면 리렌더링 되지만, useRef는 렌더링되지 않는다.
  // 변하는 값을 잠시 기록해두는 의미와 비슷하다.
  // 값에 접근할 때에는 반드시 current를 함께 써줘야 한다.
  const timeout = useRef(null);
  const startTime = useRef();
  const endTime = useRef();

  const onClickScreen = () => {
    if (state === "waiting") {
      // 파란색
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      timeout.current = setTimeout(() => {
        setState("now");
        setMessage("지금 클릭!");
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000); // 2 ~ 3초 랜덤
    } else if (state === "ready") {
      clearTimeout(timeout);
      // 빨강색 : 성급하게 클릭
      setState("waiting");
      setMessage("너무 성급하시군요! 초록색이 된 후에 클릭하세요!!");
    } else if (state === "now") {
      // 초록색 : 반응속도 체크
      endTime.current = new Date();
      setState("waiting");
      setMessage("클릭해서 시작하세요");
      setResult((prevResult) => [...prevResult, endTime.current - startTime.current]);
    }
  };

  const onReset = () => setResult([]);

  const renderAverage = () => {
    return result.length === 0 ? null : (
      <>
        <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>
        <button onClick={onReset}>취소</button>
      </>
    );
  };

  return (
    <>
      <div id="screen" className={state} onClick={onClickScreen}>
        {message}
      </div>
      {renderAverage()}
    </>
  );
};

export default ResponseCheck;
