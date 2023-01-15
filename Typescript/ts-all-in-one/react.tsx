﻿import React, { useState, useCallback, useRef, useEffect, FC } from "react";

// (prop) => JSX
interface P {
  name: string;
  title: string;
  children?: React.ReactNode;
}

const WordRelay: FC<P> = (props) => {
  console.log(props.name, props.title);
  const [word, setWord] = useState("제로초");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      const input = inputEl.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕");
        setWord(value);
        setValue("");
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
    },
    [word, value]
  );

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return (
    <>
      <div>{word}</div>
      <div>{props.children}</div>
      <form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </form>
      <div>{result}</div>
    </>
  );
};

const Parent = () => {
  return (
    <WordRelay name="vicky" title="react">
      <div>vicky</div>
    </WordRelay>
  );
};

export default WordRelay;
