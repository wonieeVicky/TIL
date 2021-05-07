import * as React from "react";
import { memo, FC, useContext } from "react";
import { TableContext } from "./MineSearch";
import MineTd from "./MineTd";

interface Props {
  rowIndex: number;
}

const MineTr: FC<Props> = memo(({ rowIndex }) => {
  const { tableData } = useContext(TableContext);

  return (
    <tr>
      {tableData[0] &&
        Array(tableData[0].length)
          .fill(null)
          .map((td, i) => <MineTd key={rowIndex + i} rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
});

export default MineTr;
