# 로그인 폼 만들기

백엔드 api가 준비되어 있지 않은 상황에서 로그인 상태를 어떻게 체크할 수 있을까?
바로 useState를 이용해 더미데이터 혹은 가상의 상황을 만드는 것이다.

```jsx
// AppLayout.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const AppLayout = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      {/* ...codes */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        {/* ...codes */}
      </Row>
    </div>
  );
};
export default AppLayout;
```

위처럼 로그인 전, 로그인 후에 대한 상황을 컴포넌트로 만들어 상속했다.
기존 React에서는 presentation 컴포넌트와 container 컴포넌트를 별도로 나누어 작업했으나 Hooks가 도입되면서 별도로 뷰와 데이터 동작에 대한 컴포넌트를 분리하지 않는 추세로 변화하고 있다.

우선 LoginForm 컴포넌트를 먼저 만들어보자. 폼에 대한 구조 설계는 테스트로 해보고 이후에는 React에서 제공하는 Form 라이브러리를 사용하여 빠르게 작업하도록 하자!

```jsx
// LoginForm.js
import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";

const LoginForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  return (
    <Form>
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
      <div>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
```
