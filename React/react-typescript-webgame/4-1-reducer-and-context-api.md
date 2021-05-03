# reducer, contextAPI 타이핑

지뢰찾기 게임을 타이핑 기존에 배웠던 Reducer 타이핑을 복습하고, Context API 타이핑 방법에 대해서도 알아본다.

### Reducer 타이핑

`MineSearch.tsx`

```tsx
// 1. initialState에 대한 타이핑
interface ReducerState {
  tableData: number[][];
  data: {
    row: number;
    cell: number;
    mine: number;
  };
  timer: number;
  result: string;
  halted: boolean;
  openedCount: number;
}
// 1. initialState에 ReducerState 적용
const initialState: ReducerState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  halted: true,
  openedCount: 0,
};

const plantMine = (row: number, cell: number, mine: number) => {
  // codes...
};

// 2. reducer action 상수값 선언
// 변하지 않는 값은 뒤에 as const를 붙여 readonly property로 바꿔준다.
export const START_GAME = "START_GAME" as const;
export const OPEN_CELL = "OPEN_CELL" as const;
export const CLICK_MINE = "CLICK_MINE" as const;
export const FLAG_CELL = "FLAG_CELL" as const;
export const QUESTION_CELL = "QUESTION_CELL" as const;
export const NORMALIZE_CELL = "NORMALIZE_CELL" as const;
export const INCREMENT_TIMER = "INCREMENT_TIMER" as const;

// 3. 각 action에 대한 actionCreator 타입 정의
interface StartGameAction {
  type: typeof START_GAME;
  row: number;
  cell: number;
  mine: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const startGame = (row: number, cell: number, mine: number): StartGameAction => ({ type: START_GAME, row, cell, mine });

// 3. 각 action에 대한 actionCreator 타입 정의
interface OpenCellAction {
  type: typeof OPEN_CELL;
  row: number;
  cell: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const openCell = (row: number, cell: number): OpenCellAction => ({ type: OPEN_CELL, row, cell });

// 3. 각 action에 대한 actionCreator 타입 정의
interface ClickMineAction {
  type: typeof CLICK_MINE;
  row: number;
  cell: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const clickMine = (row: number, cell: number): ClickMineAction => ({ type: CLICK_MINE, row, cell });

// 3. 각 action에 대한 actionCreator 타입 정의
interface FlagMineAction {
  type: typeof FLAG_CELL;
  row: number;
  cell: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const flagMine = (row: number, cell: number): FlagMineAction => ({ type: FLAG_CELL, row, cell });

// 3. 각 action에 대한 actionCreator 타입 정의
interface QuestionCellAction {
  type: typeof QUESTION_CELL;
  row: number;
  cell: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const questionCell = (row: number, cell: number): QuestionCellAction => ({ type: QUESTION_CELL, row, cell });

// 3. 각 action에 대한 actionCreator 타입 정의
interface NormalizeCellAction {
  type: typeof NORMALIZE_CELL;
  row: number;
  cell: number;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const normalizeCell = (row: number, cell: number): NormalizeCellAction => ({ type: NORMALIZE_CELL, row, cell });

// 3. 각 action에 대한 actionCreator 타입 정의
interface IncrementTimerAction {
  type: typeof INCREMENT_TIMER;
}
// 3. actionCreator 내 각 인터페이스 타입 선언
const incrementTimer = (): IncrementTimerAction => ({ type: INCREMENT_TIMER });

// 4. actions에 대한 타입 객체 정의
type ReducerActions =
  | StartGameAction
  | OpenCellAction
  | ClickMineAction
  | FlagMineAction
  | QuestionCellAction
  | NormalizeCellAction
  | IncrementTimerAction;
```

타입스크립트로 컴포넌트를 작성할 경우 각 `actionCreator`로 인한 인터페이스 타입으로 인해 타입이 길어지므로 해당 파일만 별도로 types.ts 등의 파일로 분리하는 것이 좋다.

### Context API

지난번 TicTacToe에서는 부모 컴포넌트 → Table → Tr → Td로 props를 내려서 사용해 구현했다. 지뢰찾기에서는 react의 `contextAPI`를 사용해서 기능을 구현해본다.

```tsx
import * as React from "react";
import { useEffect, useReducer, createContext, useMemo, Dispatch } from "react";

// 1. Context API 인터페이스 타입 정의
export interface Context {
  tableData: number[][];
  halted: boolean;
  dispatch: Dispatch<ReducerActions>;
}

// 2. ContextAPI initialState 선언
export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

// reducer, actions, actionCreators...

type ReducerActions =
  | StartGameAction
  | OpenCellAction
  | ClickMineAction
  | FlagMineAction
  | QuestionCellAction
  | NormalizeCellAction
  | IncrementTimerAction;

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  // 3.contextAPI에 넣을 value 선언
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  useEffect(() => {
    let timer: number;
    if (halted === false) {
      timer = window.setInterval(() => dispatch({ type: INCREMENT_TIMER }), 1000);
    }

    return () => clearInterval(timer);
  }, [halted]);

  // 4. TableContext.Provider로 contextAPI 적용
  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
```

1. 먼저 ContextAPI의 값에 대한 타입정의를 인터페이스로 구현해준다. → interface Context
   하위 dispatch 값에는 앞서 reducer의 actions를 위해 만들어놓은 ReducerActions를 넣어준다.
2. ContextAPI의 `initialState` 객체를 선언해준다.
3. ContextAPI의 Provider에 넣을 value 값을 컴포넌트 내에서 정의한다.
4. ContextAPI를 적용해준다.
