## 워크스페이스와 gravatar
### 워크스페이스 만들기

기존 layouts에 Workspace.tsx로 만들었던 Workspace 컴포넌트를 폴더구조로 변경 후 style 코드를 클론해서 넣어준다.

`front/layouts/Workspace/styles.tsx`

```tsx
import styled from '@emotion/styled';

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
import { Header, RightMenu, ProfileImg, WorkspaceWrapper, Workspaces, Channels, WorkspaceName, Chats, MenuScroll } from './styles';
import gravatar from 'gravatar';

const Workspace: FC = ({ children }) => {
  // ..

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
						{/* ProfileImg에 gravatar 적용 */}
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
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

### 중첩 라우터 적용

이제 DM을 구현하기 위한 컴포넌트를 하나 만들어보자. DM 도 Workspace 내부에 존재하는 컴포넌트 이므로 아래와 같이 구현할 수 있다.

`front/pages/DirectMessage/index.tsx`

```tsx
import Workspace from '@layouts/Workspace';
import React from 'react';

const DirectMessage = () => {
  return (
    <Workspace>
      <div>Direct Message :)</div>
    </Workspace>
  );
};

export default DirectMessage;
```

`front/layouts/App/index.tsx`

```tsx
import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/channel" component={Channel} />
      <Route path="/workspace/dm" component={DirectMessage} />
    </Switch>
  );
};

export default App;
```

위와 같이 라우터까지 설정해주고 나면 `Workspace` 컴포넌트 내 children 속성을 활용하여 각 컴포넌트가 동작하도록 구현된다. 지금 구조에 대해 살펴보면, `Workspace`를 공통으로 갖는 `Channel`과 `DirectMessage`가 최상위 라우트에 각각 개별로 존재하는데 이는 이후 컴포넌트가 다양해졌을 때 최상위 라우터의 복잡도를 증가시키므로 이를 중첩 라우터를 통해 개선할 수 있다.

아래는 중첩 라우터로 만든 Workspace, Channel, DirectMessage 컴포넌트이다.

`front/pages/Channel/index.tsx`

```tsx
import React from 'react';

const Channel = () => {
  return <div>로그인하신 것을 축하드려요 :)</div>;
};

export default Channel;
```

`front/pages/DirectMessage/index.tsx`

```tsx
import React from 'react';

const DirectMessage = () => {
  return <div>DirectMessage :)</div>;
};

export default DirectMessage;
```

기존 Workspace 컴포넌트로 감싸주던 코드를 삭제했다.

`front/layouts/Workspace/index.tsx`

```tsx
// ..
import loadable from '@loadable/component';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  // ..
  return (
    <div>
      {/* ... */}
      <WorkspaceWrapper>
        {/* ... */}
        <Chats>
          <Switch>
            {/* 계층적 Route */}
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
```

그리고 Workspace 컴포넌트에 Switch 컴포넌트를 써서 각 Channel과 DirectMessage 컴포넌트를 라우터로 구현했다. 이를 계층적 라우터라고 하는데, 이와 같은 중첩 라우터로 사용하기 위해서는(즉, Switch 안에 Switch가 있을 경우에는) 중첩 path를 가져야 한다.(/workspace) 즉 Channel과 DirectMessage의 path가 workspace라는 큰 계층 안에 존재하는 자식 라우터로 존재하므로 위와 같이 중첩 라우터로 구현할 수 있는 것임

`front/layouts/App/index.tsx`

```tsx
const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
```

위와 같이 처리하면 App 컴포넌트에서 관리하는 최상위 라우터에서는 Workspace만 불러와 큰 단위의 라우터로 바라볼 수 있게된다. 이는 각 도메인 별로 라우터를 관리하도록 하여 훨씬 명료하게 코드를 관리할 수 있도록 해주어 도메인 주도 개발적인 측면에서 효율성을 증대시켜주는 방법이다. (어떤 방법이 딱 옳다.라고 할 수 없지만 필요한 경우에 따라 위와 같이 사용할 수도 있다는 것을 익히자)

프론트에서도 주소 설계를 잘해놔야 컴포넌트 구조를 잡을 때 편리하다.