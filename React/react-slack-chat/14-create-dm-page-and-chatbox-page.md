## DM 페이지 및 ChatBox 구현

### DM 페이지 만들기

Channel 에서 DM목록과 채널 목록을 만들었으니 이제 DM 페이지 내부의 컴포넌트를 구현한다. 컴포넌트 구조를 만들기 위해서는 먼저 큰 컴포넌트에서 작은 조각을 미리 배치하여 하나씩 세부적으로 만들어나가는 방향으로 작업한다.

`front/pages/DirectMessage/index.tsx`

```tsx
import React from "react";
import { Container, Header } from "./styles";
import gravatar from "gravatar";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { IUser } from "@typings/db";
import { useParams } from "react-router";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.email, { s: "24px", d: "retro" })} alt={userData.nickname} />
        <span>{userData?.nickname}</span>
      </Header>
      {/* <ChatList /> */}
      {/* <ChatBox chat="" /> */}
    </Container>
  );
};

export default DirectMessage;
```

위처럼 ChatList, ChatBox 컴포넌트를 구현하지 않은 상태에서 우선 자리배치를 한 뒤 상세하게 하나씩 만들어나가면 된다.

`front/components/ChatBox/index.tsx`

```tsx
import React, { useCallback, VFC } from "react";
import { ChatArea, MentionsTextarea, Form, Toolbox, SendButton } from "./styles";

interface Props {
  chat: string;
}

const ChatBox: VFC<Props> = ({ chat }) => {
  const onSubmitForm = useCallback(() => {}, []);
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea>
          <textarea />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              "c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send" +
              (chat?.trim() ? "" : " c-texty_input__button--disabled")
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
```

`front/components/ChatList/index.tsx`

```tsx
import React from "react";
import { ChatZone, Section } from "./styles";

const ChatList = () => {
  return (
    <ChatZone>
      <Section></Section>
    </ChatZone>
  );
};

export default ChatList;
```

이후 두 자식 컴포넌트가 완성되면 `DirectMessage` 컴포넌트에 import 한다.

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";

const DirectMessage = () => {
  // ..

  return (
    <Container>
      {/* ... */}
      <ChatList />
      <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
```

### ChatBox 만들기

이번에는 ChatBox를 자세히 구현해볼 차례이다. ChatBox는 Channel과 DirectMessage에서 공용으로 사용되는 컴포넌트이므로 동작 구현에 필요한 이벤트나 데이터는 모두 props로 내려받아 처리한다. 또한 ChatBox는 늘어나는 글자 수에 따라 컴포넌트의 높이값이 자동으로 늘어나야하므로 이러한 기능은 라이브러리를 사용해 구현한다.

```bash
> npm i autosize
> npm i -D @types/autosize
```

`front/components/ChatBox/index.tsx`

```tsx
import React, { useCallback, useEffect, useRef, VFC } from "react";
import { ChatArea, MentionsTextarea, Form, Toolbox, SendButton } from "./styles";
import autosize from "autosize";

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current); // autosize Height
    }
  }, []);

  const onKeyDownChat = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmitForm(e);
    }
  }, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          ref={textareaRef}
        />
        <Toolbox>
          <SendButton
            className={
              "c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send" +
              (chat?.trim() ? "" : " c-texty_input__button--disabled")
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
```

위와 같이 ChatBox 구현 후 이를 Channel과 DirectMessage에 반영한다.

`front/pages/Channel/index.tsx`

```tsx
// ..
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput("");
  const onSubmitForm = useCallback((e) => {
    // DM 보내기
    e.preventDefault();
    setChat("");
  }, []);
  return (
    <Container>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
```

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const DirectMessage = () => {
  // ..

  const [chat, onChangeChat] = useInput("");
  const onSubmitForm = useCallback((e) => {
    // DM 보내기
    e.preventDefault();
    console.log("submit");
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      {/* codes.. */}
      <ChatList />
      <ChatBox chat="" onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
```
