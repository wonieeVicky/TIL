import * as React from "react";
import { useState, useRef, useCallback } from "react";

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요");
  const [result, setResult] = useState<number[]>([]); // useState [] 빈배열이면 타입추론 시 never가 된다.
  const timeout = useRef<number | null>(null); // useRef는 3가지 타입이 있음 기본 RefObject -> MutableRefObject가 되도록 제너릭을 조정해준다.
  const startTime = useRef(0); // useRef는 값을 바꿔도 화면을 리렌더링하지 않음
  const endTime = useRef(0);

  const onClickScreen = useCallback(() => {
    if (state === "waiting") {
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      // setTimeout만 적으면 NodeJS의 setTimeout으로 인식하여 타입 에러 발생 -> window.setTimeout으로 변경하자
      timeout.current = window.setTimeout(() => {
        setState("now");
        setMessage("지금 클릭!");
        startTime.current = new Date().getTime();
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (state === "ready") {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setState("waiting");
      setMessage("너무 성급하시군요! 초록색이 된 후에 클릭하세요!!");
    } else if (state === "now") {
      endTime.current = new Date().getTime();
      setState("waiting");
      setMessage("클릭해서 시작하세요");
      setResult((prevResult) => [...prevResult, endTime.current - startTime.current]);
    }
  }, [state]);

  const onReset = useCallback(() => setResult([]), []);

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
