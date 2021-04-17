# useCallback 타이핑

### 끝말잇기 컴포넌트 내 useCallback 타이핑

끝맛잇기 컴포넌트는 기존 React 강의에서 다뤄봤으므로 useCallback 타이핑에 대한 부분만 간략하게 살펴본다

`WordRelay.tsx`

```tsx
import * as React from "react";
import { useState, useRef, useCallback } from "react";

const WordRelay = () => {
  const [word, setWord] = useState("비키");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // 1. useCallback에 타입추론하는 방법 1
  const onSubmitForm = useCallback<(e: React.FormEvent) => void>(
    (e) => {
      e.preventDefault();
      // 2. useRef.current에 대한 변수 선언
      const input = inputRef.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕!");
        setWord(value);
        setValue("");
      } else {
        setResult("땡!");
        setValue("");
      }
      // 2. Element가 null이 아닌 시점을 분기로 처리하여 타입오류 개선
      if (input) {
        input.focus();
      }
    },
    [value]
  );

  // 1. useCallback에 타입추론하는 방법 2
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
```

1. 함수를 바깥으로 분리하거나 useCallback으로 감싸주면 매개변수 e의 타입추론이 방해받아 any로 추론되어버림. 이때는 기존의 타입을 직접 주입해줘야하는데 2가지 방식으로 줄 수 있다.

   가. useCallback에 제네릭으로 타입을 부여하는 방법

   `useCallback<(<e: React.FormEvent>) ⇒ void>((e) ⇒ {}, []);`

   나. 매개변수에 직접 타입 부여하는 방법

   `useCallback((e: React.FormEvent<HTMLInputElement>) ⇒ {}, []);`

   함수의 매개변수에 제네릭 타입으로 타이핑하는 것은 코드 가독성에는 무지 안좋은 것 같다..

2. useRef에 대한 타입 에러처리, 이전 컴포넌트와 중복되는 개념이지만 한번 더 인지하고 넘어간다 !
