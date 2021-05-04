# useContext 타이핑

MineSearch 컴포넌트 하위의 Form 컴포넌트에 useContext를 적용해보면 아래와 같다

`Form.tsx`

```c
import * as React from "react";
import { TableContext } from "./MineSearch";
import { startGame } from "./action";
import { useState, useCallback, useContext, memo } from "react";

const Form = () => {
  const [row, setRow] = useState(5);
  const [cell, setCell] = useState(5);
  const [mine, setMine] = useState(5);

  const { dispatch } = useContext(TableContext); // 1. useContext로 사용할 값 가져옴

  const onChangeRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setRow(Number(e.target.value)), []);
  const onChangeCell = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCell(Number(e.target.value)), []);
  const onChangeMine = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setMine(Number(e.target.value)), []);

	// 2. actionCreator 불러와서 사용하거나 dispatch를 적용하여 이벤트 구현
  const onClickBtn = useCallback(() => startGame(row, cell, mine), [row, cell, mine]);
	// const onClickBtn = useCallback(() => dispatch({ type: START_GAME, row, cell, mine }), [row, cell, mine]);

  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn}>시작</button>
    </div>
  );
};

export default memo(Form); // 3. memo는 부모 컴포넌트로부터 내려받는 prop를 memoization 해준다.
```

1. 부모 컴포넌트에서 `TableContext.Provider`로 `ContextAPI`를 만들어주면 useContext 메서드를 사용해 필요한 값을 불러와 사용할 수 있음
2. 상단 useCotext에서 불러온 dispatch를 통해 이벤트 구현을 하거나, actionCreator를 사용하여 구현
3. memo로 컴포넌트를 감싸는 것은 Form 컴포넌트에 적절한 방법은 아니다. 왜냐하면 memo 메서드는 부모 컴포넌트로 부터 내려받는 props를 memoization 해주는 기능을 하기 때문(지금 Form에서는 부모 컴포넌트로부터 전달받는 값이 없으므로)
