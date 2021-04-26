import * as React from "react";
import { useState, useRef } from "react"; // 위 * as 사용했기 때문에 별도로 적어준다.
import { setConstantValue } from "typescript";

// <> === React.Fragment
const GuGuDan = () => {
  const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
  const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef<HTMLInputElement>(null);

  // JSX 안에서 쓰면 매개변수에 대한 타입 추론 가능하지만
  // 함수를 분리하면 매개변수 e를 타입 추론하지 못해 type Error 발생
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputEl.current;
    if (parseInt(value) === first * second) {
      setResult("정답");
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue("");
      // input!.focus(); // !를 넣어서 처리해도 된다. 단, !는 확신이 있을 경우에만 사용한다.
      // 만약 확신이 없다면
      if (input) {
        input.focus();
      }
    } else {
      setResult("땡");
      setValue("");
      if (input) {
        input.focus();
      }
    }
  };

  return (
    <>
      <div>
        {first}곱하기 {second}는?
      </div>
      <form onSubmit={onSubmitForm}>
        <input ref={inputEl} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <div>{result}</div>
    </>
  );
};

export default GuGuDan;
