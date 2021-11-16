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
