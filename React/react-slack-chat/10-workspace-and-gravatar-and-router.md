## 워크스페이스와 gravatar

### 워크스페이스 만들기

기존 layouts에 Workspace.tsx로 만들었던 Workspace 컴포넌트를 폴더구조로 변경 후 style 코드를 클론해서 넣어준다.

`front/layouts/Workspace/styles.tsx`

```tsx
import styled from "@emotion/styled";

export const RightMenu = styled.div`
  float: right;
`;

export const Header = styled.header`
  height: 38px;
  background: #350d36;
  color: #ffffff;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
  text-align: center;
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 5px;
  right: 16px;
`;

// 나머지는 깃헙에서 보자
```

이제 각종 Workspace에 필요한 컴포넌트들을 넣어줘야하는데, 먼저 슬랙 워크스페이스 우측에 뜨는 프로필 이미지를 위해 `gravatar`를 설치해준다. gravatar는 프로필 이미지를 등록하지 않은 유저에게 고유의 이미지를 부여하여 제공해주는 라이브러리이다.

```bash
> npm i gravatar
> npm i -D @types/gravatar
```

`front/layouts/Workspace/index.tsx`

```tsx
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  Chats,
  MenuScroll,
} from "./styles";
import gravatar from "gravatar";

const Workspace: FC = ({ children }) => {
  // ..

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            {/* ProfileImg에 gravatar 적용 */}
            <ProfileImg src={gravatar.url(data.email, { s: "28px", d: "retro" })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
```

위와 같이 설정 후 화면을 확인해보면 gravatar로 고유 이미지가 부여된 것을 확인할 수 있다.
