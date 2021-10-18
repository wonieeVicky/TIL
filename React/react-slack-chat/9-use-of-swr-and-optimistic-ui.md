## swr 활용과 optimistic UI

### swr 활용법

로그인 성공 시 다시 로그인 정보를 가져오는 get request를 `mutate` 함수를 통해 실행했다. 하지만 해당 함수를 사용했을 때 불필요하게 서버에 API 요청을 보내 비효율적일 수 있다. 실제 발생한 내용을 로컬 안에서 `mutate` 시키고, API reuest는 사용하지 않는 방법이다.

`front/pages/Login/index.tsx`

```tsx
const { data, error, mutate } = useSWR<IUser | false>("/api/users", fetcher, {
  dedupingInterval: 100000,
});

const onSubmit = useCallback(
  (e) => {
    e.preventDefault();
    setLogInError(false);
    axios
      .post(
        "/api/users/login",
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then((response: AxiosResponse<any>) => {
        mutate(response.data, false); // 여기에서 제어
      })
      .catch((error) => {
        setLogInError(error.response?.data?.code === 401);
      });
  },
  [email, password]
);
```

먼저 `mutate` 함수에 두 개의 인자를 추가해주는데, 첫 번째 인자로는 mutate 할 대상, 두 번째 인자는 `shouldRevalidate` 속성(서버에 값이 변경되었는지 확인 요청)에 대한 값을 설정해준다. 만약 두 번째 인자를 별도로 설정하지 않을 경우 `true`가 기본 값이므로 서버에 변경된 데이터가 맞는지 확인하는 요청이 발생한다. 따라서 정말 서버 측에 변경사항을 요청하지 않기 위해서는 `false`를 두 번째 옵션 값으로 줘야한다. 이러한 방법으로 서버에 요청을 보내지 않고, 데이터를 수정하여 지속적인 요청을 줄일 수 있다.

그러나 무조건 서버에 요청을 줄이는 것만이 능사는 아니다. 요청한 값이 정말 서버에 제대로 반영되어있는지 확인할 필요가 있을 때가 있기 때문이다. 예를 들면 페이스북이나 인스타그램 같은 경우 `좋아요`를 눌렀을 때 서버에 요청 후 응답에 따라 UI를 변경시켜주는 것이 아닌 먼저 UI를 변경시킨 뒤 해당 내용이 제대로 반영되어있는지 점검하는 식으로 작업을 한다. UI 변경 후 점검 시 어떤 이유에서건 해당 내용이 서버에 반영되어 있지 않으면 `좋아요` 반영을 취소해버리는 것이다.

이를 성공할 것이라고 낙관적으로 예측하여 UI를 변경한 뒤 나중에 점검하는 방법이라고 해서 `Optimistic UI`라고 한다. UX로는 훨씬 빠르고 매끈한 플로우를 제공하지만, 데이터가 원복되어 자칫 혼란을 불러일으킬 수도 있다. 이와 반대되는 것을 `Pessimitic UI`라고 하는데 이는 곧, 실패를 예상한 폐쇄적인 상황을 예측하여 서버에 요청을 보낸 뒤 성공했을 때 UI를 업데이트 시키는 방법이다. 이 방법은 우리가 보통 사용하는 방법이다.

우리는 위에서 `mutate` 함수의 두 번째 인자를 false로 설정하였으므로 서버에 점검하는 기능이 수행되지 않는다. 만약 `Optimistic UI`를 구현하고자 한다면 해당 인자를 true로 설정해야 한다.

### 전역에 존재하는 mutate

`useSWR`에 있는 `mutate`함수로 데이터를 업데이트해줬다. 그러나 `mutate` 함수는 전역에서 Import 하여 사용할 수도 있다.

```tsx
import useSWR, { mutate } from "swr";
```

