## DM 내용(ChatList) 구현하기

### DM 내용 표시하기

이제 DirectMessage 컴포넌트에서 동작하는 ChatBox에서 submit이 정상적으로 동작하는 것을 확인할 수 있다. 그렇다면 이 채팅 내역을 화면에 뿌려주는 것이 필요하다. DM 내용을 정상적으로 노출시켜보자.

먼저 DM 내용을 보여주는 컴포넌트는 ChatList이다. ChatList는 채널에서도 사용하므로 공통 컴포넌트로 구성되어 있기 때문에 각 chatData를 부모에서 props로 내려받도록 구현한다.

`front/pages/DirectMessage/index.tsx`

```tsx
const DirectMessage = () => {
  // ...
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher
  );

  // ..

  return (
    <Container>
      {/* ... */}
      {/* ChatList에 props로 chatData 상속 */}
      <ChatList chatData={chatData} />
    </Container>
  );
};
```

`front/components/ChatList/index.tsx`

```tsx
import React, { VFC } from "react";
import { ChatZone, Section } from "./styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      {chatData?.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
};

export default ChatList;
```

Chat 컴포넌트가 아직 만들어지지 않았으므로 얼른 만들어준다.

`front/components/Chat/index.tsx`

```tsx
import { IDM } from "@typings/db";
import React, { VFC } from "react";
import { ChatWrapper } from "./styles";
import gravatar from "gravatar";

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const user = data.Sender;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: "36px", d: "retro" })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{data.createdAt}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
```
