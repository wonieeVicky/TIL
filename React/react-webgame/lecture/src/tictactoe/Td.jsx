import React, { useCallback, useEffect, useRef, memo } from "react";
import { CLICK_CELL } from "./TicTacToe";

const Td = memo(({ rowIndex, cellIndex, cellData, dispatch }) => {
  /* 성능 최적화를 위한 디버깅 */
  /* const ref = useRef([]);
  useEffect(() => {
    // 아래 콘솔로 어떤게 바뀌고 어떤게 안바뀌는지 확인하면 좋다.
    console.log(
      rowIndex === ref.current[0],
      cellIndex === ref.current[1],
      dispatch === ref.current[2],
      cellData === ref.current[3]
    );
    console.log(cellData);
 
    ref.current = [rowIndex, cellIndex, dispatch, cellData];
  }, [rowIndex, cellIndex, dispatch, cellData]); */

  const onClickTd = useCallback(() => {
    if (cellData) {
      return;
    }
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
  }, [cellData]);

  return <td onClick={onClickTd}>{cellData}</td>;
});

export default Td;
