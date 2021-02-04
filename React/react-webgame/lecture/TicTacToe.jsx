import React, { useReducer, useCallback } from "react";
import Table from "./Table";

const initialState = {
  winner: "",
  turn: "O",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
};

export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";

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
      };
    }
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === "O" ? "X" : "O",
      };
    }
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onClickTable = useCallback(() => {
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

  return (
    <>
      <Table tableData={state.tableData} dispatch={dispatch} />
      {state.winner && <div>{state.winner} 님의 승리!</div>}
    </>
  );
};

export default TicTacToe;
