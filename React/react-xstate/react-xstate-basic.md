## XState

복잡한 UI 상태를 제어할 수 있는 클라이언트 기반 상태 관리 라이브러리 중 하나

FSM 기반 상태 제어 라이브러리.

<aside>
💡 FSM이란? 
유한한 상태의 전이를 표현하는 기계. 수학적 모델로써, 한 번에 오직 한 개의 상태만을 가질 수 있는 유한한 상태들로 이루어져 있는 모델이고 각 상태를 전환할 수 있다.

</aside>

사용자의 행위를 상태 값으로 정의하고 이를 순수 함수로 작성하는 것은 복잡하고 어렵다.

이를 해결하기 위해 XState를 활용해 선언적으로 FSM 모델을 생성하고 상태 관리 기능을 제공함

FSM은 다섯부분으로 구성

- 하나의 초기 상태(an initial State)
- 유한 개의 상태(a finite number of States)
- 유한 개의 이벤트(a finite number of Events)
- 현재 상태와 이벤트로 다음 상태를 결정하는 전이 함수(A transition function that determines the next state givent the current state and event)
- 유한 개의 최종 상태(a finite final States)

### 회원가입 서버 요청 Xstate로 구현

- idle → (fetching) → loading → (success) → resolved
- idle → (fetching) → loading → (failure) → rejected

위 회원가입 서버 요청을 FSM으로 생각해보면 아래와 같음

- 하나의 초기 상태 : idle
- 유한 개의 상태 : idle, loading, resolved, rejected
- 유한 개의 이벤트 : fetching, success, failure
- 현재 상태와 이벤트로 다음 상태를 결정하는 전이 함수
  - fetching: idle → loading
  - success: loading → resolved
  - failure: loading → rejected
- 유한 개의 최종 상태 : resolved

XState로 구현하면 아래와 같다.

`fetchMachine.js`

```jsx
// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    idle: {
      on: {
        FETCHING: {
          target: "loading",
        },
      },
    },
    loading: {
      on: {
        SUCCESS: {
          target: "resolved",
        },
        FAILURE: {
          target: "rejected",
        },
      },
    },
    resolved: {
      type: "final",
    },
    rejected: {},
  },
});
```

useMachine hook 구성

- state : 상태 객체(StateNode)
- send
- service

StateNode에는 다른 상태로 전이하기 위한 transition 함수 존재. 더 유용하게 StateNode를 해석(interpret)하여 아래 기능을 사용하기 쉽게 제공하는 객체들이 존재함

- 상태 전이
- 액션(혹은 side-effects) 실행
- 지연/ 다중 이벤트
- 상태 전이, context 변경 등 다중 이벤트 리스너 등

```jsx
const machine = createMachine({
  states: {
    idle: {
      on: {
        FETCH: {
          target: 'pending';
        }
      }
    },
    pending: { }
  }
});

// transition: 현재의 상태와 전이할 이벤트를 명시
const nextState = machine.transition('idle', { type: 'FETCH'});
// State { value: { 'pending' } ... }

// 위 transition과 같음
const service = interpret(machine);
service.start();
service.send('FETCH');
// State { value: { 'pending' } ... }

// 현 상태 확인
state.matches('loading');
```

위 내용을 회원가입 과정이라고 생각했을 때 아래와 같이 사용할 수 있다.

```jsx
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { fetchMachine } from "./machines/fetchMachine";

export default Join = () => {
  // useMachine
  const [state, send] = useMachine(fetchMachine);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    send("FETCHING"); // send: 상태 전이
    if (error) {
      setError(null);
    }
    try {
      await signUp({ id, password });
      send("SUCCESS"); // send: 상태 전이
    } catch (e) {
      setError(e);
      send("FAILURE"); // send: 상태 전이
    }
  };

  const handleChangeId = (e) => setId(e.target.value);

  const handleChangePassword = (e) => {
    const pwd = e.target.value;
    setInvalidPassword(pwd.length < 8);
    setPassword(pwd);
  };

  // state.matches: 현 상태 확인
  const isDisabled = state.matches("loading") || invalidPassword;

  return (
    <div className="app">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>id</label>
        <input id="id" onChange={handleChangeId} />
        <label htmlFor={"password"}>password</label>
        <input id="password" type="password" onChange={handleChangePassword} />
        <button disabled={isDisabled} type="submit">
          OK
        </button>
      </form>
      {state.matches("loading") && <p>Loading...</p>}
      {state.matches("resolved") && <p>회원가입에 성공했습니다.</p>}
      {state.matches("rejected") && <p>{error}</p>}
    </div>
  );
};
```

### 상태 간의 조합 처리하기

FSM은 단일 상태만을 허용하기 때문에 상태 간의 조합은 다른 상태로서 새롭게 관리하는 방법으로 접근해야 함
만약 위 isDisabled를 FSM 상태로 관리하려면 연산인 loading 상태이거나 invalidPassword 상태를 모두 하나의 상태로서 관리 해야 한다.

그런데 만약 여기서 disabled에 관여하는 다른 조건이 하나 더 추가된다면? 2배의 상태관리가 필요해짐
이렇게 되면 모든 상태에 대한 변화를 인지해야 하므로 관리가 어려워지고 동시에 전이 조합이 복잡해져 도식화를 통한 이점도 사라지게 된다. 이를 state explosion이라고 함.

1987년 컴퓨터 과학자 David Harrel은 FSM이 가지고 있는 문제 중 위 상태 머신의 규모가 커지는 것에 따른 state explosion 문제를 해결하고 유용한 FSM 모델을 가지져가기 위해 Statecharts를 제안함

Statecharts는 FSM을 확장하여 아래의 개념을 추가

1. Extended state(context)
2. Actions(entry/exit/transition)
3. Guards(conditional transitions)
4. Hierarchical (nested) states
5. Orthogonal (parallel) state
6. History

하나씩 알아보자
