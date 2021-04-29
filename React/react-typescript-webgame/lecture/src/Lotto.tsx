import * as React from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  const candidate = Array(45)
    .fill(null)
    .map((v, i) => i + 1);
  const shuffle = [];

  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {
  const lottoNumber = useMemo<number[]>(() => getWinNumbers(), []); // 타입 추론이 안되면 제네릭으로 처리해준다.
  const [winNumbers, setWinNumbers] = useState(lottoNumber);
  const [winBalls, setWinBalls] = useState<number[]>([]); // 빈 배열을 사용할 경우 제네릭으로 타입 지정 필수
  const [bonus, setBonus] = useState<number | null>(null);
  const [redo, setRedo] = useState(false);

  const timeouts = useRef<number[]>([]); // 빈 배열을 사용할 경우 제네릭으로 타입 지정 필수

  useEffect(() => {
    runTimeouts();
    return () => timeouts.current.forEach((t) => clearTimeout(t));
  }, [timeouts.current]);

  const runTimeouts = () => {
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = window.setTimeout(
        () => setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]),
        (i + 1) * 1000
      );
    }
    timeouts.current[6] = window.setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
  };

  const onClickRedo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setWinNumbers(getWinNumbers());
      setWinBalls([]);
      setBonus(null);
      setRedo(false);
      timeouts.current = [];
    },
    [winNumbers]
  );

  return (
    <>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한번 더!</button>}
    </>
  );
};

export default Lotto;
