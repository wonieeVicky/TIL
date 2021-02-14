# 더미 데이터로 로그인하기

먼저 LoginForm에서 antd의 Form 컴포넌트에 기본적으로 들어있는 onFinish 프로퍼티를 이용해 formSubmit 처리를 하여 로그인한 상태로 바꿔주자, 로그인 상태 변경은 AppLayout 컴포넌트에서 Hooks를 상속하는 방법으로 우선 처리한다.

```jsx
import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = ({ setLoggedIn }) => {
  // antd에 onFinish에는 자동으로 e.preventDefault()가 적용되어 있다.
  const onSubmitForm = useCallback(() => setLoggedIn(true), [id, password]);

  return <FormWrapper onFinish={onSubmitForm}>{/* ... inputs and buttons */}</FormWrapper>;
};

export default LoginForm;
```

이제 UserProfile을 작업해본다.

```jsx
// UserProfile.js
import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogout = useCallback(() => setIsLoggedIn(false), []);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />0
        </div>,
        <div key="followings">
          팔로잉
          <br />0
        </div>,
        <div key="followings">
          팔로워
          <br />0
        </div>,
      ]}
    >
      <Card.Meta title="Vicky" avatar={<Avatar>V</Avatar>} />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
```
