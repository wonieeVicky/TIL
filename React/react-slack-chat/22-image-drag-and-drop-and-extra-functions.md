## 이미지 드래그&드롭 업로드 및 기타 기능 구현

### 이미지 드래그 업로드하기

채팅방에 이미지를 드래그&드롭 했을 때 자동적으로 이미지가 업로드되는 기능을 구현해보자.

`front/pages/DirectMessage/index.tsx`

```tsx
const DirectMessage = () => {
  //..
  const [dragOver, setDragOver] = useState(false);

  // 드래그 드롭 시 액션
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      // 브라우저마다 파일이 저장되는 객체 프로퍼티가 다르다. (e.dataTransfer.items , e.dataTransfer.files)
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === "file") {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log("... file[" + i + "].name = " + file.name);
            formData.append("image", file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log("... file[" + i + "].name = " + e.dataTransfer.files[i].name);
          formData.append("image", e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        mutateChat();
      });
    },
    [mutateChat, workspace, id]
  );

  // 드래그 커서가 DirectMessage 안에 있을 떄 지속적으로 호출
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  // ..

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      {/* codes.. */}
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};
```

`front/pages/Channel/index.tsx`

```tsx
// ..
const Channel = () => {
  // ..
  const [dragOver, setDragOver] = useState(false);

  const onMessage = useCallback(
    (data: IChat) => {
      // 이미지 업로드일 경우 동작 분기 추기
      if (data.Channel.name === channel && (data.content.startsWith("uploads\\") || data.UserId !== myData?.id)) {
        // codes...
      }
    },
    [channel, myData]
  );

  // ..
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === "file") {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log(e, ".... file[" + i + "].name = " + file.name);
            formData.append("image", file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log(e, "... file[" + i + "].name = " + e.dataTransfer.files[i].name);
          formData.append("image", e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
        setDragOver(false);
      });
    },
    [workspace, channel]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  // ..

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      {/* codes.. */}
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default Channel;
```

각 Channel과 DirectMessage의 컨테이너에 onDrop과 onDragOver 액션을 추가해준다.
또 dragOver 가 true일 경우에 해당 창에 업로드!라는 가이드 레이아웃이 발생하도록 돔을 추가해주었다.

`front/components/Chat/index.tsx`

```tsx
// ..
const BACK_URL = process.env.NODE_ENV === "development" ? "http://localhost:3095" : "https://sleact.nodebird.com";

const Chat: VFC<Props> = ({ data }) => {
  // ..
  const result = useMemo(
    () =>
      // 들어오는 데이터가 이미지일 떄 uploads\\서버주소로 들어온다.
      data.content.startsWith("uploads\\") || data.content.startsWith("uploads/") ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          // ..
        })
      ),
    [workspace, data.content]
  );

  return <ChatWrapper>{/* codes.. */}</ChatWrapper>;
};
```

마지막으로 Chat 컴포넌트에서 이미지 업로드 후 해당 data를 적절히 ChatList에 Img 태그로 노출되도록 해주는 코드를 추가해주면 잘 동작하게 된다 :)

### 안 읽은 메시지 수 표시하기

ChannelList와 DMList에서 안 읽은 메시지를 추가로 노출하기 위해 각각 EachChannel과 EachDM 컴포넌트를 생성해준다.

`front/components/EachChannel/index.tsx`

```tsx
const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` : null,
    fetcher
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/channel/${channel.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, channel]);

  return (
    <NavLink key={channel.name} activeClassName="selected" to={`/workspace/${workspace}/channel/${channel.name}`}>
      <span className={count !== undefined && count > 0 ? "bold" : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachChannel;
```

`front/components/EachDM/index.tsx`

```tsx
const EachDM: VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

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
      <span className={count && count > 0 ? "bold" : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;
```

이후 이를 `ChannelList`, `DMList`에 적용해준다.

`front/components/ChannelList/index.tsx`

```tsx
const ChannelList = () => {
	// ..
  return (
    <>
      {/* codes.. */}
      <div>{!channelCollapse && channelData?.map((channel) =>
				<EachChannel key={channel.id} channel={channel} />}</div>
    </>
  );
};
```

`front/components/DMList/index.tsx`

```tsx
//..
const DMList = () => {
  // ..
  return (
    <>
      {/* codes.. */}
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
```

위와 같이 기존에 JSX로 직접 넣어줬던 부분을 `EachDM`, `EachChannel`로 적용해주면 해당 API의 응답값으로 받은 안읽은 메시지 수가 정상적으로 노출된다. 그렇다면 읽지않은 메시지를 어떻게 계속 업데이트하면 될까?

현재 구현된 unreads API는 읽었던 시점 이후로 안읽은 메시지의 수를 읽어오므로 [읽었던 시점]을 기억하는 것이 중요하다. 이는 로컬스토리지에 Channel과 DM 이름에 따른 timestamp를 저장하여 구현하도록 해본다.

`front/pages/Channel/index.tsx`

```tsx
// ..
const Channel = () => {
  // ..
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && myData && channelData) {
        // ..
        }, false).then(() => {
          localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
				// ..
      }
    },
    [chat, chatData, myData, workspace, channelData, channel],
  );

  // ..
  const onDrop = useCallback(
    (e) => {
      // ..
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
				// ..
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
      });
    },
    [workspace, channel],
  );

  useEffect(() => localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString()), [workspace, channel]);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
			{/* codes.. */}
    </Container>
  );
};
```

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
const DirectMessage = () => {
  // ..

  const onSubmitForm = useCallback(
    (e) => {
      if (chat?.trim() && chatData && myData && userData) {
        // ..
        }, false).then(() => {
          localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
          // ..
        });
				// ..
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

	// ..
  useEffect(() => localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString()), [workspace, id]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      // ..
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
				// ..
      });
    },
    [mutateChat, workspace, id],
  );

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      {/* codes.. */}
    </Container>
  );
};
```

위와 같이 각 Channel과 DirectMessage에서 발생하는 다양한 흐름에 timestamp가 지속적으로 업데이트될 수 있도록 빠짐없이 처리해주는 것이 중요하다.

### SWR Devtools

공식 버전은 아니지만 SWR용 데브툴즈가 있어 반영해본다.

```bash
$ npm i @jjordy/swr-devtools
```

이렇게 라이브러리를 설치하다보면 쉘에서 버전이 맞지 않다는 에러들이 간혹 발생한다.
`ERESOLVE unable to resolve dependency tree` 등의 에러임.. 이때는 뒤에 —force를 붙여서 설치해주면 된다. (무조건 붙이지 말고, 버전 차이가 있을 때 크게 영향이 없을 경우에만 붙여준다.)

이를 `client.tsx`에 적용해주면 된다.

`front/client.tsx`

```tsx
// ..
import SWRDevtools from "@jjordy/swr-devtools";

render(
  <BrowserRouter>
    {process.env.NODE_ENV === "production" ? (
      <App />
    ) : (
      <SWRDevtools>
        <App />
      </SWRDevtools>
    )}
  </BrowserRouter>,
  document.querySelector("#app")
);
```
