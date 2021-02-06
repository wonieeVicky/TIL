import React, { useContext } from "react";
import { TableContext } from "./MineSearch";
import Td from "./Td";

const Tr = ({ rowIndex }) => {
  const { tableData } = useContext(TableContext);
  return (
    <tr>
      {/* tableData가 Undefined인 경우에 대한 보호 */}
      {tableData[0] &&
        Array(tableData.length)
          .fill()
          .map((td, i) => <Td key={i} rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
};

export default Tr;
