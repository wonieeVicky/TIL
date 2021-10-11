## 회원가입 페이지와 커스텀 훅

### 회원가입 페이지 생성

이전 시간에 만들어 둔 내용에서 useState와 useCallback을 이용해 form submit 이벤트까지 만들어준다.

`front/pages/SignUp/index.tsx`

```tsx
import React, { useState, useCallback } from "react";
import { Header, Form, Label, Input, Error, Button, LinkContainer } from "./styles";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [mismatchError, setMismatchError] = useState(false);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck]
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError) {
        console.log("go submit!");
      }
    },
    [email, nickname, password, passwordCheck]
  );

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요? &nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
```

`useCallback`으로 함수를 감싸는 이유는 성능 최적화를 위해서이다.
리액트에서는 setState를 이용한 값이 바뀔 경우 화면 내부 요소를 모두 리렌더링함(물론 virtualDom이 실제 변경되었을 경우에만 화면을 새로 그리므로 화면이 바뀌지는 않지만 리렌더링 연산이 소요된다는 의미)
때문에 특정 데이터를 모니터링 하다가 변경되었을 때만 함수가 재생성되도록 만들어주는 것이 바람직하다.
리렌더링 연산이 성능에 큰 영향을 미치지는 않더라도 디버깅할 때 어려워진다. (highlight가 많이 처리되므로)

### 커스텀 훅 만들기

위 회원가입 이벤트에서 email과 nickname의 useState 이벤트 코드가 중복이 되고 있다. 이부분을 커스텀 훅으로 만들어서 해결하면 좀 더 깔끔하게 변경이 가능하다.

먼저 useInput이라는 커스텀 훅 파일을 생성해준다.

`front/hooks/useInput.ts`

```tsx
import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from "react";

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
```

`useInput`에 적용된 타입스크립트 코드를 보자. 해당 함수에는 제네릭을 활용한 타이핑이 추가되었다.
매개변수로 담기는 값을 `T` 변수로 선언한 뒤 각 인자에 그에 맞는 타입이 들어가도록 만들어줄 수 있다.
자칫 코드가 복잡하고 어렵게 느껴질 수 있으나 서비스의 안정성을 위한 처리이므로 최대한 익혀서 실무에 적용하도록 해보자

### 커스텀 훅 적용하기

만들어진 `useInput`을 해당 내용을 회원가입 페이지 `index.tsx`에 적용해준다.

`front/pages/SignUp/index.tsx`

```tsx
import useInput from "@hooks/useInput"; // hook import
import React, { useState, useCallback } from "react";
import { Header, Form, Label, Input, Error, Button, LinkContainer } from "./styles";

const SignUp = () => {
  // useInput으로 모두 변경
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, , setPassword] = useInput("");
  const [passwordCheck, , setPasswordCheck] = useInput("");
  const [mismatchError, setMismatchError] = useState(false);

  // handler 이벤트 중 커스텀이 필요한 건 추가로 만들어 해결
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck]
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        console.log("go submit!");
      }
    },
    [email, nickname, password, passwordCheck]
  );

  return <div id="container">{/* code.. */}</div>;
};

export default SignUp;
```

`email`, `nickname` 뿐만아니라 `password`, `passwordcheck`도 모두 동일하게 변경이 가능하다.
단, `password`, `passwordcheck`은 `mismatchError`를 확인하는 코드가 추가적으로 필요하므로 커스텀 훅에 오는 두 번째 인자는 비워두고 해당 handler 이벤트는 아래에 별도로 생성해준다.
