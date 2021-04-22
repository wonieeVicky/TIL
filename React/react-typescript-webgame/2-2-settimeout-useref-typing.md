# setTimeout, useRef 타이핑

반응속도 체크 컴포넌트에서 setTimeout과 useRef 타이핑을 해보자.

```tsx
import * as React from "react";
import { useState, useRef, useCallback } from "react";

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요");
  const [result, setResult] = useState<number[]>([]); // 1. useState typing
  const timeout = useRef<number | null>(null); // 2. useRef: RefObject -> MutableRefObject
  const startTime = useRef(0);
  const endTime = useRef(0);

  const onClickScreen = useCallback(() => {
    if (state === "waiting") {
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      // 3. setTimeout 이벤트 window 지정
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

  // 4
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
```

1. useState의 초기 값이 빈 배열(`[]`)이면 타입추론 시 never가 된다. 때문에 제네릭으로 타입 추가해주자
2. useRef는 3가지 타입이 있다. `MutableRefObject<T>`, `RefObject`, `MutableRefObject<T | undefined>` 기존에 RefObject는 Readonly 속성을 가지므로 해당 영역을 MutableRefObject로 바뀌어 적용되도록 제네릭 타이핑을 추가해준다. (메서드별 타이핑 파일을 보면서 추론해나간다.)

   useRef는 값을 바꿔도 화면을 리렌더링하지 않으므로, 화면리렌더링 없이 값 변화가 필요할 때 사용한다.

3. setTimeout만 적으면 타입스크립트가 NodeJS의 `setTimeout`으로 인식하여 타입 에러가 발생한다. 이럴 경우에는 window.setTimeout으로 지정해주어 타입 에러를 방지할 수 있다.
4. 앞서 컴포넌트 이벤트에 타이핑을 해준 이유는 매개변수 인자가 있었기 때문, 전달되는 인자값이 없으면 타입지정도 필요없다.
