﻿## XState

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

### 1. Extended state(context)

Xstate에는 context로 표현되는 확장된 상태가 존재.

위 회원가입 예제에서 사용되는 id, password, error 등은 statecharts의 내부 값으로 관리가 가능하며, machine 내부에서 `assign` 함수로 context를 업데이틀 할 수 있음(외부에서 context 변경은 금지)

`fetchMachine.js`

```jsx
// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    context: {
      id: "",
      password: "",
      error: null,
    },
    idle: {
      on: {
        UPDATE_ID: {
          actions: assign((context, event) => ({ id: event.data })),
        },
        UPDATE_PASSWORD: {
          actions: assign((context, event) => ({ password: event.data })),
        },
        // ..
      },
    },
    loading: {
      // loading에 초기 진입 시 error null로 초기화
      entry: assign((context, event) => ({ error: null })),
      // ..
    },
    // ..
  },
});
```

위와 같이 설정 시 기존에 useState로 id, password를 관리하던 로직을 수정할 수 있다.

```jsx
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { fetchMachine } from "./machines/fetchMachine";

export default Join = () => {
  const [state, send] = useMachine(fetchMachine);
  // const [id, setId] = useState("");
  // const [password, setPassword] = useState("");

  // ..
  const handleChangeId = (e) =>
    send("UPDATE_ID", { data: { id: e.target.value } });

  const handleChangePassword = (e) => {
    const password = e.target.value;
    setInvalidPassword(password.length > 8);
    send("UPDATE_ID", { data: { password } });
  };

  return <div className="app">{/* ... */}</div>;
};
```

context를 활용해 useMachine 내부에서 상태관리를 할 수 있음

### 2. actions

FSM의 경우 상태와 이벤트의 전이만으로 구성되어 있기 때문에 FSM만으로 구현하려면 상태와 함께 발생하는 side-effect는 별도로 처리해줘야 함. state의 상태변화를 감지 후 useEffect에서 fetch를 실행하는 방식으로 기존의 코드를 아래와 같이 개선할 수 있음

```jsx
export default Join = () => {
  const [state, send] = useMachine(fetchMachine);
  // ..

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   send("FETCHING");
  //   if (error) {
  //     setError(null);
  //   }
  //   try {
  //     await signUp({ id, password });
  //     send("SUCCESS");
  //   } catch (e) {
  //     setError(e);
  //     send("FAILURE");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    send("FETCHING");
  };

  useEffect(() => {
    if (state.matches("LOADING")) {
      const doFetch = async () => {
        if (error) {
          setError(null);
        }
        try {
          await signUp({ id, password });
          send("SUCCESS");
        } catch (e) {
          setError(e);
          send("FAILURE");
        }
      };
      doFetch();
    }
  }, [state]);

  // ..

  return <div className="app">{/* ... */}</div>;
};
```

FSM은 상태와 이벤트로만 구성되므로 상태에 반응하기 위해 위와 같이 구현. 이벤트를 통한 상태 전이가 발생할 때 다음 상태인 loading으로 변경 시 signUp 함수를 호출 (state + event → next state + effects)

위 effects가 발생하는 타이밍은 상태에 진입(enter)/이탈(exit) 순간과 전이(transition) 이라는 3가지 발생 시점으로 정리할 수 있다.

```jsx
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    // ..
    loading: {
      entry: assign((context, event) => ({ error: null })),
      invoke: {
        id: "signUpForm",
        src: (context, event) => signUp(event.data),
        onDone: {
          target: "resolve",
        },
        onError: {
          target: "rejected",
          actions: assign((context, event) => ({ error: event.data })),
        },
      },
      // ..
    },
    // ..
  },
});
```

### Guards(contiditonal transitions)

상태 전이 발생 전 특정 조건들을 만족해야 전이가 가능하도록 조건을 설계하는 것도 가능함.

```jsx
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    // ..
    idle: {
      on: {
        // ..
        FETCHING: {
          target: "loading",
          cond: (context, evt) => {
            return context.password.length > 7;
          },
        },
      },
    },
    // ..
    },
		// ..
  },
});
```

위처럼 `cond` 속성을 활용해 기존 Join 컴포넌트의 `invalidPassword`를 수정할 수 있다.

```jsx
export default Join = () => {
  // validation용 필드 삭제
  // const [invalidPassword, setInvalidPassword] = useState(false);

  // ..

  // const isDisabled = state.matches("loading") || invalidPassword;
  // disabled 조건 추가: machine이 다음 transition으로 변화했는지를 판단
  const isDisabled =
    state.matches("loading") ||
    fetchMachine.transition(state, "FETCHING").changed;

  return (
    <div className="app">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        {/* .... */}
        <button disabled={isDisabled} type="submit">
          OK
        </button>
      </form>
    </div>
  );
};
```

