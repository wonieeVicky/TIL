# 리덕스 설치와 필요성 소개

## 리덕스 설치

요즘은 상태관리 라이브러리로 Redux나 mobX를 많이 사용함. 현재는 Redux를 많이 사용하는 추세인데, 리액트에 대한 기본적인 지식이 충족되면 mobX를 사용해보는 것도 좋다. Redux는 코드량이 많은 편이기 때문이다.

이번에는 Next 프로젝트에서 Redux를 붙이는 것을 해보려 한다. 조금 복잡한 과정인데, 이를 효율적으로 도와주는 패키지가 있다. 바로 next-redux-wrapper라는 패키지이다.

일반 Redux와 동작방식이 조금 다르므로 설치 과정에 유의하자

```bash
$ npm i next-redux-wrapper redux
```

우선 상태들을 관리할 configureStore.js를 만들어보자
`store/configureStore.js`

```jsx
import { createWrapper } from "next-redux-wrapper";
const configureStore = () => {};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === "development" });
export default wrapper;
import { createWrapper } from "next-redux-wrapper";
import { createStore } from "redux";

const configureStore = () => {
  const store = createStore(reducer, enhancer);
  return store;
};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === "development" });
export default wrapper;
```

이후 \_app.js에 wapper Redux를 HOC로 감싸주면 app.js에 redux가 적용된다.
(기존에 리액트(혹은 5버전 이하의 Next)에서 Provider 태그로 감싸주어야 했지만 Next 6에서는 별도의 태그로 감싸줄 필요없이 Hoc 적용만으로 store 주입이 가능하다.)

## Redux 필요성

웹 서비스 내에서 공통으로 사용하는 데이터가 존재한다. 예를 들어 유저정보, 로그인 한 횟수 등이 그러하다. 이러한 정보는 각 컴포넌트에 분산되어 필요한데, 그럴 때마다 데이터를 별도로 요청하거나 하는 방법보다는 부모 컴포넌트가 데이터를 보관하고 자식 컴포넌트에게 상속해주는 것이 좋다. 하지만 컴포넌트가 커질 수록 상속해줘야하는 과정이 번거워지면서 중앙 데이터 처리기를 최상위에 두고 해당 데이터가 필요할 때 가져다 쓸 수 있도록 하는 것이 효율적이다. 바로 이 중앙 데이터 처리기가 우리가 흔히 얘기하는 Redux, contextAPI, mobX, apollo이다.

Redux는 실무에서 가장 많이 사용하는 상태관리 라이브러리이다. 간단한 원리를 가지고 있으므로 사용이 쉽고, 또 에러가 발생해도 추적이 쉬운 구조이므로 에러 체크가 원활한 면에서 안정적이라고 할 수 있다. 이와 반대로 단점으로 꼽을 수 있는 것은 코드량이 많다는 것이다. 따라서 리덕스는 더 많은 코드를 쓰는 대신 어플리케이션의 안정성이 높아지고, 상대적으로 mobX는 코드를 적게 쓰는 대신 에러의 트래킹이 어렵다는 점이 있다. 어떤 기능이든 트레이드 오프는 있다.

contextAPI를 사용하면 비동기 처리 시 요청, 성공, 실패에 대한 정의를 직접 해줘야 한다. 또한 api 요청 등을 컴포넌트 내에서 처리하므로 이러한 점은 단점이 된다. 보통 컴포넌트는 뷰에 대한 부분만 담당하고 데이터 관리에 대한 부분은 상태관리 라이브러리에 맡겨야 한다. (요청, 성공, 실패 포함)

따라서 비동기로 처리해야 하는 데이터가 많아질수록 결국 Redux나 mobX의 구조와 같아지게 되므로, 자연스럽게 상태관리 라이브러리를 사용하여 효율성을 높이는 것이 좋다. Redux와 mobX는 모두 그 자체에서 상태(요청, 성공, 실패)를 직접 관리하므로 비즈니스 로직과 화면이 분리되도록 설계에 용이하다.
