import React, { useReducer, useCallback, useEffect } from "react";
import Table from "./Table";

const initialState = {
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

const reducer = (state, action) => {
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { winner, turn, tableData, recentCell } = state;

  const onClickTable = useCallback(() => {
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

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
            all = false; // 3X3 중에 하나라도 cell이 없으면 무승부가 아니다<div className=""></div>
          }
        });
      });
      if (all) {
        dispatch({ type: RESET_GAME });
      } else {
        // 이긴게 아니면 CHANGE_TURN
        dispatch({ type: CHANGE_TURN });
      }
    }
  }, [recentCell]);

  return (
    <>
      <Table tableData={state.tableData} dispatch={dispatch} />
      {state.winner && <div>{state.winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
