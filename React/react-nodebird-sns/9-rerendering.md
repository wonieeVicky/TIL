# 리렌더링 이해하기

우리는 보통 컴포넌트 작업을 할 때 아래와 같이 Style 요소를 직접 돔에 프로퍼티로 주곤 한다.

```jsx
const Test = () => {
  return <div style={{ marginTop: 1 }}>Test</div>;
};
```

그런데 이 부분에는 오류가 있다. 왜냐면 `{} === {}` 는 `false`이기 때문이다.

위와 같이 돔 렌더링 시 스타일 요소를 직접 부여하면 리액트는 객체 값이 달라졌다고 파악하므로 해당 부분을 불필요하게 리렌더링하 된다. (button 부분이 바뀌었다고 인지하여 해당 부분 리렌더링) 때문에 이런 것들은 모두 styled-components를 사용한다.

(물론 성능에 크게 영향이 없다면 그냥 인라인 스타일로 사용해도 괜찮다. 너무 집착할 필요는 없음)

```jsx
// LoginForm.js
import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import styled from "styled-components";

// styled-components를 활용해 디자인 요소 추가
const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const LoginForm = () => {
  return (
    <Form>
      <ButtonWrapper>{/* ... Buttons */}</ButtonWrapper>
    </Form>
  );
};

export default LoginForm;
```

만약 antd의 컴포넌트의 스타일을 커스텀 해야한다면 어떻게 해야할까? 아래와 같이 직접 해당 컴포넌트를 지정해주어 스타일을 추가해주면 된다.

```jsx
// AppLayout.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";

// styled-component에 적용할 antd 컴포넌트를 직접 주입하여 스타일 지정
const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
      </Menu>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```

그런데 만약 styled-component를 굳이 사용하고 싶지 않다면? 값을 캐싱해주는 `useMemo`를 사용하면 된다.

```jsx
// LoginForm.js
import React, { useCallback, useState, useMemo } from "react";
import { Form, Input, Button } from "antd";

// useMemo를 사용한 스타일 값 캐싱
const style = useMemo(() => ({ marginTop: 10 }), []);

const LoginForm = () => {
  return (
    <Form>
      <div style={style}>{/* ... Buttons */}</div>
    </Form>
  );
};

export default LoginForm;
```