전역 `mutate`를 사용할 때에는 첫 번째 인자에 요청할 api Path, 두 번째, 세 번째 인자에는 기존에 사용하던 대로 넣어주면 된다. 전역에서 사용하는 `mutate`는 보통 필요할 때에만 요청을 처리하고 싶을 때를 사용할 수 있다.

`front/layouts/Workspace.tsx`

```tsx
import useSWR, { mutate } from "swr";

const Workspace: FC = ({ children }) => {
  // Workspace 컴포넌트에서 users 정보를 요청하는 코드가 과연 필요한가?
  // const { data, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const onLogout = useCallback(
    () =>
      axios.post("/api/users/logout").then(() => {
        mutate("/api/users", false, false);
      }),
    []
  );

  // ..
};

export default Workspace;
```

로그인 후 이동된 Workspace의 최상단에서는 로그인 정보를 가져오는 swr 코드가 실행되었다. 하지만 이는 비효율적일 수 있다. 이미 로그인된 상태로 넘어왔기 때문이다. 따라서 해당 요청 코드를 지워버린다. 그리고 이후 로그아웃을 실행했을 때 성공 시 전역의 `mutate` 함수로 users 정보를 재요청한다면 비효율 요청을 줄여버릴 수 있다. 위와 같이 필요한 위치에서만 data-fetching을 하고싶을 때에는 전역 `mutate` 함수를 사용하면 효율적이다.

### 비동기에 얽매이지 않는 swr

swr 쓰임이 단순히 비동기에만 사용되는 것은 아니다. 전역 데이터를 다루는 시점에서 원한다면 `fetcher` 함수를 다양하게 구성하여 커스텀할 수 있다. 바로 아래처럼 말이다.

`Page1.tsx`

```tsx
const Page1 = () => {
  // 로컬 스토리지에 데이터를 저장 후 해당 데이터를 리턴하는 fetcher 설계
  const { data } = useSWR("hello", (key) => {
    localStorage.setItem("data", key);
    return localStorage.getItem("data");
  });
};
```

`Page2.tsx`

```tsx
const Page2 = () => {
  // hello key를 가진 데이터 사용
  const { data } = useSWR("hello");
  console.log(data); // hello
};
```

Page1 컴포넌트에서 첫 번째 Key에 apiPath가 아닌 일반 문자열, 두 번째 인자의 `fetcher` 함수에는 로컬 스토리지에 데이터를 저장 후 해당 데이터를 반환하는 함수를 설계했다고 해보자. 이후 Page2 컴포넌트에 진입 시 해당 콘솔에 hello가 출력된다. Page1에서 만들어 둔 함수로 인해 Page1과 Page2가 데이터 자원을 공유하도록 연결된 것이다. 즉 swr는 비동기 이벤트에 국한되지 않고, 전역 상태를 관리할 수 있다.

이처럼 `fetcher` 함수를 다양하게 만들어 사용할 줄 알아야 swr에 100% 활용할 수 있다고 할 수 있다.

### 동일한 API로 서로 다른 데이터를 관리하고 싶을 때

```tsx
const { data, error, mutate } = useSWR<IUser | false>("/api/users", fetcher, {
  dedupingInterval: 100000,
});
```

swr은 기본적으로 `dedupingInterval` 기본 설정 값인 2초(default, 위 코드에서는 100초)안에는 캐시 데이터를 사용하며 해당 시간 내에 동일한 API 요청 시 한번만 발생하도록 설계되어 있다. 그런데 만약 동일한 API로 서로 다른 데이터를 관리하고 싶을 때는 어떻게 해야할까? apiPath를 살짝 속여주면 된다.

```tsx
const { data, error, mutate } = useSWR<IUser | false>("/api/users", fetcher);
const { data, error, mutate } = useSWR<IUser | false>("/api/users#123", fetcher);
```

위와 같이 api를 조금 다르게 만들어주면 동일한 요청으로 서로 다른 데이터 관리가 가능하다. 살짝 속임수임
