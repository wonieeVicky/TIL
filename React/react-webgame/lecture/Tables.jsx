import React, { useContext } from "react";
import { TableContext } from "./MineSearch";
import Tr from "./Tr";

const Table = () => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr rowIndex={i} key={Math.floor(Math.random() * 1000) + i} />
        ))}
    </table>
  );
};

export default Table;
