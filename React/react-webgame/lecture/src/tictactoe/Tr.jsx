import React, { useRef, useEffect, useMemo, memo } from "react";
import Td from "./Td";

const Tr = memo(({ rowData, rowIndex, dispatch }) => {
  const ref = useRef([]);
  useEffect(() => {
    console.log(rowData === ref.current[0], rowIndex === ref.current[1], dispatch === ref.current[2]);
    ref.current = [rowData, rowIndex, dispatch];
  }, [rowData, rowIndex, dispatch]);

  return (
    <tr>
      {Array(rowData.length)
        .fill()
        .map((td, i) =>
          useMemo(
            () => (
              <Td rowIndex={rowIndex} cellIndex={i} dispatch={dispatch} cellData={rowData[i]} key={Math.random() + i}>
                {""}
              </Td>
            ),
            [rowData[i]]
          )
        )}
    </tr>
  );
});

export default Tr;
