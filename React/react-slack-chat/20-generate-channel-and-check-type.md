## 채널 생성 및 타입 가드를 통한 타입 점검

### 타입 점검

기존에 만들었던 `useInput`에서 발생하는 타입 에러를 개선해본다.

`front/hooks/useInput.ts`

```tsx
import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from "react";

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

// const useInput = <T>(initialData: T): ReturnTypes<T> => {
// 1. 제네릭 T값을 string 혹은 number로 한정
const useInput = <T extends string | number>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // setValue(e.target.value); // 여기에서 타입에러 발생
    setValue(e.target.value as unknown as T); // 2. as unknown as T로 타입 강제 변환
  }, []);
  return [value, handler, setValue];
};

export default useInput;
```

1. 기존에 모든 타입이 허용되었던 T에 `extends string | number`를 추가하여 타입 한정을 둔다.
   (실제 변환해보니 T가 number일 경우 T.trim() 코드에서 에러가 발생하여 이 부분은 적용하지 않음)
2. e.target.value에 타입 에러가 발생했는데, 이 부분은 as unknown as T를 넣어 강제적으로 T 타입으로 변환해준다. (강제 타입 변환은 결코 좋은 방법이 아니므로 더 좋은 방법이 없을지 고민해보자..!)

### 채널 만들기

기존 DirectMessage에서 구현한 채팅을 Channel에서도 구현해본다. DirectMessage에서 구현한 코드를 복붙한 뒤 Channel에 맞게 수정해주는 방향으로 작업하면 좋다 😂

`front/pages/Channel/index.tsx`

```tsx
// ...
const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR<IUser>(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput("");
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher
  );

  //..

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // channel에 맞게 수정
      if (chat?.trim() && chatData && myData && channelData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData?.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollbarRef.current?.scrollToBottom();
        });

        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .then(() => mutateChat())
          .catch(() => {
            console.error();
            mutateChat();
          });
      }
    },
    [chat, chatData, myData, workspace, channelData, channel]
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // 채널에 맞게 수정
      if (data.Channel.name === channel && data.UserId !== myData?.id) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log("scrollToBottom!", scrollbarRef.current?.getValues());
              setTimeout(() => scrollbarRef.current?.scrollToBottom(), 50);
            }
          }
        });
      }
    },
    [channel, myData]
  );

  // 채널용 socket.io 연결
  useEffect(() => {
    socket?.on("message", onMessage);
    return () => {
      socket?.off("message", onMessage);
    };
  }, [socket, onMessage]);

  // ..
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return <Container>{/* codes.. */}</Container>;
};
```

### 타입 점검하기(타입 가드)

위와 같이 채널에 맞게 수정하다보면 몇가지 타입에러가 발생한다. 먼저 `chatSections`를 생성하는 `makeSection` 함수에 타입에러가 발생한다. 이는 `makeSection` 함수에 `IDM` 타입만 처리해두었기 때문이다. 아래와 같이 수정한 후 동일한 타입 에러 발생 영역을 모두 수정해본다.

`front/utils/makeSection.ts`

```tsx
import { IChat, IDM } from "@typings/db";

export default function makeSection(chatList: (IDM | IChat)[]) {
  // 이렇게 타입을 중복으로 지정할 수 있다.
  const sections: { [key: string]: (IDM | IChat)[] } = {};
  // ...
  return sections;
}
```

`front/components/ChatList/index.tsx`

```tsx
// ..
import { IDM, IChat } from "@typings/db";

interface Props {
  // IChat 타입 추가
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  // ..
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, scrollRef, isReachingEnd }) => {
  // ..
  return <ChatZone>{/* codes.. */}</ChatZone>;
});
```

`front/coponents/Chat/index.tsx`

```tsx
// ..
import { IChat, IDM } from "@typings/db";

interface Props {
  data: IDM | IChat;
}

const Chat: VFC<Props> = ({ data }) => {
  // const user = data.Sender; // 타입에러 발생(IChat의 경우 Sender 프로퍼티가 없음)
  // 아래와 같이 타입 가드 역할을 구현하여 타입 분기를 할 수 있다. 자바스크립트 문법
  const user = "Sender" in data ? data.Sender : data.User;

  // ..

  return <ChatWrapper>{/* codes... */}</ChatWrapper>;
};
```
