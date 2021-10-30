## DM 및 채널 목록 만들기

### Direct Message 목록 생성하기

DM 목록을 보여주는 DMList 컴포넌트를 먼저 생성해보자.

`front/components/DMList/index.tsx`

```tsx
// import useSocket from '@hooks/useSocket';
// import EachDM from '@components/EachDM';
import { IChannel, IDM, IUser, IUserWithOnline } from "@typings/db";
import { CollapseButton } from "@components/DMList/styles";
import fetcher from "@utils/fetcher";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useSWR from "swr";

const DMList = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData, mutate: revalidateUser } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  // const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => setChannelCollapse((prev) => !prev), []);

  useEffect(() => {
    console.log("DMList: workspace 바꼈다", workspace);
    setOnlineList([]);
  }, [workspace]);

  /* useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    // socket?.on('dm', onMessage);
    // console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // socket?.off('dm', onMessage);
      // console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]); */

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
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
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
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
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
            <DMList />
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

### 채널 목록 만들기

위와 같이 채널 목록도 비슷한 맥락으로 바꿔주면 아래와 같다.

`front/components/ChannelLIst/index.tsx`

```tsx
// import useSocket from '@hooks/useSocket';
import { CollapseButton } from "@components/DMList/styles";
import { IChannel, IChat, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import useSWR from "swr";

const ChannelList = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  // const [socket] = useSocket(workspace);
  const { data: userData, mutate: revalidateUser } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => setChannelCollapse((prev) => !prev), []);

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
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
```

`front/layouts/Workspace/index.tsx`

```tsx
// ..
import ChannelList from "@components/ChannelList";

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
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        {/* codes.. */}
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
```
