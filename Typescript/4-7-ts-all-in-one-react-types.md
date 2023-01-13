## React 타입 분석

### UMD 모듈과 tsconfig.json jsx 설정

React 타입을 분석해보기에 앞서 react 와 @types/react를 설치해준다.

```bash
> npm i -D react @types/react
```

위와 같이 설치 후 react.ts 파일에 기본 보일러플레이트 코드를 깔아서 React 정의를 찾아가보면 아래와 같다.

`@types/react/index.d.ts`

```bash
// ..
export = React;
export as namespace React;

declare namespace React { ... }
```

위와 같이 `export as namespace React` 까지만 적혀있으면 UMD 모듈이다.

기본적으로는 `import React = require(’react’)`적어야하지만 tsconfig 설정을 바꿔주면 import 가능함

```json
{
  "compilerOptions": {
    // ..
    "jsx": "react", // ts 파일이 jsx를 인식하도록 설정
    "esModuleInterop": true // commonjs 모듈을 esmodule처럼 사용하게 해준다.
  }
}
```

`jsx`, `esModuleInterop` 설정으로 리액트 환경에 필요한 설정을 추가해준다.

함수형 구조의 리액트 코드는 이미 타입이 만들어져 있다. 아래 예시를 보자

```tsx
import React, { useState, useCallback, useRef, useEffect, FunctionComponent } from "react";

// (prop) => JSX

const WordRelay: FunctionComponent = () => {
  const [word, setWord] = useState("제로초");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      // ..
    },
    [word, value]
  );

  const onChange = useCallback((e) => { ... }, []);

  return (
    <>
			<form onSubmit={onSubmitForm}>
				{/* ... */}
			</form>
    </>
  );
};

export default WordRelay;
```

위 코드를 보면 WordRelay 라는 이름의 함수형 컴포넌트에 `FunctionComponent` 타입을 적용했다.
이 타입에 대해 자세히 알아보자

```tsx
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T;
  props: P;
  key: Key | null;
}
```

위 타입을 보고, return 내부의 데이터는 ReactElement라는 것을 알 수 있음
또, 위 return 내부의 form 태그를 기준으로 타입 정의를 보면 아래와 같은 타입으로 연결됨

```tsx
declare global {
  namespace JSX {
    // ..

    interface IntrinsicElements {
      // HTML
      // ..
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    }
  }
}

type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;
```

위 타입을 이루는 하위 속성들은 계속 타고 들어가면서 확인해보면 된다.
