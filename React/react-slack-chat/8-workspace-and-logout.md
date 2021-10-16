## 워크스페이스 및 로그아웃 구현

### 워크스페이스 만들기

이제 로그인 후 접근하게 될 워크스페이스에 대한 구조를 잡아보자. 워크스페이스는 여러 채널을 가지고 있는 존재이므로 layout에서 워크스페이스 컴포넌트를 만들고 channel이 pages 내에 위치하도록 해야한다.

`front/layout/Workspace.tsx`

```tsx
import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback } from "react";
import { Redirect } from "react-router-dom";
import useSWR from "swr";

// 1. FC 타입 안에 children이 들어있음, children을 안쓸 경우 VFC로 사용한다.
const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR("/api/users", fetcher, {
    dedupingInterval: 100000,
  });

  // 2. data가 없을 때 로그인 페이지로
  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={() => {}}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
```

- `children`을 매개변수로 사용하는 경우 `FC`라는 타입을 지정해주는 것을 잊지말자, `children`을 사용하지 않을 경우 `VFC`로 타입을 지정해주면 된다.
- data가 없을 때, 즉 유저 정보가 없을 때에는 로그인 화면으로 이동하도록 `Redirect` 처리해준다.

`front/pages/Channel/index.tsx`

```tsx
import Workspace from "@layouts/Workspace";
import React from "react";

const Channel = () => {
  return (
    <Workspace>
      <div>로그인하신 것을 축하드려요 :)</div>
    </Workspace>
  );
};

export default Channel;
```

### 로그아웃 구현

이제 Workspace 컴포넌트에서 로그아웃 이벤트를 구현해본다.

`front/layouts/Workspace.tsx`

```tsx
const Workspace: FC = ({ children }) => {
  // ..

  // logout 구현
  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      });
  }, []);

  // ..

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
```

위와 같이 설정 후 이벤트를 실행해보면 정상적으로 페이지 간 이동이 이루어지는 것을 확인할 수 있다.

이제 로그인 후 회원가입 페이지나 로그인 페이지로 이동 시 적절히 workspace로 리다이렉팅 해주도록 UI 분기처리 코드를 각각 추가해주도록 하자. 특히 회원가입 페이지의 경우 로그인 여부를 확인하기 위한 swr 이벤트를 추가해줘야 함..!

`front/pages/Login/index.tsx`

```tsx
const LogIn = () => {
  const { data, error, mutate } = useSWR("/api/users", fetcher);

  // ...

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  // data와 error가 바뀌는 순간 리렌더링됨
  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return {
    /* codes... */
  };
};
```

`front/pages/SignUp/index.tsx`

```tsx
const SignUp = () => {
  // 로그인 상태 유무 확인하기 위해 swr 이벤트 추가
  const { data, error, mutate } = useSWR("/api/users", fetcher, {
    dedupingInterval: 100000,
  });

  // 각종 Hooks, Event...

  // return은 항상 Hooks 보다 아래에 있어야 한다.
  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  return {
    /* codes... */
  };
};
```

return 이벤트는 반드시 Hooks 뒤에 배치해야 한다. 그렇지 않으면 에러 발생.. 참고하자 :)
