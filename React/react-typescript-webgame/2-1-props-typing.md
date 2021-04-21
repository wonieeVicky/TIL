# 숫자야구(함수형, 클래스형) 컴포넌트에 props 타이핑하기

```tsx
import * as React from "react";
import { useRef, useState, useCallback } from "react";
import { TryInfo } from "./types";

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
  const [tries, setTries] = useState<TryInfo[]>([]); // 1. useState 타이핑
  const inputEl = useRef<HTMLInputElement>(null); // 2. useRef 타이핑

  const onSubmitForm = useCallback<(e: React.FormEvent) => void>((e) => {
    e.preventDefault();
    const input = inputEl.current; // 2. useRef
    if (value === answer.join("")) {
      setResult("홈런!");
      setTries((prevTries) => {
        return [...prevTries, { try: value, result: "홈런!" }];
      });

      alert("게임을 다시 시작합니다.");
      setValue("");
      setAnswer(getNumbers());
      setTries([]);
      // 2. useRef 타이핑
      if (input) {
        input.focus();
      }
    } else {
      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      if (tries.length >= 9) {
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`);
        alert("게임을 다시 시작합니다.");
        setValue("");
        setAnswer(getNumbers());
        setTries([]);
        // 2. useRef 타이핑
        if (input) {
          input.focus();
        }
      } else {
        for (let i = 0; i < 4; i++) {
          if (answerArray[i] === answer[i]) {
            strike++;
          } else if (answer.includes(answerArray[i])) {
            // 3. includes(es2016)
            ball++;
          }
        }

        setTries((prevTries) => {
          return [...prevTries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다` }];
        });
        setValue("");
        // 2. useRef 타이핑
        if (input) {
          input.focus();
        }
      }
    }
  }, []);

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
          <Try key={`${i + 1}차 시도 :`} tryInfo={v} index={i} />
        ))}
      </ul>
    </>
  );
};

export default NumberBaseball;
```

1. `useState`에서 초기값을 빈 배열을 사용하는 경우 항상 타이핑 에러가 발생한다. 따라서 제네릭을 활용해 타입을 지정해주면 이후 setState를 통한 변경 동작 코드에도 타이핑이 정상적으로 추론되는 것을 확인할 수 있다.

   interface 같은 타입들은 별도의 types 파일에서 관리하여 import 해서 사용한다.

   `types.ts`

   ```tsx
   export interface TryInfo {
     try: string;
     result: string;
   }
   ```

2. useRef의 경우 초기값이 null이므로 반드시 알맞은 값을 타이핑으로 넣어줄 것. 이후 current.focus()시에도 미리 변수에 담아놓은 inputRef.current를 체크하여 값이 있을 경우 코드를 작성하도록 하여 에러를 방지해준다.
3. 만약 includes 영역에 에러가 발생할 경우 해당 프로젝트에 es2016 문법 타입지원이 되지 않는 것이므로 `tsconfig.json`에서 해당 속성을 추가해주자.

   ```tsx
   {
     "compilerOptions": {
       "strict": true,
       "lib": ["ES5", "ES2015", "ES2016", "ES2017", "DOM"], // ES2016 추가
       "jsx": "react"
     },
     "exclude": ["node_modules"]
   }
   ```

### 자식 컴포넌트인 Try 컴포넌트에서 Props 타이핑하기

상위 NumberBaseball에서 props로 넘겨준 데이터인 tryInfo에 대한 타이핑을 하지 않으면 하위 매개변수 tryInfo에 타입에러가 발생한다. 따라서 TryInfo 타입 인터페이스를 import 후 함수형 컴포넌트에 제네릭 타입으로 타입 지정을 해준다.

```tsx
import * as React from "react";
import { FunctionComponent } from "react";
import { TryInfo } from "./types";

// props 타이핑 추가
const Try: FunctionComponent<{ tryInfo: TryInfo }> = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default Try;
```

상단 제네릭에 클래스 컴포넌트처럼 `<{}, {}>` 두 가지로 사용하지 않는 이유는 함수형 컴포넌트의 경우 state를 useState로 관리하고 있기 때문이다! 따라서 props에 대한 타이핑만 위와 같이 처리해주면 된다.

`FunctionComponent`를 사용하여 타입지정을 해주고 제네릭으로 매개변수 tryInfo에 대한 타입을 맞춰준다.

### 클래스 컴포넌트 타이핑하기

기존에 했던 구조와 동일하게 타이핑 적용해본다. 간단하게 요약만 함

```tsx
import * as React from "react";
import TryClass from "./TryClass";
import { TryInfo } from "./types";
import { Component, createRef } from "react";

function getNumbers() {
  // codes...
}

// State interface
interface State {
  result: string;
  value: string;
  answer: number[];
  tries: TryInfo[];
}

// 클래스 컴포넌트 이므로 제네릭 인자로 2개가 들어감
class NumberBaseball extends Component<{}, State> {
  state = {
    /* states.. */
  };

  // React.FormEvent 타이핑
  onSubmitForm = (e: React.FormEvent) => {
    /* codes... */
  };
  // ChangeEvent 타이핑
  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {};
  // this.inputRef 타이핑
  inputRef = createRef<HTMLInputElement>();

  render() {
    const { result, value, tries } = this.state;
    return (
      <>
        <h1>{result}</h1>
        <form onSubmit={this.onSubmitForm}>
          <input ref={this.inputRef} maxLength={4} value={value} onChange={this.onChangeInput} />
        </form>
        <div>시도: {tries.length}</div>
        <ul>
          {tries.map((v, i) => {
            return <TryClass key={`${i + 1}차 시도 :`} tryInfo={v} />;
          })}
        </ul>
      </>
    );
  }
}

export default NumberBaseball;
```

`TryClass.tsx`

```tsx
import * as React from "react";
import { Component } from "react";
import { TryInfo } from "./types";

class TryClass extends Component<{ tryInfo: TryInfo }> {
  render() {
    const { tryInfo } = this.props;
    return (
      <li>
        <div>{tryInfo.try}</div>
        <div>{tryInfo.result}</div>
      </li>
    );
  }
}

export default TryClass;
```

TryClass 컴포넌트는 props만 상속받아 처리하므로 제네릭에 props만 설정하여 추가해준다.
