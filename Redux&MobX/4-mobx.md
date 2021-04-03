# MobX

## MobX 도입하기

### observable, runInAction, autorun

MobX는 기본적으로 상태(state)가 있고, 이 state를 observable이라는 객체로 감싸주면 state가 바뀔 때마다 observer들에게 바뀐 상태에 대해 알려준다. 리덕스에 비해 엄청 간단하다.

MobX는 리덕스보다 간단하지만 너무 자유롭기 때문에 프로젝트를 함께 협업해서 만들어나가는 입장에서 정해진 틀이 없이 우후죽순으로 개발될 가능성이 크다. 따라서 초기 틀을 잘 잡고 해당 틀 내에서 개발하는 것이 중요함

`index.js`

```jsx
const { observable, autorun, runInAction } = require("mobx");

// 1. initialState
const state = observable({
  compA: "a",
  compB: 12,
  compC: null,
});

// 2. subscribe autorun은 바뀐 것을 감지해주는 역할을 한다.
autorun(() => {
  console.log("changed", state.compA);
});

// 4. event binding 하나의 액션 안에 여러 이벤트를 담을 수 있다.
runInAction(() => {
  state.compA = "b"; // 3. dispatch 값을 직접 바꿔주면 dispatch 된다.
  state.comC = "1212";
});
runInAction(() => {
  state.compA = "b"; // 5. 같은 값 할당 ?
});
runInAction(() => {
  state.compA = "c";
});

// changed b
// changed c
```

1. initialState는 `observable`로 객체를 감싸주면 끝임 (물론 다양한 방식이 있지만 제일 간단함)
2. 이벤트에 따른 상태 변경에 대한 감지는 autorun이라는 메서드를 사용한다.
3. mobX는 기본적으로 직접 값을 바꿔주면 알아서 immer가 적용되어 불변한 데이터로 업데이트됨(dispatch 이런거 없음) 따라서 state.compA의 값을 직접 바꿔주면 상태 변경이 되고, 감지도 알아서 된다.
4. 데이터 변경이 연달아 있으면 mobX는 기본적으로 하나의 액션으로 감지하여 autorun에 로깅이 1번만 된다. 이를 구분하고 싶을 때에는 `runInAction`이라는 함수에 분리해서 담아놓으면 된다.
5. 만약 5와 같이 같은 값을 한번 더 할당하면 상태가 업데이트 되지 않았으므로 데이터 업데이트도 되지 않음

### reaction, action

추가적으로 `action`과 `reaction`이라는 메서드도 지원이 된다.

```jsx
const { observable, autorun, reaction, action, runInAction } = require("mobx");

const state = observable({
  compA: "a",
  compB: 12,
  compC: null,
});

reaction(
  () => {
    return state.compB; // 1. reactions: 특정 state 변경 감지
  },
  () => {
    console.log("reaction:", state.compB);
  }
);

const change = action(() => {
  state.compA = 1;
});

change();

runInAction(() => {
  state.compB = 2; // reaction: 2
  state.compC = "c";
});
```

1. reaction 메서드의 경우 return 값이 바뀌었을 때만 실행이 된다. 다시 말해, 특정 state를 첫번째 인수로 넣고, 해당 state가 변경되면 로깅 등의 다양한 처리를 할 수 있도록 지원하는 메서드이다.
2. action 메서드는 액션을 함수로 만들 때 사용하는데, 이렇게 묶어놓고 필요할 때 사용한다.

### 리덕스와 mobX의 차이점

리덕스에서는 state를 하나의 객체로 묶어야 한다.  
그러나 mobX는 여러개의 객체를 가질 수 있다. 또한 데이터를 직접 변경해도 immer가 자동 적용된다.

```jsx
// 여러 개의 state를 가질 수 있다.
const userState = observable({
  isLoggingIn: true,
  data: null,
});

const postState = observable([]);

// 직접 데이터를 변경해준다.
postState.push({ id: 1, content: "aa" });
userState.data = { id: 1, nickname: "vicky" };
```

리덕스는 하나의 액션에 여러가지 이벤트를 동시에 실행시킬 수 있을까? 예를 들어 로그인을 하면서, 게시글을 동시에 등록한다고 한다면..? 리덕스로는 어렵다. 왜냐면 리듀서 사이를 분리해놓았기 때문에 넘나드는게 한계가 있기 때문. 하지만 mobX는 가능하며 자유롭다.

```jsx
runInAction(() => {
  postState.push({ id: 1, content: "aa" });
  userState.data = { id: 1, nickname: "vicky" };
});
```

### mobX가 더 편한데 왜 redux를 많이 사용할까?

리덕스는 리액트와 불변성을 지켜주는 컨셉이 비슷해서 사용이 많이 되어진다. 또한 redux-devtools 등의 훌륭한 디버깅 툴이 지원되는 점과 미들웨어 등의 다양한 서드파티 라이브러리가 존재하는 점도 큰 이점이다.

mobX는 코드량이 적고 상대적으로 러닝커브가 낮아 접근이 쉬운 장점도 있지만 자유도가 높아지면서 서비스의 규모가 커질수록 체계가 잡히지 않으면 코드가 더러워지고 오히려 무너지기 쉽다. 또 높은 자유도로 인해 명확도가 떨어지면서 안정성도 그만큼 떨어진다는 평도 있다.

위와 같은 장단점을 훑어보았을 때 mobX는 아래와 같은 경우 많이 사용하는 것 같다.

- 한 스토어에 저장되는 데이터가 명확하고, 드물게 다른 스토어에 있는 데이터에 접근하는 경우
- 비교적 작은 프로젝트
- 복잡한 상태 관리가 요구되지 않는 경우
