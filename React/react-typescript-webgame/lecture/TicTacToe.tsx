import * as React from "react";
import { useEffect, useCallback, useReducer } from "react";
import Table from "./Table";

interface ReducerState {
  winner: "O" | "X" | "";
  turn: "O" | "X";
  tableData: string[][];
  recentCell: [number, number];
}

const initialState: ReducerState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  recentCell: [-1, -1],
};

export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";
export const RESET_GAME = "RESET_GAME";

interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: "O" | "X";
}
// action creator
const setWinner = (winner: "O" | "X"): SetWinnerAction => {
  return { type: SET_WINNER, winner };
};

interface ClickCellAction {
  type: typeof CLICK_CELL;
  row: number;
  cell: number;
}

const clickCell = (row: number, cell: number): ClickCellAction => {
  return { type: CLICK_CELL, row, cell };
};

interface ChangeTurnAction {
  type: typeof CHANGE_TURN;
}

interface ResetGameAction {
  type: typeof RESET_GAME;
}

type ReducerActions = SetWinnerAction | ClickCellAction | ChangeTurnAction | ResetGameAction;
const reducer = (state: ReducerState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };
    case CLICK_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]]; // 이후 immer라는 라이브러리로 가독성 문제를 해결해준다.
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        recentCell: [action.row, action.cell], // 최근에 클릭한 Cell
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === "O" ? "X" : "O",
      };
    }
    case RESET_GAME: {
      return {
        ...state,
        turn: "O",
        tableData: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        recentCell: [-1, -1],
      };
    }
    default:
      return state;
  }
};

const TicTacToe = () => {
  // 연달아서 제네릭이 쓰이는 경우 아래와 같이 적는다.
  // React.Reducer는 react에서 제공하는 타입 객체이다. (타입추론 안될 때만 적어준다.)
  const [state, dispatch] = useReducer<React.Reducer<ReducerState, ReducerActions>>(reducer, initialState);
  // 혹은 const [state, dispatch] = useReducer<(state: ReducerState, action: ReducerActions) => ReducerState>(reducer, initialState);
  const { tableData, turn, winner, recentCell } = state;

  // 승자를 가리는 effect
  useEffect(() => {
    const [row, cell] = recentCell;
    // 초기 돔 렌더링 시 실행되지 않도록 함!
    if (row < 0) {
      return;
    }
    let win = false;
    // 행
    if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
      win = true;
    }
    // 열
    if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
      win = true;
    }
    // 대각선 오른쪽방향
    if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
      win = true;
    }
    // 대각선 왼쪽방향
    if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
      win = true;
    }
    if (win) {
      dispatch({ type: SET_WINNER, winner: turn });
      dispatch({ type: RESET_GAME });
    } else {
      // 무승부 검사
      let all = true; // all이 true면 무승부이다.
      tableData.forEach((row) => {
        row.forEach((cell) => {
          if (!cell) {
            all = false; // 3X3 중에 하나라도 cell이 없으면 무승부가 아니다
          }
        });
      });
      if (all) {
        dispatch({ type: RESET_GAME });
      } else {
        dispatch({ type: CHANGE_TURN }); // 이긴게 아니면 CHANGE_TURN
      }
    }
  }, [recentCell]);

  const onClickTable = useCallback(() => dispatch(setWinner("O")), []);

  return (
    <>
      <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
      {winner && <div>{winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
