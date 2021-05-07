import * as React from "react";
import { TableContext } from "./MineSearch";
import { useContext } from "react";
import MineTr from "./MineTr";

const MineTable = () => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill(null)
          .map((tr, i) => (
            <MineTr key={i} rowIndex={i} />
          ))}
      </tbody>
    </table>
  );
};

export default MineTable;
