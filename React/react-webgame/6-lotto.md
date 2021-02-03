# 로또 추첨기 만들기

## 6-1. 로또 추첨기 컴포넌트

setTimeout으로 무작위로 생성한 7개의 숫자를 순서대로 노출하는 컴포넌트를 만들어본다.

1. 먼저 7개의 순서를 무작위로 생성하는 별도의 함수가 필요하다.

```jsx
function getWinNumbers() {
  // 0 - 45까지 들어있는 배열 생성
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  // 랜덤 숫자를 넣는 빈 배열 생성
  const shuffle = [];
  // candidate가 빈배열이 될 때까지 아래 코드를 동작시킨다.
  while (candidate.length > 0) {
    // 랜덤한 값을 shuffle에 push
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  // 맨 마지막 bonusNumber 가져오기
  const bonusNumber = shuffle[shuffle.length - 1];
  // 0 - 6번쨰 숫자를 가져와 오름차순으로 정렬
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  // 값 리턴
  return [...winNumbers, bonusNumber];
}
```

2. 또한 해당 점수를 컴포넌트로 렌더링 해 줄 Ball 컴포넌트가 필요하다.

```jsx
import React, { memo } from "react";

// 컴포넌트를 다른 컴포넌트로 감싸주는 것을 HOC(high order component)라고 한다.
const Ball = memo(({ number }) => {
  let background;
  if (number <= 10) {
    background = "red";
  } else if (number <= 20) {
    background = "orange";
  } else if (number <= 30) {
    background = "yellow";
  } else if (number <= 40) {
    background = "blue";
  } else {
    background = "green";
  }

  return (
    <div className="ball" style={{ background }}>
      {number}
    </div>
  );
});
export default Ball;
```

가장 마지막에 오는 자식 컴포넌트의 경우 보통 PureComponent나 memo를 넣어 불필요한 리렌더링을 방지해준다. 위 코드처럼 컴포넌트를 다른 컴포넌트로 감싸주는 방식을 HOC(high order component)라고 하며, 위와 같은 함수형 컴포넌트는 PureComponent가 아니기 때문에 별도 memo 메서드로 감싸주어야 PureComponent 역할을 한다.

## 6-2. setTimeout 여러 번 사용하기

이번 게임에서는 그동안 배웠던 조건문과 반복문을 통 틀어서 사용해볼 수 있다.

```jsx
import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() { ... }

class Lotto extends Component {
  state = {
    winNumbers: getWinNumbers(), // 당첨 숫자
    winBalls: [],
    bonus: null, // 보너스 공
    redo: false,
  };

  timeouts = [];

  componentDidMount() {
    const { winNumbers } = this.state;
    // 1. let을 사용하면 클로저 문제가 발생하지 않는다.
    for (let i = 0; i < winNumbers.length - 1; i++) {
			// 2. setTimeout 여러번 사용하기
      this.timeouts[i] = setTimeout(
        () =>
          this.setState((prevState) => {
            return {
              winBalls: [...prevState.winBalls, winNumbers[i]],
            };
          }),
        (i + 1) * 1000
      );
    }
    // 2. setTimeout 여러번 사용하기: bonus 점수 노출
    this.timeouts[6] = setTimeout(
      () =>
        this.setState({
          bonus: winNumbers[6],
          redo: true,
        }),
      7000
    );
  }

  componentWillUnmount() {
    // 3. 반드시 setTimeout을 clear해줘야 한다.
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
        {redo && <button onClick={this.onClickRedo}>한번 더!</button>}
      </>
    );
  }
}

export default Lotto;
```

1. for 문에서 let을 사용하면 클로저 문제가 발생하지 않는다.
2. setTimeout을 여러번 사용하기, for 문 안에서 setTimeout을 순차적으로 실행해주고, 해당 값을 this.timeout에 배열 값으로 넣어준다.
3. setTimeout, setInterval 등은 반드시 componentWillUnmount 지점 등 clear 처리를 해줘야 한다. 그렇지 않으면 메모리 누수가 발생하여 성능 저하를 일으킨다.

## 6-3. componentDidUpdate

