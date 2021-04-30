# useReducer, dispatch, children Typing

이번에는 TicTacToe 게임을 만들어보면서 useReducer 관련 타이핑을 해본다.  
(initialState, actionCreator, reducer 등)

```tsx
import * as React from "react";
import { useEffect, useCallback, useReducer, Reducer } from "react";
import Table from "./Table";

// 1. initialState 타이핑
interface ReducerState {
  winner: "O" | "X" | "";
  turn: "O" | "X";
  tableData: string[][];
  recentCell: [number, number];
}

// 2. initialState에 ReducerState 타입 적용
const initialState: ReducerState = {
  // state..
};

export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";
export const RESET_GAME = "RESET_GAME";

// 3. 각 action에 대한 반환 값의 타입정의 필요
interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: "O" | "X";
}
// 4. action creator 내 타입 적용
const setWinner = (winner: "O" | "X"): SetWinnerAction => {
  return { type: SET_WINNER, winner };
};

// 3. 각 action에 대한 반환 값의 타입정의 필요
interface ClickCellAction {
  type: typeof CLICK_CELL;
  row: number;
  cell: number;
}
// 4. action creator 내 타입 적용
const clickCell = (row: number, cell: number): ClickCellAction => {
  return { type: CLICK_CELL, row, cell };
};

// 3. 각 action에 대한 반환 값의 타입정의 필요
interface ChangeTurnAction {
  type: typeof CHANGE_TURN;
}
// 3. 각 action에 대한 반환 값의 타입정의 필요
interface ResetGameAction {
  type: typeof RESET_GAME;
}

// 5. action에 대한 타입은 유니온 타입으로 설정
type ReducerActions = SetWinnerAction | ClickCellAction | ChangeTurnAction | ResetGameAction;

// 6. 매개변수에 들어갈 state, action에 대한 타입을 적용해주고, 반환값 또한 타이핑해준다.
const reducer = (state: ReducerState, action: ReducerActions): ReducerState => {
  switch (
    action.type
    // codes...
  ) {
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, turn, winner, recentCell } = state;
  const onClickTable = useCallback(() => dispatch(setWinner("O")), []);

  return (
    <>
      <Table onCLick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
```

1. useReducer를 사용할 때에는 state에 대한 관리를 하나로 관리하므로 `initialState`를 선언 후 해당 객체에 대한 타입 선언을 해줘야 한다. 객체에 대한 타입 정의는 인터페이스로 한다.
2. 1에서 만들어놓은 인터페이스 타입을 `initialState`에 적용해준다.
3. `actionCreator`의 리턴 값에 대한 타입이 액션별로 필요하다.
   setWinnerAction, ClickCellAction, ChangeTurnAction, ResetGameAction ..
4. 3에서 만들어놓은 반환 값에 대한 인터페이스 타입을 `actionCreator`에 적용해준다.
5. `reducer`에 대한 타입 정의 시 action에 대한 타입 정의가 필요한데, action은 3에서 만들어 준 action 중 하나가 실행되므로 해당 값을 type Alias로 선언해준다.
6. `reducer`의 state, action 그리고 반환 값에 기존에 만들어놓은 ReducerState, ReducerActions로 타입 선언을 해주면 해당 타입에 맞춰 반환값이 운영된다.

이제 자식 컴포넌트에 대한 타입정의를 순차적으로 해보자.

`Table.tsx`

```tsx
import * as React from "react";
import { useMemo, FC, Dispatch } from "react";
import Tr from "./Tr";

interface Props {
  tableData: string[][];
  dispatch: Dispatch<any>;
  onClick: () => void;
}

// 1. Table 컴포넌트는 Function Component이며, props를 상속받음
const Table: FC<Props> = ({ tableData, dispatch }) => {
  return (
    <table>
      {Array(tableData.length)
        .fill(null)
        .map((tr, i) =>
          useMemo(() => <Tr key={i} dispatch={dispatch} rowIndex={i} rowData={tableData[i]} />, [tableData[i]])
        )}
    </table>
  );
};

export default Table;
```

1. Table 컴포넌트는 `FC` 타입이며 `props`를 상속받기 때문에 해당 내용을 Props라는 인터페이스로 타입 정의를 해줘서 대입해줘야 한다. 이때 key 값은 별도로 타이핑을 해주지 않아도 된다. 매개변수로 사용하지 않기 때문인 것 같다..!

Table 컴포넌트와 동일한 구조로 FC 컴포넌트에 대한 타이핑을 Tr, Td에도 넣어준다.
FC 컴포넌트 타이핑의 경우 비슷한 구조로 타이핑이 이루어지므로 아래 내용을 보면서 익숙해지자

`Tr.tsx`

```tsx
import * as React from "react";
import { FC, Dispatch, useMemo } from "react";
import Td from "./Td";

interface Props {
  rowData: string[];
  rowIndex: number;
  dispatch: Dispatch<any>;
}

// Tr 컴포넌트 타이핑 : FC + Props
const Tr: FC<Props> = ({ rowData, rowIndex, dispatch }) => {
  return (
    <tr>
      {Array(rowData.length)
        .fill(null)
        .map((td, i) =>
          useMemo(
            () => (
              <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]}>
                {" "}
              </Td>
            ),
            [rowData[i]]
          )
        )}
    </tr>
  );
};

export default Tr;
```

`Td.tsx`

Td 컴포넌트는 특히 props.children이 존재하므로 이 점도 참고하자 :)

```tsx
import * as React from "react";
import { FC, Dispatch, useCallback } from "react";
import { CLICK_CELL } from "./TicTacToe";

interface Props {
  rowIndex: number;
  cellIndex: number;
  dispatch: Dispatch<any>;
  cellData: string;
  children: string; // children에 대한 타이핑도 있다.
}

const Td: FC<Props> = ({ rowIndex, cellIndex, dispatch, cellData }) => {
  const onClickTd = useCallback(() => {
    // codes...
  }, [cellData]);

  return <td onClick={onClickTd}>{cellData}</td>;
};

export default Td;
```
