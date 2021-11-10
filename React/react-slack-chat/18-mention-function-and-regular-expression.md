## 멘션 기능과 정규표현식 문자열 변환

### 멘션 기능 만들기

슬랙을 이용하다보면 멘션 기능을 흔하게 사용할 수 있다. @를 치면 관련된 사람들이 선택될 수 있도록 검색되는 것인데, 이를 직접 구현하지 않고 이미 만들어진 라이브러리를 이용한다.

```bash
> npm i react-mentions --save
```

해당 라이브러리의 공식문서를 보고 사용법을 적용한 ChatBox는 아래와 같다.

`front/components/ChatBox/index.tsx`

```tsx
// ..
import { Mention, SuggestionDataItem } from 'react-mentions';
import gravatar from 'gravatar';

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('/api/users', fetcher, {dedupingInterval: 2000 });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  // ..
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        {/* codes.. */}
    </ChatArea>
  );
};
```

`front/components/ChatBox/styles.tsx`

```tsx
import styled from "@emotion/styled";
import { MentionsInput } from "react-mentions";

//...

// 1. 이미 만들어진 컴포넌트에 스타일을 추가할 수 있다.
export const MentionsTextarea = styled(MentionsInput)`
  // ..
`;

// 2.function a () {} => 실행: a(); 혹은 a``; (tagged template literal)
// emotion에서는 변수를 props로 내려서 조건부 렌더링이 가능함.
export const EachMention = styled.button<{ focus: boolean }>`
  // ...
  ${({ focus }) =>
    focus &&
    `
    background: #1264a3;
    color: white;
  `};
`;
```

1. react-mentions를 사용할 때에는 몇가지 스타일도 수정되어야 하는데, 먼저 textarea를 수정해주던 MentionsTextarea에 MentionsInput을 대입해준다. styled-components는 이미 만들어진 컴포넌트에도 스타일을 추가할 수 있다.
2. 함수 실행 방법 중에 ``` 를 사용할 수 있다. `aa();` 도 가능하지만 `a``;`도 가능하며,  ``` 사이에 인자도 넣을 수 있다. `a`123`;` 따라서 ` styled.button``; ` 이러한 문법도 결국 함수를 호출하는 것이라는 것을 알 수 있다. 그 내부에 인자로 props를 내려주며, `focus` 값에 따른 조건부 렌더링도 설정할 수 있다.
