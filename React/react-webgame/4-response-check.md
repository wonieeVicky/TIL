# 반응속도 체크 만들기

## 4-1. React 조건문

React에서는 render 함수 안에서 for과 if문을 사용하지 못한다. 반복문은 지난 시간 `map` 함수를 사용하는 것으로 그 활용법을 배워보았는데, 조건문은 어떻게 사용할까?

```jsx
// ResponseCheck.jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  onClickScreen = () => {};

  render() {
    return (
      <>
        <div id="screen" className={this.state.state} onClick={this.onClickScreen}>
          {this.state.message}
        </div>
        {
          // 조건부 연산자, 삼항 연산자
          this.state.result.length === 0 ? null : (
            <div>평균 시간: {this.state.result.reduce((a, b) => a + b) / this.state.result.length}ms</div>
          )
        }
      </>
    );
  }
}

export default ResponseCheck;
```

위 코드 처럼 조건부 연산자(혹은 삼항 연산자) 방식으로 많이 쓰며,
보통 return할 값이 없을 경우에는 null을 써주면 된다.

혹은 논리 AND연산자(&&)로도 아래와 같은 방법으로 쓸 수 있다.

```jsx
render() {
	// 논리 AND연산자(&&) 사용
	this.state.result.length && (
		<div>평균 시간: {this.state.result.reduce((a, b) => a + b) / this.state.result.length}ms</div>
	)
}
```

이와 별개로 render 함수 안이 조건문, 반복문 등으로 지저분해져 가독성이 떨어진다면 어떻게 해야할까?
조건문, 반복문으로 그려지는 돔을 별도의 함수로 분리하면 조금 더 가독성을 살릴 수 있다.(구조 분해도 함께!)

```jsx
// ResponseCheck.jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  // ..

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>;
  };

  render() {
    const { state, message } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage()} {/* 별도의 함수로 돔 렌더링 분리 */}
      </>
    );
  }
}

export default ResponseCheck;
```

## 4-2. setTimeout을 넣어 반응속도 체크

setTimeout을 넣어서 반응속도를 체크하는 코드를 작성해보자. 다만 `ready` 상태에서 성급하게 누른 경우에는 콜스택으로 넘어간 setTimeout에 대하여 clearTimeout을 해줘야 한다.

```jsx
import React, { PureComponent } from "react";

class ResponseCheck extends PureComponent {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  // 1. 렌더링이 필요없는 값 this 변수로 선언
  timeout;
  startTime;
  endTime;

  onClickScreen = () => {
    const { state, message, result } = this.state;
    if (state === "waiting") {
      // 파란색
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      this.timeout = setTimeout(() => {
        this.setState({
          state: "now",
          message: "지금 클릭!",
        });
        this.startTime = new Date();
      }, Math.floor(Math.random() * 1000) + 2000); // 2. 2 ~ 3초 랜덤
    } else if (state === "ready") {
      // 빨강색 : 성급하게 클릭
      // 3. setTimeout 취소
      clearTimeout(this.timeout);
      this.setState({
        state: "waiting",
        message: "너무 성급하시군요! 초록색이 된 후에 클릭하세요!!",
      });
    } else if (state === "now") {
      // 초록색 : 반응속도 체크
      this.endTime = new Date();
      this.setState((prevState) => {
        return {
          state: "waiting",
          message: "클릭해서 시작하세요",
          result: [...prevState.result, this.endTime - this.startTime], // 4. 값을 복사해준다.
        };
      });
    }
  };

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>;
  };

  render() {
    const { state, message } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage()}
      </>
    );
  }
}

export default ResponseCheck;
```

1. this.state에 해당 값을 담으면 렌더링이 다시 발생하므로 this 변수로 선언해주었다.
2. Math.floor(Math.random() \* 1000) + 2000 함수로 2 ~3초의 랜덤 시간을 뽑는다.
3. ready 상태에서 성급하게 누른 경우 콜스택에 들어간 setTimeout을 초기화 시켜준다.
4. 전개연산자를 사용해 값을 복사하여 immutable하게 관리한다.

## 4-3. 성능 체크와 Q&A

성능체크를 위해 React devtool의 `Highlight updates when components render` 를 활성화해준다.
해당 옵션을 키고 보면 PureComponent가 적용되어 있어도,
평균시간과 리셋버튼 그리고 screen 영역에 불필요한 리렌더링이 발생하는 것을 볼 수 있다.
이를 개선하기 위해서는 자식 컴포넌트인 `renderAverage()`도 PureComponent로 만들어주어야 한다.
따라서 각 성격이나 유형이 다른 렌더링 요소들은 다른 컴포넌트로 분리해주는 것이 좋다.

