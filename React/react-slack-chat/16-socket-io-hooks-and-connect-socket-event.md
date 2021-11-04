## socket.io 훅스 및 이벤트 연결

### WebSocket 사용하기

보통 서비스에서 제공되는 일반적인 기능의 대부분은 경우 프론트에서 어떤 기능을 실행 시켜 백에서 데이터를 받는 식의 단방향 흐름을 가진다. 하지만 웹소켓은 실시간으로 데이터를 주고받을 때 사용하는 것으로 데이터 흐름이 양방향인 것이 특징이다.

웹 소켓이 없었다면 프론트는 실시간 데이터를 받아오기 위해 주기적으로 요청(long-polling, 30초에 한번씩 확인)을 보내야 한다. 하지만 웹소켓이 나오면서 프론트와 서버 간에 한번만 연결을 맺어놓으면 양방향 데이터 교류가 가능하다. 먼저 라이브러리를 설치한다.

```bash
> npm i socket.io-client@2
> npm i -D @types/socket.io-client@1.4.35
```

socket.io는 사실 리액트와 socket.io은 그다지 어울리지 않는다. 더 정확히는 리액트의 컴포넌트 구조와 적합하지 않다. 이유는 socket.io은 한번 연결해두면 전역적인 특징을 띄기 때문에 하나의 컴포넌트에 연결했다가 다른 컴포넌트로 이동하면 연결이 끊어져버릴 수 있기 때문이다. 웹소켓의 경우 한번 연결을 해놓으면 끊어지지않고 유지되는 것이 특징인 기능이므로 어떤 컴포넌트에 종속되게 넣어버리면 해당 컴포넌트에서 이탈할 경우 연결이 끊어지므로 공통 컴포넌트에서 작업하는 것이 좋다. 예전에는 HOC를 써서 구현했지만 지금은 훅으로 구현한다.

`front/hooks/useSocket.ts`

```tsx
import io from "socket.io-client";
import { useCallback } from "react";
import axios from "axios";

// 타입스크립트는 빈 객체나 빈 배열은 타이핑을 해줘야 한다.
// [key: string] :: 어떤 키가 들어오든 문자열이기만 하면 된다.
const sockets: { [key: string]: SocketIOClient.Socket } = {}; // 1. sockets 객체 생성
const backUrl = "http://localhost:3095";

const useSocket = (workspace?: string) => {
  const disconnect = useCallback(() => {
    // 2. 연결이 되어있을 때에는 socket 연결을 끊는다.
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);

  return [sockets[workspace], disconnect];
};

export default useSocket;
```

1. 왜 `sockets` 객체를 왜 생성하는 것일까? 슬랙의 경우 각 채널별, dm별 메시지 내용이 분리되어야 하므로 항상 맺고 끊는 것을 잘 해주어야 한다. A 채널의 내용이 B 채널로 가면 안되기 때문..! 따라서 특정 워크스페이스 단위로 웹소켓이 연결되도록 1과 같이 설정해준다.

   또한, `sockets`의 초기값이 빈 객체`{}` (혹은 빈 배열)일 떄는 반드시 타입을 지정해줘야 한다.
   `[key: string]` 은 워크스페이스가 어떤 이름인지 정의할 수 없으므로 문자열은 모두 key값으로 허용한다는 것을 의미한다.

2. `disconnect` 함수에서는 A workspace에서 B workspace로 이동할 경우 기존의 연결을 끊는 코드를 `useCallback`을 통해 구현한다.
