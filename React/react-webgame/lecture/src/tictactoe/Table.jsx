import React, { memo, useMemo } from "react";
import Tr from "./Tr";

const Table = memo(({ tableData, dispatch }) => {
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) =>
          useMemo(() => <Tr key={Math.random() + i} rowIndex={i} rowData={tableData[i]} dispatch={dispatch} />, [
            [tableData[i]],
          ])
        )}
    </table>
  );
});

export default Table;
