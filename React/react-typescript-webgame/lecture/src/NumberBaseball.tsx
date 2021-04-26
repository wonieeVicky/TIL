import * as React from "react";
import { useRef, useState, useCallback } from "react";
import Try from "./Try";
import { TryInfo } from "./types";

// 숫자 네 개를 겹치지 않고 랜덤하게 리턴하는 함수
const getNumbers = () => {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
};

const NumberBaseball = () => {
  const [answer, setAnswer] = useState(getNumbers());
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [tries, setTries] = useState<TryInfo[]>([]); // useState에서 빈배열을 사용하는 경우 항상 타이핑 에러가 발생한다.
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>(
    (e) => {
      e.preventDefault();
      const input = inputEl.current;
      if (value === answer.join("")) {
        setResult("홈런!");
        setTries((prevTries) => {
          return [...prevTries, { try: value, result: "홈런!" }];
        });

        alert("게임을 다시 시작합니다.");
        setValue("");
        setAnswer(getNumbers());
        setTries([]);
        if (input) {
          input.focus();
        }
      } else {
        const answerArray = value.split("").map((v) => parseInt(v));
        let strike = 0;
        let ball = 0;

        // 10번 이상 틀렸을 때
        if (tries.length >= 9) {
          setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`);
          alert("게임을 다시 시작합니다.");
          setValue("");
          setAnswer(getNumbers());
          setTries([]);
          if (input) {
            input.focus();
          }
        } else {
          for (let i = 0; i < 4; i++) {
            if (answerArray[i] === answer[i]) {
              strike++;
            } else if (answer.includes(answerArray[i])) {
              // includes에서 에러가 발생한 경우 includes는 2016이므로 tsconfig.json compilerOptions-libs에 추가해준다.
              ball++;
            }
          }

          setTries((prevTries) => {
            return [...prevTries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다` }];
          });
          setValue("");
          if (input) {
            input.focus();
          }
        }
      }
    },
    [answer, value]
  );

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputEl}
          maxLength={4}
          value={value}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])}
        />
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => (
          <Try key={`${i + 1}차 시도 :`} tryInfo={v} />
        ))}
      </ul>
    </>
  );
};

export default NumberBaseball;
