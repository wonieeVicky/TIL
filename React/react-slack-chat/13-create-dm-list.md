## DM 목록 만들기

### Direct Message 목록 생성하기

DM 목록을 보여주는 DMList 컴포넌트를 먼저 생성해보자.

`front/components/DMList/index.tsx`

```tsx
import { IDM, IUser, IUserWithOnline } from "@typings/db";
import { CollapseButton } from "@components/DMList/styles";
import fetcher from "@utils/fetcher";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useSWR from "swr";

interface Props {
  userData?: IUser;
}

const DMList: FC<Props> = ({ userData }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    []
  );

  const onMessage = (data: IDM) => {
    console.log("dm왔다", data);
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  };

  useEffect(() => {
    console.log("DMList: workspace 바꼈다", workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            const count = countList[member.id] || 0;

            return (
              <NavLink
                key={member.id}
                activeClassName="selected"
                to={`/workspace/${workspace}/dm/${member.id}`}
                onClick={resetCount(member.id)}
              >
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? "c-presence--active c-icon--presence-online" : "c-icon--presence-offline"
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span className={count && count > 0 ? "bold" : undefined}>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
                {(count && count > 0 && <span className="count">{count}</span>) || null}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
```

`react-router-dom`의 `NavList`를 사용하면 자동으로 `activeClassName` 즉, 현재 Path에 따른 `selected` 클래스를 알아서 부여하므로 현재 위치를 나타내거나 할 때 유용하게 사용할 수 있음

`front/components/DMList/styles.tsx`

```tsx
import styled from "@emotion/styled";

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;

  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
    }
  `};
`;
```

`front/layouts/Workspace/index.tsx`

```tsx
// ..
import DMList from "@components/DMList";

const Workspace: VFC = () => {
  // ..

  return (
    <div>
      {/* codes.. */}
      <WorkspaceWrapper>
        {/* codes.. */}
        <Channels>
          {/* codes.. */}
          <MenuScroll>
            {/* codes.. */}
            <DMList userData={userData} />
            {/* {channelData?.map((v) => (
              <div key={v.name}>{v.name}</div>
            ))} */}
          </MenuScroll>
        </Channels>
        {/* codes.. */}
      </WorkspaceWrapper>
      {/* codes.. */}
    </div>
  );
};

export default Workspace;
```
