## 채팅 보내기

### DM에서 채팅 보내기

DirectMessage에서 ChatBox가 실제 onSubmitForm이 실행될 수 있도록 해보자

`front/pages/DirectMessage/index.tsx`

```tsx
// ..
import axios from "axios";

const DirectMessage = () => {
  // ..
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher
  );

  const onSubmitForm = useCallback(
    (e) => {
      // DM 보내기
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            setChat("");
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat]
  );

  // ..

  return (
    <Container>
      {/* codes.. */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
```

아래와 같이 처리하면 onSubmitForm 동작 구현이 완료된다.
하지만 실제 이벤트 실행시킬 때 submit 이벤트가 발생하지 않는데, 그 이유는 무엇일까?

`front/components/ChatBox/index.tsx`

```tsx
const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  // ..
  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        onSubmitForm(e);
      }
    },
    [onSubmitForm] // 여기 onSubmitForm 이벤트를 최신화하도록 deps에 추가
  );

  return <ChatArea>{/* codes.. */}</ChatArea>;
};

export default ChatBox;
```

바로 `onSubmitForm` 이벤트를 발생시키는 `onKeyDownChat` 이벤트에서 `onSubmitForm` 이벤트가 최신값을 참조하지 않고 있기 때문에 실행되지 않았던 것이다..! 즉, `useCallback` 함수를 사용할 때에는 해당 함수 안에서 사용하는 상태나 `props` 가 있을 경우 반드시 `deps` 배열안에 포함시켜줘야 한다. 만약 넣지 않으면 함수 내에서 해당 값을 참조할 때 가장 최신 값을 참조할 것이라고 보장할 수가 없다. 따라서 `props`로 받아온 함수의 경우 반드시 `deps` 배열에 넣어주어야 정상적으로 동작한다.

### eslint에 react-app 관련 옵션 추가하기

eslint 설정을 통해 위와 같은 react 관련 이슈들을 좀 더 명시적으로 제어받고 관리할 수 있도록 설정할 수 있다.
우선 필요한 패키지를 설치해보자.

```bash
> npm i -D eslint-config-react-app eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react
```

그리고 해당 내용을 eslint 설정에 아래와 같이 반영해준다.

`front/.eslintrc`

```
{
  "extends": ["plugin:prettier/recommended", "react-app"] // react-app 추가
}
```

위와 같이 설정하면 모니터링 해야하는 deps props도 eslint가 주의 단계로 가이드하며, 이외에 별도로 사용하지 않는 매개변수의 색처리를 어둡게 하는 등의 가이드를 추가로 해줄 수 있게 된다 : )
