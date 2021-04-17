import * as React from "react";
import { useState, useRef, useCallback } from "react";

const WordRelay = () => {
  const [word, setWord] = useState("비키");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // useCallback으로 감싸주면 매개변수 e의 타입추론이 안됨.
  // useCallback에 타입추론하는 방법 1
  const onSubmitForm = useCallback<(e: React.FormEvent<Element>) => void>(
    (e) => {
      e.preventDefault();
      const input = inputRef.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕!");
        setWord(value);
        setValue("");
      } else {
        setResult("땡!");
        setValue("");
      }
      if (input) {
        input.focus();
      }
    },
    [value]
  );

  // useCallback에 타입추론하는 방법 1
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value), []);

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="wordInput">글자를 입력하세요.</label>
        <input id="wordInput" className="wordInput" ref={inputRef} onChange={onChange} value={value} />
        <button>입력</button>
      </form>
      <div>{result}</div>
    </>
  );
};

export default WordRelay;
