## 메뉴와 모달 구현

### 메뉴 만들기

상단 아이콘 영역이나 왼쪽 채널을 눌렀을 때 popover되는 메뉴를 만들어보자. 먼저 상단 아이콘 영역을 클릭했을 때 나타나는 메뉴창을 만들어보려고 한다. 해당 메뉴창은 다른 곳에서도 공통으로 쓰이므로 pages가 아닌 components에 넣어 작업한다.

공용 컴포넌트는 언제 나눠야할까? 특정 페이지에서만 사용되는 컴포넌트라면 별도로 분리할 필요는 없다. 단 여러 페이지에서 동일한 레이아웃을 구현해야할 때 해당 컴포넌트는 공용 컴포넌트로 만드는 것이 좋다. 이 부분은 작업자들과 협의해서 컴포넌트 추상화 시점과 정도를 맞추는 것이 좋다.

`front/components/Menu/index.tsx`

```tsx
import { CreateMenu, CloseModalButton } from "@components/Menu/styles";
import React, { CSSProperties, FC, PropsWithChildren, useCallback } from "react";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

// 1. FC 타입에 별도의 커스텀 Props에 대한 타입을 합쳐준다.
const Menu: FC<Props> = ({ closeButton, style, show, children, onCloseModal }) => {
  // 2. 부모 태그로 이벤트 버블링 방지
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
```

1. Menu 컴포넌트에는 children Props를 사용하므로 FC 타입을 지정해줘야한다. 이후 커스텀 속성이 생길 경우 별도로 타이핑을 해주지 않으면 타입에러가 발생한다. 위 Props 인터페이스 타입 처럼 정의해서 제네릭으로 추가해주어야 타입 에러가 발생하지 않는다.
2. 해당 모달은 모달 내부를 클릭했을 때 onCloseModal이 동작하면 안된다. 따라서 CreateMenu 컴포넌트 하위의 div 태그에 stopPropagation 이벤트를 주면 부모 태그로 이벤트 버블링이 되지 않도록 방지해준다.

`front/components/Menu/styles.tsx`

```tsx
import styled from "@emotion/styled";

export const CreateMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;

  & > div {
    position: absolute;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
    border-radius: 6px;
    user-select: none;
    min-width: 360px;
    z-index: 512;
    max-height: calc(100vh - 20px);
    color: rgb(29, 28, 29);
  }
`;

export const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;
```

위와 같이 생성한 Menu 컴포넌트를 Workspace에 넣어준다.

`front/layouts/Workspace/index.tsx`

```tsx
import Menu from "@components/Menu";

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ..

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: "28px", d: "retro" })} alt={data.nickname} />
            {/* Menu 컴포넌트 적용 */}
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: "28px", d: "retro" })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      {/* codes.. */}
    </div>
  );
};

export default Workspace;
```
