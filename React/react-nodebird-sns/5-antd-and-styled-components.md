# antd와 styled-components

백엔드 개발자가 API와 데이터베이스가 준비가 되지 않았다고 가정해보자

프론트개발자는 더미데이터를 가지고 우선 화면을 준비해나가야 한다. 먼저 antDesign과 styled-component를 활용하여 화면 구성을 시작해보자

antDesign 등의 UI 프레임워크를 사용하면 좋은 이유는 버튼, 메뉴바 등 미리 만들어진 스타일 컴포넌트가 있기 때문에 그대로 가져다 사용하면 되기 때문에 업무의 속도가 증진된다. 디자인이 획일화된다는 점이 단점인데, 이러한 부분은 커스터마이징을 사용해서 서비스에 최적화시킨다.

또한 styleSheet 작성 방법으로 CSS, SASS, LESS 등 다양한 방법이 있는데 우리는 CSS 전처리기인 [styled-component](https://styled-components.com/)를 사용하여 디자인을 적용한다. 요즘은 [emotion](https://emotion.sh/docs/introduction)을 많이 사용하는 추세인 듯?

```bash
$ npm i antd styled-components @ant-design/icons
```

먼저 메뉴창부터 antd component - Menu를 참고하여 디자인해보자

```bash
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu } from "antd";

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
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```
