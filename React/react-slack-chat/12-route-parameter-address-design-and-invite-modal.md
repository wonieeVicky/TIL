## Router 주소 설계(Route Parameter)

### 라우터 주소 설계

프론트엔드에도 라우터 주소 설계는 매우 중요하다.

`front/layouts/App/index.tsx`

```tsx
const App: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/info" component={Workspace} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
```

App 컴포넌트에서 Workspace의 path 부분에 나오는 `:workspace`는 특수한 역할을 담당해서, 사용자가 자유롭게 값을 바꿀 수 있는 영역이 된다. 이를 라우트 파라미터라고 한다. (/workspace/sleact, /workspace/test 등 워크스페이스 이름별로 path를 분리할 수 있게됨)

위 `/workspace/info` 같은 파라미터가 아닌 path의 경우 반드시 하단 라우트 파라미터로 연결된 것보다 상위에 위치해야 제 주소를 찾아간다. 하위에 있을 경우 라우트 파라미터이 :workspace에 걸리기 때문이다.

`front/layouts/Workspace/index.tsx`

```tsx
const Workspace: VFC = () => {
  // ..

  return (
    <div>
      <Header>{/* code.. */}</Header>
      <WorkspaceWrapper>
        {/* code.. */}
        <Chats>
          <Switch>
            {/* 두 개의 중첩라우트 사용 가능 */}
            <Route path="/workspace/:workspace/channel/:channel" exact component={Channel} />
            <Route path="/workspace/dm/:id" exact component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {/* code.. */}
    </div>
  );
};

export default Workspace;
```

Workspace 내부의 라우팅 코드에도 라우트 파라미터를 적용해준다. 해당 내용을 로그인과 회원가입에 리다이렉팅 코드에 넣어주면 아래와 같이 할 수 있다.

`front/pages/Login/index.tsx` , `front/pages/SignUp/index.tsx`

```tsx
const SignUp(Login) = () => {
	// ..

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />; // redirect path 수정
  }

  return (
    <div id="container">
     {/* code.. */}
    </div>
  );
};

export default SignUp;
```

위와 같이 설정하면 로그인인 시 `/workspace/sleact/channel/일반`으로 페이지가 이동된다. Path 자체만으로도 현재 내가 있는 영역과 위치, 행동에 대해 추측할 수 있는 것이 바람직한 path 작성이라고 할 수 있음

이제 채널을 생성하는 CreateChannelModal 컴포넌트에 라우트파라미터를 코드에 적용시켜보자.

`front/components/CreateChannelModal`

```tsx
import axios from "axios";
import { useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void; // type 추가
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>(); // 현재 위치 url의 Params를 가져온다.

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            // 어떤 워크스페이스에 생성해야하는지를 모름
            // > 현재 채널이 어디있는지 useParams로 체크한다.
            name: newChannel,
          },
          { withCredentials: true }
        )
        .then(() => {
          setShowCreateChannelModal(false);
          revalidateChannel(); // 채널리스트 다시 불러오기
          setNewChannel("");
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel]
  );

  return (
    <>
      {/* modal.. */}
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default CreateChannelModal;
```

- 워크스페이스 내부에 채널을 추가할 때 어떤 워크스페이스에 저장해야 할지에 대한 정보는 url 파라미터 값을 통해 체크한다. 이때 사용할 수 있는 훅으로 useParams가 있으므로 그걸 이용해 구현했다.
- 이와 별개로 위와 같이 설정해도 정말 채널이 잘 생성되었는지 받아올 필요가 있다. 페이지 갱신!
  이를 useSWR의 revalidate를 통해 구현, 채널추가 성공 시 revalidate 함수만 실행시키면 자동으로 채널리스트가 갱신되도록 만들 수 있다. (swr이 데이터를 관리해주므로)

`front/layouts/Workspace/index.tsx`

```tsx
const Workspace: VFC = () => {
  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR<IUser | false>("/api/users", fetcher, { dedupingInterval: 2000 });

  // 현재 워크스페이스에 있는 채널들을 모두 가져오기
  // 만약 로그인하지 않은 상태일 경우 null 처리하여 swr이 요청하지 않도록 처리한다. - 조건부 요청 지원함
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  // events..

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>{/* code.. */}</Header>
      <WorkspaceWrapper>
        {/* code.. */}
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            {/* code.. */}
            {/* channelData가 있을 때 데이터를 아래 하단에 뿌려준다. */}
            {channelData?.map((v) => (
              <div key={v.name}>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        {/* code.. */}
      </WorkspaceWrapper>
      {/* code.. */}
    </div>
  );
};

export default Workspace;
```

이는 workspace 컴포넌트에 useSWR을 추가하여 적용해주는데, `const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);` 이 코드를 보면 알겠지만 분기처리를 통해 값이 있을 경우에만 api request가 발생한다.

해당 데이터가 정상적으로 호출되면 하단 렌더링 여역에 channelData가 리스트로 추가되도록 만들어진다.


### 사용자 초대 모달 만들기

이제 워크스페이스와 채널에 사용자 초대 모달을 만들어본다. 먼저 Workspace에 초대하는 모달을 만들어보자

`front/components/InviteWorkspaceModal/index.tsx`

```tsx
// ..

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>(); // 현재 위치 url의 Params를 가져온다.
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateMembers } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateMembers(); // 채널리스트 다시 불러오기
          setShowInviteWorkspaceModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember],
  );
  return (
    <>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="channel" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default InviteWorkspaceModal;
```

채널에 사용자를 초대하는 모달을 아래와 같다.

`front/components/InviteChannelModal/indextsx`

```tsx
// ..

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>(); // 현재 위치 url의 Params를 가져온다.
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateMembers } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(
          `/api/workspaces/${workspace}/channels/${channel}/members`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateMembers();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );
  return (
    <>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>채널 멤버 초대</span>
            <Input id="channel" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default InviteChannelModal;
```

위의 내용을 Workspace에 추가해준다.

`front/layouts/Workspace/index.tsx`

```tsx
// ..
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';

const Workspace: VFC = () => {
	// ..
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  // ..

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false); // 추가
    setShowInviteChannelModal(false); // 추가
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

	const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  // ...

  return (
    <div>
      {/* codes... */}
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      /
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Workspace;
```

기존 모달들을 보면 모두 공통적인 포맷을 가진 형태로 만들어진다는 것을 확인할 수 있다..! 이를 추상화해서 하나의 컴포넌트로 만들어보는건 어떨까 ? ;)
