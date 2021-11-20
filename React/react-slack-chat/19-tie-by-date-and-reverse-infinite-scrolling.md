## 날짜별로 묶기, 리버스 인피니스 스크롤링

### 대화를 날짜별로 묶기

슬랙은 대화가 날짜별로 묶인다.
이를 실제 유틸함수로 구현한 뒤, DirectMessage에 적용된 ChatList 컴포넌트에 반영해본다.

`front/utils/makeSection.ts`

```tsx
import { IDM } from "@typings/db";
import dayjs from "dayjs";

export default function makeSection(chatList: IDM[]) {
  const sections: { [key: string]: IDM[] } = {}; // typing
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
```

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import makeSection from "@utils/makeSection";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  // ..
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher
  );

  // ..
  const chatSections = makeSection(chatData ? [...chatData].reverse() : []);

  return (
    <Container>
      {/* codes.. */}
      <ChatList chatSections={chatSections} />
    </Container>
  );
};
```

`front/components/ChatList/index.tsx`

```tsx
import React, { useCallback, useRef, VFC } from "react";
import { ChatZone, Section, StickyHeader } from "./styles";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList: VFC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
```

### 리버스 인피니트 스크롤링(useSWRInfinite)

슬랙의 경우 처음 받아온 데이터 조회 이후 스크롤을 위로 올리면 추가 데이터가 호출된다. 해당 동작은 swr의 다른 훅인 `useSWRInfinite` 를 사용하여 간편하게 구현할 수 있다.

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import useSWRInfinite from "swr/infinite";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
  // ..
  // useSWRInfinite는 2차원 배열의 데이터가 생성된다.
  // [[{id: 1}, {id: 2}, {id: 3}, {id: 4}], [{id: 5}, {id: 6}, {id: 7}, {id: 8}]]
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index: number) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher
  );

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null); // scrollbarRef chatList에서 상위로 이동

  // ...
  // 2차원 배열이 되므로 chatSections도 2차원 배열을 1차원 배열로 변환하여 reverse 처리해준다.
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      {/* codes.. */}
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
    </Container>
  );
};

export default DirectMessage;
```

1. useSWRInfinite는 첫번째 인자에 함수를 넘겨주고, 넘어오는 데이터 중에 setSize라는 setter 함수를 제공함. 해당 함수는 react state와 같이 동작한다. (구현은 `ChatList/index.tsx` 에서)
2. `isEmpty`는 데이터의 양이 없을 때를 감지하고 `isReachingEnd`는 마지막에 다다랐음을 알려주는 값이다.
3. `scrollbarRef`는 기존에 `ChatList` 컴포넌트에 있었으나 상위(`DirectMessage`)로 끌어올린 뒤 ref 인스턴스를 `forwardRef`로 `ChatList`에 상속하는 구조로 변경했다. 이유는 `ChatBox` 등에서 신규 글 등록 시 해당 ref가 최하단을 가리키는 등의 액션을 구현할 때 `Ref`값을 wrapper 컴포넌트에서 가지는 것이 좋기 때문

`front/components/ChatList/index.tsx`

ChatList에서는 ref로 내려주는 값을 forwardRef를 적용하여 대입해준다.

```tsx
// ..
import React, { useCallback, forwardRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onScroll = useCallback((values) => {
    // scroll 위치가 최상단이고, 마지막이 아닐 경우에 setSize로 다음 데이터 fetching
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {
        // scroll 위치 유지
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {/* codes.. */}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
```

### 스크롤바 조정하기

리버스 인피니트 스크롤링 적용 후 발견되는 스크롤바 버그를 간단히 해결해보자!

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import React, { useCallback, useRef, useEffect } from "react";

const DirectMessage = () => {
  // ...
  // 1. 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  // 2. mutate로 optimistic ui 구현
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && myData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          scrollbarRef.current?.scrollToBottom();
        });

        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => mutateChat())
          .catch(() => {
            console.error();
            mutateChat();
          });
      }
    },
    [chat, chatData, myData, userData, workspace, id]
  );

  return <Container>{/* codes.. */}</Container>;
};

export default DirectMessage;
```

1. 먼저 데이터를 form submit 할 때 `ChatList`가 가장 최하단으로 내려가도록 처리하는 것이 필요하다. (신규메시지가 추가된 것이므로) 위와 같이 `useEffect`로 `chatData`의 길이가 달라졌을 때를 감지하여 `scrollToBottom`을 처리해주면 간단하게 개선이 가능하다.
2. 데이터 form submit 시 api response에 따른 `ChatList` 데이터 갱신 과정에서 시간 지연이 발생한다. 이는 UX에 좋지 않으므로 더미데이터를 우선적으로 `ChatList`에 노출하는 optimistic UI를 구현한다. 해당 방법은 `swr`의 `mutate` 메서드를 사용해서 구현할 수 있다. (반드시 두 번째 인자에 `false`삽입)

`front/components/ChatList/index.tsx`

```tsx
import React, { useCallback, forwardRef, RefObject } from 'react';
// ..

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isReachingEnd: boolean;
  scrollRef: RefObject<Scrollbars>; // 1. 추가
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, scrollRef, isReachingEnd }) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1).then(() => {
          // 2. scroll 위치 유지
          const current = scrollRef.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [scrollRef],
  );

  return (
		// ..
	)
});
```

두 번째 개선점으로는 `scollTop`이 0일 때 신규 데이터를 가져오는 과정에서 스크롤이 최상단으로 올라가는 이슈를 고쳐줬는데,
`ChatList` 컴포넌트에서 `scrollRef` 인자를 받아 현재 위치를 잡아주는 코드를 넣어주면 된다.
(`scrollRef` 타이핑 및 `scrollTop` 위치 찾는 방법은 콘솔로 디버깅하여 찾아내본다.)