```jsx
import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() { ... }

class Lotto extends Component {
  state = { ...  };
  timeouts = [];

	// 1. setTimeout 동작부분 분리
  runTimeouts = () => {
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      this.timeouts[i] = setTimeout(
        () =>
          this.setState((prevState) => {
            return {
              winBalls: [...prevState.winBalls, winNumbers[i]],
            };
          }),
        (i + 1) * 1000
      );
    }
    this.timeouts[6] = setTimeout(
      () =>
        this.setState({
          bonus: winNumbers[6],
          redo: true,
        }),
      7000
    );
  };

  componentDidMount() {
		// 2. setTimeout 실행
    this.runTimeouts();
  }

  componentWillUnmount() {
    this.timeouts.forEach((t) => clearTimeout(t));
  }

  componentDidUpdate(prevProps, prevState) {
		// 4. 변경되는 시점 체크 (!this.state.bonus or !this.state.redo 가능)
    if (!this.state.winBalls.length) {
			// setTimeout 실행
      this.runTimeouts();
    }
  }

  onClickRedo = () => {
    // 3. 초기화 시켜준다.
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    return ( {/*  */} );
  }
}

export default Lotto;
```

1. setTimeout 동작 부분 코드를 별도 함수로 분리한다. (재실행 시에도 사용해야하므로)
2. 필요한 위치(componentDidMount, componentDidUpdate)에서 runTimeouts 실행
3. onClickRedo라는 이벤트에서 state 값을 초기화 시켜준다.
   → state가 변경되어 componentDidUpdate 발생함
4. 변경되는 시점을 체크해서, 해당 경우에 runTimeouts 함수를 실행시킨다.

## 6-4. useEffect로 업데이트 감지하기

클래스형 컴포넌트를 Hooks로 바꿔보자.

```jsx
import React, { useEffect, useState, useRef } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  console.log("getWinNumbers");
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

const Lotto = () => {
  const [winNumbers, setWinNumbers] = useState(getWinNumbers());
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);

  const timeouts = useRef([]);

  // 1. useEffect의 두번째 인자 확인!
  useEffect(() => {
    runTimeouts();
    // 3. componentWillUnmount
    return () => timeouts.current.forEach((t) => clearTimeout(t));
  }, [timeouts.current]); // 2. 값 변경 감지 trigger

  const runTimeouts = () => {
    console.log("useEffect");
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]), (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
  };

  const onClickRedo = () => {
    // 초기화 시켜준다.
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);

    timeouts.current = []; // 2
  };

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
      {redo && <button onClick={onClickRedo}>한번 더!</button>}
    </>
  );
};

export default Lotto;
```

1. useEffect의 두번째 인자에 따라 상황이 달라진다.
   - 두번째 인자가 빈 배열이면 `componentDidMount`와 동일하다.
   - 두번째 인자에 요소가 있으면 `componentDidMount`와 `componentDidUpdate` 둘 다 수행
2. 값 변경 감지 트리거를 timeout.current로 보았는데,
   setTimeout을 실행시키는 timeouts.current[i] 시에 모두 변경시키는 것은 아닐까? - 아니다. timeouts.current의 배열에 데이터를 넣어주는 것은 값 변경 감지를 하지 못함 - 단, 해당 값을 직접 바꿔주면 값 변경감지가 가능하다.
3. componentWillUnmount의 경우 useEffect의 return 안에서 실행해준다.

## 6-5. useMemo와 useCallback

1. useMemo

   Hooks로 변경한 위 코드에서 getWinNumbers의 콘솔이 동작마다 재실행되는 것을 확인할 수 있다.
   왜 그런걸까? 바로 Hooks의 특성때문인데 전체 컴포넌트가 다시 실행되기 때문이다.
   리렌더링 시useState(getNumbers())도 함께 다시 실행되는데, 만약 10초씩 걸리는 코드가 포함되어있다면 엄청난 성능저하를 불러올 것이다.

   이럴 때 사용하는 것이 캐싱(?) 기능을 사용할 수 있는데 useMemo를 쓰면 된다. 함수 실행 값을 저장하는 방법이다. useMemo를 사용하면 Hooks가 `getWinNumbers`를 기억하므로 useMemo 함수의 두번째 인자가 바뀌지 않는 이상, 리렌더링 시 다시 함수를 동작시키지 않는다.

   ```jsx
   import React, { useEffect, useState, useRef, useMemo } from "react";

   function getWinNumbers() { ... }

   const Lotto = () => {
     const lottoNumber = useMemo(() => getWinNumbers(), []);
     const [winNumbers, setWinNumbers] = useState(lottoNumber);

   	// ...
   }

   export default Lotto;
   ```

   Hooks를 초기에 다룰 때에는 별도의 함수에 반드시 디버그 콘솔을 추가하여 필요할 때만 실행되는지 확인하면서 작업하는 것이 좋다!

