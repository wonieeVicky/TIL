# 반응형 그리드 사용하기

반응형 그리드 사용을 위해 antd에서 Row 와 Col 컴포넌트를 가져와서 적용해준다.

보통 반응형 작업을 할 때에는 모바일 → 태블릿 → 데스크탑 순서로 맞춰주는 것이 바람직하다. 데스크탑을 먼저 작업하고 이후 태블릿과 모바일을 최적화하면 브레이크 포인트 설정이 복잡해져서 업무 난이도가 올라간다.

또한 반응형을 잡을 때에는 가로(Row)부터 잡은 후 세로(Col)를 잡아주는 순서로 진행한다.

```jsx
// AppLayout.js

import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";

const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {/* 1. gutter: 간격 */}
      <Row gutter={8}>
        {/* 2. Col 프로퍼티 */}
        <Col xs={24} md={6}>
          왼쪽 메뉴
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/* 3. _blank 시 rel 프로퍼티 */}
          <a
            href="https://www.notion.so/fongfing/Vicky-s-FE-Engineering-Wiki-d7e660205c0047118a78d664b07418fd"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by Vicky
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```

1. gutter는 컬럼 사이의 간격을 주는 프로퍼티이다.
2. 보통 antd는 24개의 Col로 이루어져있고, 이를 xs, sm, md, lg, xl, xxl 등의 사이즈일 때 규격을 조정할 수 있다.
   만약 Col 컴포넌트에 xs=13씩을 부여한 컴포넌트가 2개 있다고 치면, 해당 컴포넌트는 겹쳐져 24만큼 100%의 공간을 채운 뒤 나머지 공간이 다음 줄에 추가되는 식으로 구성된다. 두 개의 컴포넌트를 한 줄에 배치하고 싶으면 24라는 숫자 내에 공간을 나눠가져야 한다. (별개로 일부러 특정 공간을 띄우는 offset 컬럼도 있으니 찾아볼 것)
3. 새 창으로 띄울 때에는(\_blank) 반드시 해당 프로퍼티도 함께 넣어준다. 보안 이슈를 방지함