뿐만 아니라 `cond` 속성에 사용한 함수는 machine의 옵션으로 `guards` 속성에 함수화하여 사용 가능

```jsx
const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  state: {
    // ..
    idle: {
      on: {
        // ..
        FETCHING: {
          target: "loading",
          cond: "isAvaliablePasswordLength",
        },
      },
    },
    // ..
    },
		// ..
  },
},
{
	// 두번째 인자값으로 guard 속성에 함수화
  guards: {
    isAvaliablePasswordLength: (context, evt) =>
      evt.data?.password.length > 7,
  },
});
```

### Hierarchical states

state explosion을 방지하기 위해 계층/병렬 상태 구조를 활용할 수 있음

- state 세분(refinement)화
- 유사한 전이에 대한 그룹화
- 상태의 격리(isolation)
- 컴포저블(composability) 권장

위 guard를 적용한 machine 코드를 조금 수정해본다.

```jsx
const fetchMachine = createMachine(
  {
    // ..
    state: {
      // ..
      idle: {
        // idle 하위에 에러 관리를 위한 state 추가
        state: {
          noError: {},
          errors: {
            // 계층 구조가 필요한 경우, nested states 가능
            states: {
              tooShort: {},
            },
          },
        },
        // ..
        on: {
          UPDATE_ID: {
            actions: assign((context, event) => ({ id: event.data })),
          },
          // 액션을 연속으로 호출하면서 cond로 조건을 추가할 수 있음.
          // 먼저 true를 만나는 액션에서 행동이 종료 - password 조건 체크 시 에러 발생 상황을 먼저 체크 하도록 컴포넌트 코드 변경
          UPDATE_PASSWORD: [
            {
              target: ".erros.tooShort",
              cond: "isPasswordShort",
              action: "cachePassword",
            },
            { target: ".noError", actions: "cachePassword" },
          ],
          FETCHING: {
            target: "loading",
            // FETCHING 시 조건 체크하던 것을 UPDATE_PASSWORD 이벤트로 변경
            // cond: "isAvaliablePasswordLength",
          },
        },
      },
      // ..
    },
  },
  {
    // actions에 호출되는 함수들을 config로 관리하도록 변경
    actions: {
      cachePassword: assign((context, event) => ({
        password: event.data?.password,
      })),
    },
    guards: {
      // isPassswordShort guards 속성에 추가
      isPasswordShort: (context, evt) => evt.data?.password.length < 8,
      isAvaliablePasswordLength: (context, evt) =>
        evt.data?.password.length > 7,
    },
  }
);
```

idle 내부에 noError, errors 계층 상태 생성. errors 내부는 tooShort로 한 번 더 계층 구조 추가

Xstate에서는 무한대로 계층구조 생성이 가능

위 UPDATE_PASSWORD에서 액션을 연속 호출하여 cond로 비밀번호 조건 체크를 진행. true를 만나는 액션에서 행동이 종료되므로 password 조건 체크 시 에러 발생 상황을 먼저 체크하도록 아래와 같이 컴포넌트 변경을 해준다.

`Join.tsx`

```jsx
export default Join = () => {
  // ..
  // const isDisabled = state.matches("loading") || fetchMachine.transition(state, "FETCHING").changed;
  const isDisabled = [{ idle: "errors" }, "loading"].some(state.matches);

  return (
    <div className="app">
      {/* ... */}
      {state.maches("idle.errors.tooShort") && (
        <p>비밀번호는 8장 이상으로 입력해주세요.</p>
      )}
    </div>
  );
};
```

`isDisabled` 체크 시 기존에는 `matches`와 `transition`을 혼합해서 사용. 상태를 계층 구조로 변경하면서 idle의 내부 상태로 `idle.errors` 를 포함한 상태이거나 `loading` 상태이거나로 조건을 변경할 수 있음

두 가지 이상의 상태 중 하나를 포함하는지 `some` 함수로 판단함

### Orthogonal states

Orthogonal는 직각, 직렬의 상태를 의미한다. 병렬 상태의 노드를 나타내는 말로, 병렬 상태는 동시에 모든 하위 상태에 있으면서, 자식 상태로서 존재하고, 서로 직접적으로 종속되지 않으면서 병렬 상태 노드 간에 전환이 없어야 함.

XState에서 `type: parallel`로 선언할 수 있음. 선언부를 확인해보면 initial 값을 갖지 않는데 초깃값 선언이 불가능하며 상태 자체가 병렬 상태를 감싸고 있는 방식으로 구성

```jsx
const fileMachine = createMachine({
  // ..
  type: "parallel",
  // initial: ?? // parallel state는 initial state를 가질 수 없다.
  states: {
    upload: {
      initial: "idle",
    },
    download: {
      initial: "idle",
    },
  },
});
```

기존 fetchMachine에서 에러 상태에 대한 코드를 병렬 상태로 변경하면 아래와 같음.

