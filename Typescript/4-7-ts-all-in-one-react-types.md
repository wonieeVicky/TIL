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

### 함수 컴포넌트(FC vs VFC), Props 타이핑

위 FunctionComponent를 안써주면 JSX.Element로 타입 추론이 된다.

```tsx
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    // ..
  }
}
```

JSX.Element 도 타입을 살펴보면 위와 같이 ReactElement로 타입추론되므로 결국 같은 거라고 보면 되겠다.

함수형 컴포넌트를 타이핑 하는 방법은 크게 두가지가 있다.

1. 매개변수와 리턴 값을 각각 타이핑해주는 방법(리턴 값은 선택적)

   ```tsx
   interface P {
     name: string;
     title: string;
   }
   const WordRelay = (props: P): JSX.Element => { ... };
   ```

2. 이미 만들어진 FunctionComponent를 활용하는 방법

   ```tsx
   import React, { FunctionComponent, FC } from "react";

   interface P {
     name: string;
     title: string;
   }

   const WordRelay: FunctionComponent<P> = (props) => {
     console.log(props.name, props.title);
   };

   // 혹은

   const WordRelay: FC<P> = (props) => {
     console.log(props.name, props.title);
   };
   ```

개인적으로 2번이 더 좋아보인다.

또, 기존에는 VFC, FC가 분리되어 사용했었는데, FC로 통합되버림. 즉, children 값에 대해 모두 별도 타이핑을 해줘야한다. (하위 P interface 참고)

```tsx
interface P {
  name: string;
  title: string;
  children?: React.ReactNode | undefined;
}

const WordRelay: FC<P> = (props) => {
  return (
    <>
      {/* ok */}
      <div>{props.children}</div>
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
```

위와 같은 P 타이핑을 통해 children 상속을 구현할 수 있게된다.

### useState, useEffect 타이핑

useState에 대한 타이핑을 한번 살펴보자

```tsx
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;
```

위 내용만 보면 initialState에 함수도 넣을 수 있는 것으로 보인다. lazy init을 할 때 위 방법을 사용한다.
setState는 S 나 함수가 들어가므로 위 타입에 따라 아래와 같은 코드 구현이 가능해진다.

```tsx
const WordRelay: FC = (props) => {
  const [word, setWord] = useState("vicky");
  // ..

  useEffect(() => {
    // setState에 함수를 아래와 같이 쓸 수 있음
    setWord((prev) => {
      return prev + "2";
    });
  }, []);

  return <>{/* ... */}</>;
};

export default WordRelay;
```

setState에 함수가 들어있는 형태가 가능한 이유임. 다음으로 useEffect 타입을 보자

```tsx
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
type EffectCallback = () => void | Destructor;
```

useEffect의 반환타입은 void 혹은 Destructor로 고정되어 있다.
따라서 typescript는 아래와 같이 사용 시 에러를 뿜는다

```tsx
const WordRelay: FC = (props) => {
	// ..

  useEffect(async () => { // type Error
		await func() ...
  }, []);

  return (
    <>
      {/* ... */}
    </>
  );
};
```

async 함수의 리턴값은 무조건 Promise이므로 에러가 발생함.. 따라서 async ~ await 구조는 이렇게 쓴다

```tsx
const WordRelay: FC = (props) => {
  // ..

  useEffect(() => {
    const func = async () => {
      await axios.post();
    };
    func(); // func라는 async ~ await 함수를 생성 후 별도 실행
  }, []);

  return <></>;
};
```
