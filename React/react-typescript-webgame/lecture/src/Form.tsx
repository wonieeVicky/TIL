import * as React from "react";
import { TableContext } from "./MineSearch";
import { startGame } from "./action";
import { useState, useCallback, useContext, memo } from "react";

const Form = () => {
  const [row, setRow] = useState(5);
  const [cell, setCell] = useState(5);
  const [mine, setMine] = useState(5);

  // dispatch에 접근하는 방법!
  const { dispatch } = useContext(TableContext);

  const onChangeRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setRow(Number(e.target.value)), []);
  const onChangeCell = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCell(Number(e.target.value)), []);
  const onChangeMine = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setMine(Number(e.target.value)), []);

  const onClickBtn = useCallback(() => dispatch(startGame(row, cell, mine)), [row, cell, mine]);

  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn}>시작</button>
    </div>
  );
};

export default memo(Form);