또한 functional 컴포넌트의 경우 state가 변경되면 return 내의 돔만 리렌더링 되는 것이 아니라 함수 컴포넌트 전체가 리렌더링된다. 이러한 점은 이후 `useMemo`, `useCallback` 등의 함수로 개선해보자

## 4-4. 반응속도체크 Hooks로 변환하기

반응속도 체크를 Functional 컴포넌트로 변환해보자.
이번 변환에서는 클래스 컴포넌트에서 렌더링이 필요없는 값을 this 변수로 선언했던 timeout, startTime, endTime을 Functional 컴포넌트에서는 어떻게 변환하는지 집중해서 살펴보도록 한다.

```jsx
// ResponseCheck.jsx
import React, { useState, useRef } from "react";

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요");
  const [result, setResult] = useState([]);

  // 1. Functional 컴포넌트에서 this 함수를 선언하는 방법
  const timeout = useRef(null);
  const startTime = useRef();
  const endTime = useRef();

  const onClickScreen = () => {
    if (state === "waiting") {
      // 파란색
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      // 2. 값을 사용할 때는 current를 같이 적어줘야 한다!
      timeout.current = setTimeout(() => {
        setState("now");
        setMessage("지금 클릭!");
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000);
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
```

1. Hooks에서는 this의 속성들을 ref가 표현한다.
   State와 Ref의 차이는 리렌더링의 유/무이다. state는 값이 바뀌면 리렌더링 되지만, Ref는 렌더링되지 않는다. (화면에 영향을 주지 않는다) Ref는 변하는 값을 잠시 기록해두는 의미와 비슷하다.
2. ref로 선언된 값일 경우 해당 값에 접근할 때에는 반드시 current를 함께 써줘야 한다!

## 4-5. return 내부에 for와 if 쓰기

return 안에서는 보통 for와 if를 잘 쓰지 않는다. 코드가 복잡해져서, 가독성이 떨어지기 때문이다.
먼저 위 renderAverage 함수를 return 안에서 직접 If문으로 분기해보자

```jsx
import React, { useState, useRef } from "react";

const ResponseCheck = () => {
  // ...

  return (
    <>
      {/* return 내부에 if 쓰기 */}
      {(() => {
        if (!result.length) {
          return null;
        } else {
          return (
            <>
              <div>평균 시간: {result.reduce((a, b) => a + b) / result.length}ms</div>
              <button onClick={onReset}>취소</button>
            </>
          );
        }
      })()}
    </>
  );
};

export default ResponseCheck;
```

위와 같이 if문을 return 안에서 실행시킨다. 단 즉시 실행 함수 안에서 실행시켜주는 것이 좋다.
위와 같이 변환하면 코드는 동작하지만 가독성이 떨어지므로 위와 같이 renderAverage 처럼 함수로 별도 분리하거나 혹은 컴포넌트로 별도 분리하는 것이 더 좋다.

반복문도 마찬가지이다.
지난 시간에 배웠던 NumberBaseball의 map함수(반복문)를 return 안에서 직접 for문으로 변환해보자.

```jsx
import React, { useRef, useState, memo } from "react";
import Try from "./Try";

const NumberBaseball = memo(() => {
  // ..

  return (
    <>
      <ul>
        {(() => {
          const array = [];
          for (let i = 0; i < tries.length; i++) {
            array.push(<Try key={`${i + 1}차 시도 :`} tryInfo={v} index={i} />);
          }
          return array;
        })()}
      </ul>
    </>
  );
});

export default NumberBaseball;
```

위 코드를 보면 배열 안에 jsx 문법을 리턴하는데, 유효한 방법이다.
아래와 같이 배열로 값을 리턴해주면 map함수를 사용한 것처럼 정상적으로 렌더링되며 이렇게 할 경우 key값을 반드시 적어주어야 한다. (많이 쓰이지 않는 방법, 알아만 두자)

```jsx
const TestArrayReturn = () => {
  return [
    <div key="사과">사과</div>,
    <div key="배">배</div>,
    <div key="포도">포도</div>,
    <div key="오렌지">오렌지</div>,
    <div key="복숭아">복숭아</div>,
    <div key="바나나">사과</div>,
  ];
};

export default TestArrayReturn;
```
