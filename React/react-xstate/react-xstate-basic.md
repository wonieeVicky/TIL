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

위 저의 한 내용은 아래와 같이 사용

`Component.tsx`

```jsx
import { useMachine } from "@xstate/react";
import { fetchMachine } from "./fetchMachine";

const Component = () => {
  const [state, send, service] = useMachine(fetchMachine);
  //..
};
```

useMachine hook 구성

- state : 상태 객체(StateNode)
- send
- service

StateNode에는 다른 상태로 전이하기 위한 transition 함수 존재. 더 유용하게 StateNode를 해석(interpret)하여 아래 기능을 사용하기 쉽게 제공하는 객체들이 존재함

- 상태 전이
- 액션(혹은 side-effects) 실행
- 지연/ 다중 이벤트
- 상태 전이, context 변경 등 다중 이벤트 리스너
- 이 외 많음

```jsx
const machine = createMachine({
  states: {
    // state node
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

// transition 함수는 현재의 상태와 전이할 이벤트를 명시합니다.
const nextState = machine.transition('idle', { type: 'FETCH'});
// State { value: { 'pending' } ... }

// 위 동작이랑 같음.
const service = interpret(machine);
service.start();
service.send('FETCH');
// State { value: { 'pending' } ... }

// 현재 상태 확인
state.matches('loading');

```
