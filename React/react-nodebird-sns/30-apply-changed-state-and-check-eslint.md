# 바뀐 상태 적용하고 eslint 점검하기

## 바뀐 상태들을 각 컴포넌트에 적용

`/components/AppLayout.js`

```jsx
import React from "react";
import { useSelector } from "react-redux";

import PropTypes from "prop-types";
import Link from "next/link";

import { Menu, Input, Row, Col } from "antd";
import styled, { createGlobalStyle } from "styled-components";
import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user); // 바라보는 값 바꾸기

  return (
    <div>
      {/* code.. */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        {/* code.. */}
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```

`/components/LoginForm.js`

id → email로 값 변경, loginRequestAction 적용, 로그인 버튼에 logInLoading 적용

```jsx
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  // antd에 onFinish에는 자동으로 e.preventDefault()가 적용되어 있다.
  const onSubmitForm = useCallback(() => dispatch(loginRequestAction({ email, password })), [
    email,
    password,
  ]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">이메일</label>
        <br />
        <Input name="user-id" type="email" value={email} onChange={onChangeEmail} required />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
```

`/components/UserProfile.js`

팔로잉, 팔로워를 me 데이터로 변경, logOutLoading 적용, logoutRequestAction액션 dispatch 적용

```jsx
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogout = useCallback(() => dispatch(logoutRequestAction()), []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="followings">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta title={me.nickname} avatar={<Avatar>{me.nickname[0]}</Avatar>} />
      <Button onClick={onLogout} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
```

`/components/PostForm.js`

useEffect적용, Text 값 처리를 useState가 아닌 useInput 커스텀 훅에서 하도록 변경

```jsx
import { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../reducers/post";
import useInput from "../hooks/useInput";

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput("");

  useEffect(() => {
    if (addPostDone) {
      setText(""); // 초기화
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => dispatch(addPost(text)), [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => imageInput.current.click(), [imageInput.current]);

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      {/* ..codes */}
    </Form>
  );
};

export default PostForm;
```

`/components/CommentForm.js`

onSubmit 액션 내 ADD_COMMENT_REQUEST dispatch 처리, useEffect로 Input 초기화

```jsx
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.me?.id);
  const { addCommentDone } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  useEffect(() => {
    setCommentText("");
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    // action이 재사용이 될 가능성이 있으면 별도의 컴포넌트로 분리하고, 그게 아니라면 직접 아래와 같이 넣어준다.
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button
          style={{ position: "absolute", right: 0, bottom: -40 }}
          type="primary"
          htmlType="submit"
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
```

## eslint 정리하기

특정 eslint설정을 업데이트하여 코드를 더욱 보강해보자! 먼저 아래 패키지 추가 설치

```bash
$ npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react
$ npm i -D babel-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

`.eslintrc`

```jsx
{
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ["airbnb"],
  "plugins": ["import", "react-hooks"],
  "rules": {
    "linebreak-style": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/react-in-jsx-scope": "off",
    "object-curly-newline": "off"
  }
}
```

rules 객체 안에 사용하지 않는 불필요한 옵션들은 꺼주면 좋다. airbnb는 비교적 엄격한 수준의 eslint를 체크하므로 적용해서 코드를 좀 더 균일하게 관리하는 것이 바람직하다.

자 이제 상태를 컴포넌트에 적용하고 eslint의 설정을 업데이트하여 saga추가를 위한 전처리를 끝냈다..!