2. useCallback

   `useMemo`는 함수의 리턴값을 기억하는 것인 반면, `useCallback`은 함수 자체를 기억하는 것이다.
   함수 컴포넌트는 전체가 리렌더링 되므로 함수 자체가 리렌더링되는 것을 막아 성능 최적화를 할 수 있다. 예를 들어 아래와 같이 onClickRedo라는 이벤트 함수에 useCallback을 감싸주면 Hooks가 리렌더링 될 때 해당 함수를 새로 생성하지 않는다.

   ```jsx
   const onClickRedo = useCallback(() => {
     setWinNumbers(getWinNumbers());
     setWinBalls([]);
     setBonus(null);
     setRedo(false);
     timeouts.current = [];
   }, []);
   ```

   이처럼 함수 생성 자체가 시간이 오래 소요되는 경우 useCallback을 사용하면 좋다.
   그렇다면, 함수마다 모두 useCallback을 사용해주는 것이 좋을까?
   반은 맞고, 반을 틀리다 onClickRedo 함수에 `console.log(winNumbers);`를 추가해보자
   당첨숫자(winNumbers) 데이터가 바뀌었으나 **초기 데이터가 바뀌지 않고 유지**되는 것을 확인할 수 있다.
   초기값까지 계속 기억하는 것이다. 따라서 변경되는 값을 모두 인지시키고 싶을 경우 useCallback의 두번째 인자에 반드시 추가해주어야 한다.

   ```jsx
   const onClickRedo = useCallback(() => {
     console.log(winNumbers); // winNumbers의 값이 바뀌면 함수를 새로 생성한다!
     setWinNumbers(getWinNumbers());
     setWinBalls([]);
     setBonus(null);
     setRedo(false);
     timeouts.current = [];
   }, [winNumbers]);
   ```

   반면, 반드시 useCallback을 사용해야하는 때도 있다.
   자식 컴포넌트에 이벤트 함수를 props로 내려주는 경우가 바로 그 때이다. useCallback이 없으면 매번 새로운 함수가 생성되는데, 자식 컴포넌트의 props에 새로운 함수를 계속 부여하면, 자식 컴포넌트는 매번 새로운 값을 부여받는다고 인지하여 매번 리렌더링될 것이다.

위 코드처럼 useMemo, useCallback 그리고 useEffect의 두번째 인자는 매우 중요하다!!
어떨 때 해당 부분이 다시 실행될지 결정하는 인자가 되기 때문이다.

## 6-6. Hooks에 대한 자잘한 팁들

1.  순서가 중요한 Hooks 시리즈

    Hooks 시리즈(useState, useRef, useEffect 등)는 순서가 매우 중요한 메서드이다.
    따라서 중간에 바뀌거나, 조건문에 의해 실행되거나, 여타의 코드로 인해 실행 순서를 변경해서도 안된다.

    ```jsx
    import React, { useState } from "react";

    const Example = () => {
      const [winNumbers, setWinNumbers] = useState(lottoNumber);
      if (조건) {
        const [winBalls, setWinBalls] = useState([]);
      }
    };

    export default Example;
    ```

    위와 같이 조건문 안에 절대로 넣어선 안되고, 함수나 반복문 안에도 웬만하면 넣지 않는 것이 좋다.
    또한 Hooks안에 또다른 Hooks를 넣는 것도 안된다. (useEffect안에 useState 추가 등)

    함수나 반복문 안에 넣는 것은 가능하나 순서가 확실히 보장되어 있는 경우에만 쓰는 것이 좋다.(순서가 중요해!)

2.  만약 Hooks 컴포넌트에서 `componentDidUpdate`에서만 실행하고 싶다면 어떻게 할까?
    useRef를 활용하여 패턴을 만들면 componentDidUpdate에서만 실행하도록 만들 수 있다!

        ```jsx
        import React, { useEffect, useRef } from "react";

        const Example = () => {
        	useEffect(() => {
        		// ajax 통신 등
        	}, []);

        	const mounted = useRef(false);

        	useEffect(() => {
        		if(!mounted.current){
        			mounted.current = true;
        		} else {
        			// ajax 통신 등 componentDidUpdate에서만 실행!
        		}
        	}, [mounted])
        }

        export default Example;
        ```
