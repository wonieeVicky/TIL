import * as React from "react";
import { useEffect, useReducer, createContext, useMemo, Dispatch } from "react";

export const CODE = {
  OPENED: 0, // 0 이상이면 다 Opened : 정상적으로 연 칸
  NORMAL: -1, // 보통
  QUESTION: -2, // 물음표 심기
  FLAG: -3, // 깃발 심기
  QUESTION_MINE: -4, // 물음표를 꽂았는데 지뢰가 있을 때
  FLAG_MINE: -5, // 깃발을 꽂았는데 지뢰가 있을 때
  CLICKED_MINE: -6, // 지뢰를 눌렀을 때
  MINE: -7, // 지뢰
} as const; // as const를 넣으면 readonly 프로퍼티로 만들어준다.

export interface Context {
  tableData: number[][];
  halted: boolean;
  dispatch: Dispatch<ReducerActions>;
}

export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

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
  // 지정한 row * cell만큼의 기본 배열(0 ~ (row*cell - 1))을 만들어준다.
  const candidate = Array(row * cell)
    .fill(undefined)
    .map((arr, i) => {
      return i;
    });

  // 몇번째 칸에 지뢰가 있는지 shuffle 정렬로 뽑는다.
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  // 모든 칸에 닫힌 칸을 만든다.
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData: number[] = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }
  // shuffle의 갯수만큼 지뢰를 심어준다.
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data; // tableData return
};

export const START_GAME = "START_GAME" as const;
export const OPEN_CELL = "OPEN_CELL" as const;
export const CLICK_MINE = "CLICK_MINE" as const;
export const FLAG_CELL = "FLAG_CELL" as const;
export const QUESTION_CELL = "QUESTION_CELL" as const;
export const NORMALIZE_CELL = "NORMALIZE_CELL" as const;
export const INCREMENT_TIMER = "INCREMENT_TIMER" as const;

interface StartGameAction {
  type: typeof START_GAME;
  row: number;
  cell: number;
  mine: number;
}
const startGame = (row: number, cell: number, mine: number): StartGameAction => ({ type: START_GAME, row, cell, mine });

interface OpenCellAction {
  type: typeof OPEN_CELL;
  row: number;
  cell: number;
}
const openCell = (row: number, cell: number): OpenCellAction => ({ type: OPEN_CELL, row, cell });

interface ClickMineAction {
  type: typeof CLICK_MINE;
  row: number;
  cell: number;
}
const clickMine = (row: number, cell: number): ClickMineAction => ({ type: CLICK_MINE, row, cell });

interface FlagMineAction {
  type: typeof FLAG_CELL;
  row: number;
  cell: number;
}
const flagMine = (row: number, cell: number): FlagMineAction => ({ type: FLAG_CELL, row, cell });

interface QuestionCellAction {
  type: typeof QUESTION_CELL;
  row: number;
  cell: number;
}
const questionCell = (row: number, cell: number): QuestionCellAction => ({ type: QUESTION_CELL, row, cell });

interface NormalizeCellAction {
  type: typeof NORMALIZE_CELL;
  row: number;
  cell: number;
}
const normalizeCell = (row: number, cell: number): NormalizeCellAction => ({ type: NORMALIZE_CELL, row, cell });

interface IncrementTimerAction {
  type: typeof INCREMENT_TIMER;
}
const incrementTimer = (): IncrementTimerAction => ({ type: INCREMENT_TIMER });

type ReducerActions =
  | StartGameAction
  | OpenCellAction
  | ClickMineAction
  | FlagMineAction
  | QuestionCellAction
  | NormalizeCellAction
  | IncrementTimerAction;

const reducer = (state = initialState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          // 총 가로, 세로, 지뢰 갯수
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        result: "",
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      // 1. 모든 칸들을 다 새로운 객체로 만든다.
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      // 2. 한번 검사한 칸은 다시 검사하지 않는다.
      const checked: number[] = [];
      // 총 오픈한 칸의 갯수
      let openedCount = 0;
      // 3. 내 기준으로 주변 칸을 검사하는 함수
      const checkAround = (row: number, cell: number) => {
        // 상하좌우 칸이 아닌 경우 (unefined)필터링
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
        }
        // 이미 열었거나, 깃발, 물음표가 있는 경우 필터링
        if (
          [CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])
        ) {
          return;
        }
        // 닫힌 칸만 열기
        if (checked.includes(row + "/" + cell)) {
          return;
        } else {
          // 검사안한 칸이면 checked 배열에 값 push
          checked.push(row + "/" + cell);
        }

        // 지뢰개수 알려주기: 상황에 따라 5칸 ~ 8칸이 될 수 있다.
        // 클릭한 위치에 양 옆 칸 검사 field 2개 추가
        let around = [tableData[row][cell - 1], tableData[row][cell + 1]];
        // 클릭한 위치에 윗줄이 있으면 around에 검사 field 3개 추가
        if (tableData[row - 1]) {
          around = around.concat([
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1],
          ]);
        }
        // 클릭한 위치에 아랫줄이 있으면 around에 검사 field 3개 추가
        if (tableData[row + 1]) {
          around = around.concat([
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1],
          ]);
        }

        // 주변의 지뢰 갯수
        const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;

        // 내가 빈칸이면 주변 8 칸을 검사
        if (count === 0) {
          // 주변칸 오픈
          if (row > -1) {
            const near = [];
            // 제일 윗 칸을 선택한 경우
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            // 양 옆 칸
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            // 제일 아랫 칸을 선택한 경우
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
        if (tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };
      // checkAround 함수 실행
      checkAround(action.row, action.cell);
      let halted = false;
      let result = "";
      // 승리조건 체크
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
        halted = true;
        result = `${state.timer}초 만에 승리했습니다!`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      };
    }
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  useEffect(() => {
    let timer: number;
    if (halted === false) {
      timer = window.setInterval(() => dispatch({ type: INCREMENT_TIMER }), 1000);
    }

    return () => clearInterval(timer);
  }, [halted]);

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
