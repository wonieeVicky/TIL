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
