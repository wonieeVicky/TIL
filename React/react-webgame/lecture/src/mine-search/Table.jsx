import React, { useContext, memo } from "react";
import Tr from "./Tr";
import { TableContext } from "./MineSearch";

const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr rowIndex={i} key={Math.floor(Math.random() * 10000 + i)} />
        ))}
    </table>
  );
});
export default Table;
