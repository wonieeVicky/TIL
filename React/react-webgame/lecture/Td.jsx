import React, { useContext, useCallback } from "react";
import { TableContext, CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL } from "./MineSearch";

const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: "#444",
      };
    case CODE.CLICKED_MINE:
    case CODE.OPENED:
      return {
        background: "white",
      };
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return {
        background: "yellow",
      };
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return {
        background: "red",
      };
    default:
      return {
        background: "white",
      };
  }
};
const getTdText = (code) => {
  switch (code) {
    case CODE.NORMAL:
      return "";
    case CODE.MINE:
      return "x";
    case CODE.CLICKED_MINE:
      return "펑!";
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return "!";
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return "?";
    default:
      return code;
  }
};

const Td = ({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      // 이미 연 칸
      // 깃발 꽂은 칸, 물음표 칸
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return;
      // 지뢰 칸
      case CODE.MINE:
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  // 오른쪽 이벤트 처리는 onContextMenu로 한다.
  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();
      if (halted) {
        return;
      }
      switch (tableData[rowIndex][cellIndex]) {
        // 일반 칸 -> 깃발 칸
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;
        // 깃발 칸 -> 물음표 칸
        case CODE.FLAG_MINE:
        case CODE.FLAG:
          dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
          return;
        // 물음표 칸 -> 일반 칸
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
          dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
          return;
        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  );

  return (
    <td style={getTdStyle(tableData[rowIndex][cellIndex])} onClick={onClickTd} onContextMenu={onRightClickTd}>
      {getTdText(tableData[rowIndex][cellIndex])}
    </td>
  );
};

export default Td;
