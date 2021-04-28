# FC, useMemo

로또 추첨기를 만들면서 함수형 컴포넌트 내부의 `FunctionComponent`(`FC`)에 대한 타입 정의와 `useMemo` 타이핑을 배워본다.

`Lotto.tsx`

```tsx
import * as React from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  // codes...
}

const Lotto = () => {
  const lottoNumber = useMemo<number[]>(() => getWinNumbers(), []); // 1. useMemo 타이핑
  const [winNumbers, setWinNumbers] = useState(lottoNumber);
  const [winBalls, setWinBalls] = useState<number[]>([]); // 2. useState 타이핑
  const [bonus, setBonus] = useState<number | null>(null); // 2. useState 타이핑
  const [redo, setRedo] = useState(false);

  const timeouts = useRef<number[]>([]); // 2. useState 타이핑

  useEffect(() => {
    runTimeouts();
    // 3. window.setTimeout에 대한 이벤트 해지
    return () => timeouts.current.forEach((t) => clearTimeout(t));
  }, [timeouts.current]);

  const runTimeouts = () => {
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = window.setTimeout(
        () => setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]),
        (i + 1) * 1000
      );
    }
    timeouts.current[6] = window.setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
  };

  // 4. e : mouseEvent가 들어간다.
  const onClickRedo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setWinNumbers(getWinNumbers());
      setWinBalls([]);
      setBonus(null);
      setRedo(false);
      timeouts.current = [];
    },
    [winNumbers]
  );

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

1. useMemo를 사용했을 때 타입 추론이 잘 되지 않으면 제네릭을 사용해 타입지정을 해주면 된다.
2. useState에 초기 타입이 빈 배열[]일 경우 해당 데이터에 대한 타입 추론에 에러가 발생하므로 반드시 제네릭을 이용해 매개변수에 대한 타이핑을 해준다. 만일 초기값이 null일 경우에도 인자 값에 들어갈 정보에 대한 타이핑을 해준다.
3. window.setTimeout 이벤트의 경우 해당 이벤트에 대한 해지를 리턴으로 반드시 처리해주어야 성능 이슈가 발생하지 않는다.
4. 함수의 매개변수 자리에 e에는 React.MouseEvent가 오는 것을 잊지말자.

더불어, Ball 컴포넌트에 대한 타이핑을 아래와 같다.

`/Ball.tsx`

```tsx
import * as React from "react";
import { FC } from "react";

// 1. 함수 컴포넌트에서 props 타이핑
const Ball: FC<{ number: number }> = ({ number }) => {
  // codes..
  return {
    /* codes.. */
  };
};
export default Ball;
```

1. 함수 컴포넌트에서 props를 타이핑해줄 경우 FC라는 타입을 사용해 제네릭으로 인자를 넣어준다.
   SFC 는 `deprecated` 되었으니 `FC`나 `FunctionComponent`를 사용하여 타이핑해준다.

### + 클래스형 컴포넌트 타이핑

`LottoClass.tsx`

```tsx
import * as React from "react";
import { Component } from "react";
import BallClass from "./BallClass";

function getWinNumbers() {
  // codes...
}

interface State {
  winNumbers: number[];
  winBalls: number[];
  bonus: number | null;
  redo: boolean;
}

// props, state 타이핑
class Lotto extends Component<{}, State> {
  // constructor 외부에서 선언된 state에 타이핑 처리
  state: State = {
    winNumbers: getWinNumbers(),
    winBalls: [],
    bonus: null,
    redo: false,
  };

  timeouts: number[] = [];

  runTimeouts = () => {
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      // window.setTimeout 지정
      this.timeouts[i] = window.setTimeout(
        () =>
          this.setState((prevState) => {
            return {
              winBalls: [...prevState.winBalls, winNumbers[i]],
            };
          }),
        (i + 1) * 1000
      );
    }

    this.timeouts[6] = window.setTimeout(
      () =>
        this.setState({
          bonus: winNumbers[6],
          redo: true,
        }),
      7000
    );
  };

  componentDidMount() {
    this.runTimeouts();
  }

  componentWillUnmount() {
    this.timeouts.forEach((t) => clearTimeout(t));
  }

  //componentDidUpdate 내 매개변수에 타입 별도 지정 필요
  componentDidUpdate(prevProps: {}, prevState: State) {
    // codes..
  }

  onClickRedo = () => {
    // codes..
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return <>{/* codes.. */}</>;
  }
}

export default Lotto;
```

`BallClass.tsx`

```tsx
import * as React from "react";
import { Component } from "react";

// 초기 props에 대한 타입 선언
class Ball extends Component<{ number: number }> {
  render() {
    return {
      /*  codes... */
    };
  }
}
export default Ball;
```