```jsx
// createMachine 팩토리 함수를 통해 FSM 및 Statechart를 정의
const fetchMachine = createMachine(
  {
    id: "fetch",
    // initial: "idle",
    state: {
      idle: {
        type: "parallel", // 추가 및 하위 id, password 에러 상태를 병렬로 구성
        states: {
          id: {
            initial: "noError",
            states: {
              noError: {},
              errors: {
                states: {
                  tooShort: {},
                },
              },
            },
          },
          password: {
            initial: "noError",
            states: {
              noError: {},
              errors: {
                states: {
                  empty: {},
                  tooShort: {},
                },
              },
            },
          },
        },
        on: {
          UPDATE_ID: [
            // 상태는 idle 내부의 id, password 병렬 상태로 구성되므로 .id로 표현
            {
              target: ".id.errors.empty",
              cond: "isInputIdEmpty",
              actions: "cacheId",
            },
            {
              target: ".id.noError",
              actions: "cacheId",
            },
          ],
          UPDATE_PASSWORD: [
            {
              target: ".password.errors.empty",
              cond: "isInputPasswordEmpty",
              actions: "cachePassword",
            },
            {
              target: ".password.errors.tooShort",
              cond: "isInputPasswordTooShort",
              actions: "cachePassword",
            },
            { target: ".password.noError", actions: "cachePassword" },
          ],
          FETCHING: [
            {
              target: ".id.errors.empty",
              cond: "isContextIdEmpty",
            },
            {
              target: ".passwrod.errors.empty",
              cond: "isContextPasswordEmpty",
            },
            {
              target: ".password.errors.tooShort",
              cond: "isContextPasswordTooShort",
            },
            {
              target: "loading",
            },
          ],
        },
      },
      loading: { ... },
      resolved: { ... },
      rejected: { ... },
    },
  },
  {
    // actions에 호출되는 함수들을 config로 관리하도록 변경
    actions: {
      // ..
    },
    guards: {
      // guards에는 context와 event를 구분 짓게 나눠본다.
      isContextIdEmpty: (context, _) => context.id?.length === 0,
      isInputIdEmpty: (_, evt) => evt.data?.id.length === 0,
      isPasswordTooShort: (_, evt) => evt.data?.password.length < 8,
      isAvaliablePasswordLength: (_, evt) => evt.data?.password.length > 7,
    },
  }
);
```

id 속성에 빈 값을 허용하지 않도록 추가(isInputIdEmpty, isContextIdEmpty), password 도 빈 값을 허용하지 않음을 표현하기 위해 error 필드를 병렬로 구성함

위 내용을 컴포넌트에 반영 하면 아래와 같다.

```jsx
export default Join = () => {
  // ..
  // 에러에 대한 구분을 id.errors와 password.errors로 세분화
  const isDisabled = [
    { idle: "id.errors" },
    { idle: "password.errors" },
    "loading",
  ].some(state.matches);

  return (
    <div className="app">
      {/* ... */}
      {/* 에러는 아래와 같이 추가 */}
      {state.matches("idle.id.errors") && (
        <>
          {state.matches("idle.id.errors.empty") && (
            <div>아이디 값이 없습니다.</div>
          )}
        </>
      )}
      {state.matches("idle.password.errors") && (
        <>
          {state.matches("idle.password.errors.tooShort") && (
            <div>비밀번호는 8자 이상이어야 합니다.</div>
          )}
          {state.matches("idle.password.errors.empty") && (
            <div>비밀번호 값이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
};
```

### History

history는 stateCharts의 주요 기능이다. 이벤트 발생으로 상태가 다른 상태로 전이되어 이전 상태로 다시 돌아갈 때 활용 가능

```jsx
// deep history
const spaceHeaterMachine = Machine({
  id: "spaceHeater",
  initial: "poweredOff",
  states: {
    poweredOff: {
      on: { TOGGLE_POWER: "poweredOn.hist" },
    },
    poweredOn: {
      on: { TOGGLE_POWER: "poweredOff" },
      type: "parallel",
      states: {
        heated: {
          initial: "lowHeat",
          states: {
            lowHeat: {
              on: { TOGGLE_HEAT: "lowHeat" },
            },
            highHeat: {
              on: { TOGGLE_HEAT: "highHeat" },
            },
          },
        },
        oscillation: {
          initial: "disabled",
          states: {
            disabled: {
              on: { TOGGLE_OSC: "enabled" },
            },
            enabled: {
              on: { TOGGLE_OSC: "disabled" },
            },
          },
        },
        hist: {
          type: "history", // powerOff 상태를 벗어날 때 직전 상태를 history 타입으로 기억
          history: "deep", // shallow, deep 두 가지 기록 유형이 존재. 최상위 기록 값만 기억하거나 모든 하위 상태를 기억
        },
      },
    },
  },
});
```