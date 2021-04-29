# useReducer Typing

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

1. useReducer를 사용할 때에는 `initialState`에 대한 타입 선언이 필요하다.
2. 1에서 만들어놓은 인터페이스 타입을 `initialState`에 적용해준다.
3. `actionCreator`의 리턴 값에 대한 타입이 액션별로 필요하다.
   setWinnerAction, ClickCellAction, ChangeTurnAction, ResetGameAction ..
4. 3에서 만들어놓은 반환 값에 대한 인터페이스 타입을 `actionCreator`에 적용해준다.
5. `reducer`에 대한 타입 정의 시 action에 대한 타입 정의가 필요한데, action은 3에서 만들어 준 action 중 하나가 실행되므로 해당 값을 type Alias로 선언해준다.
6. `reducer`의 state, action 그리고 반환 값에 기존에 만들어놓은 ReducerState, ReducerActions로 타입 선언을 해주면 해당 타입에 맞춰 반환값이 운영된다.
