﻿import * as React from "react";
import { useMemo, FC, Dispatch } from "react";
import Tr from "./Tr";

interface Props {
  tableData: string[][];
  dispatch: Dispatch<any>;
  onClick: () => void;
}

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
