# 커스텀 훅을 이용해 회원가입 페이지 만들기

회원가입 페이지를 만들어보자.
회원가입 페이지에는 아이디, 닉네임, 비밀번호, 비밀번호 확인 등의 Input 이 필요하고, 해당 값에 대한 초기값과 onChange이벤트를 각각 useState, useCallback을 이용하여 구현해줘야 한다.

그런데 이미 구현해놓은 LoginForm에서도 그렇고 Form 내부의 Input값이 많아질 수록 중복되는 형태의 useState, useCallback(onChange) 이벤트가 많아지므로 이러한 것을 커스텀 훅을 이용해 구현해보자.

```jsx
// hooks/useInput.js
import { useState, useCallback } from "react";

export default (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => setValue(e.target.value), []);
  return [value, handler];
};
```

위처럼 만든 커스텀 훅을 LoginForm 컴포넌트에 적용해보자.

```jsx
import React, { useCallback, useState } from "react";
import useInput from "../hooks/useInput";

const LoginForm = ({ setIsLoggedIn }) => {
  // 커스텀 훅 useInput 적용
  const [id, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
      </div>
    </FormWrapper>
  );
};

export default LoginForm;
```

같은 방법으로 signup.js 내 회원가입 페이지를 구현한다.

```jsx
import { useCallback, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { Form, Input, Checkbox, Button } from "antd";
import useInput from "../hooks/useInput";
import styled from "styled-components";

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const [id, onChangeId] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");

  // passwordCheck는 중복 체크도 해줘야하므로 별도 처리해준다.
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  // 이용약관 체크도 이벤트에 다른 점이 있으므로 별도로 훅 생성
  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const buttonStyle = useMemo(() => ({ marginTop: 10 }), []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
  }, [password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nickname} required onChange={onChangeNickname} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            비키 말을 잘 들을 것을 동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의해야 합니다.</ErrorMessage>}
        </div>
        <div style={buttonStyle}>
          <Button type="primary" htmlType="submit">
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default Signup;
```
