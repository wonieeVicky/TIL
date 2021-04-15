# 이벤트 핸들러와 useRef 타이핑

이벤트 핸들러와 useRef 타이핑을 추가해본다.

`GuGuDan.js`

```tsx
import * as React from "react";
import { useState, useRef } from "react"; // 1. 훅은 별도로 호출(* as로 인함)
import { setConstantValue } from "typescript";

const GuGuDan = () => {
  const [first, setFirst] = useState(Math.ceil(Math.random() * 9));
  const [second, setSecond] = useState(Math.ceil(Math.random() * 9));
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef<HTMLInputElement>(null); // 3. useRef 타이핑 추가

  // 2. 함수 분리 시 매개변수에 대한 타입 추론 불가
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputEl.current;
    if (parseInt(value) === first * second) {
      setResult("정답");
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue("");
      // input!.focus(); // 4. !.로 useRef 타이핑 처리
      // 5. 확신이 없는 경우 if 분기로 처리
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
    // 6. <> === React.Fragment
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
```

1.  TypeScript를 리액트 내부에서 사용하기 위해 `* as React`로 호출하므로 useState, useRef와 같은 훅들은 별도로 호출해준다.
2.  JSX 문법 안에서 이벤트 핸들러를 바로 작성하면 매개변수에 대한 타입 추론 가능하다.  
    하지만 onSubmitForm처럼 별도로 분리할 경우에는 매개변수에 대한 타입추론이 불가하므로 별도의 타입지정을 하지않으면 타입 에러가 발생한다.

        e 매개변수의 경우 `React.FormEvent<HTMLFormElement>`로 처리 (HTMLFormElement 삭제 가능)

3.  `useRef` 사용 시 초기값이 null인 이유로 타입 에러가 발생하는데 이럴 때는 먼저 useRef에 제네릭을 사용해 적절한 Element에 대한 타입을 추가해준다.
4.  3에서 `useRef`에 타이핑을 추가해도 input.focus()시에는 에러가 발생하는데 이 이유는 초기값이 null이기 때문이다. 이때 해결 가능한 방법 중 `!`이 있다. input 변수에 들어올 데이터가 반드시 `input Element`라는 확신이 있을 경우에만 !를 넣는 방법으로 타이핑 해준다.
5.  만약 확신이 없을 경우에는 if 분기로 해당 돔이 있는 경우 focus 처리를 해준다면 타입 에러가 발생하지 않음
6.  React JSX에서 제공하는 <></>는 `React.Fragment`로 읽혀 처리된다.
