# swr로 fetch Data 구현

현재 프로젝트 내부의 액션들이 너무 방대하다. 따라서 이를 효율적으로 줄여주는 swr 라이브러리를 프로젝트에 적용해본다. 먼저 설치부터 한다.

```bash
$ npm i swr
```

그런 다음 프로필 페이지에 swr를 적용해준다.

`pages/profile.js`

```jsx
import useSWR from "swr";

// 1. fetcher 설정
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollwersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  // 2. useSWR 적용 - useState를 통한 limit 정보 포함
  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return "내 정보 로딩 중....";
  }

  // 3. useSWR 에러 시
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생했습니다</div>;
  }

  return <>{/* codes.. */}</>;
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  /* code.. */
});
export default Profile;
```

1. 먼저 useSWR 훅을 사용하려면 fetcher 함수를 설정해줘야 한다. api 통신은 axios를 사용하므로 axiosGET 메서드를 적용하여 result를 반환한다.
2. useSWR은 data와 error를 인자로 받는다. 만약 data, error 모두 없을 경우에는 loading인 상태이다. useState를 통해 limit값을 3의 배수로 받아오도록 설정해준다.
3. useSWR 에러 시 처리에 대한 코드를 작성해준다. **위치는 반드시 Hooks보다 아래에 위치해야 한다!**
   Hooks는 모두 정상 실행되지 않을 경우 에러를 뱉기 때문이다.

위와 같이 설정 후 팔로잉, 팔로워 데이터를 초기 3개만 받고, 더보기를 통해 추가적으로 더 받아오기 위해 기존 followers, followings 라우터를 살짝 수정해준다.

`routes/user.js`

```jsx
// GET /user/followers - 내가 팔로워한 사람 목록 가져오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followers = await user.getFollowers({ limit: parseInt(req.query.limit, 10) }); // limit 3 제한
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/followings - 내가 팔로잉한 사람 목록 가져오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followings = await user.getFollowings({ limit: parseInt(req.query.limit, 10) }); // limit 3 제한
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

위와 같이 설정 후 화면을 렌더링 해보면 404에러가 발생한다. 여기에서 의문이 발생한다.
분명 라우터에는 403, 200의 경우만 설정해두었는데 왜 404 에러가 발생하는 것일까?

미들웨어는 위에서부터 아래로 왼쪽에서부터 오른쪽으로 실행된다. 라우터도 마찬가지인데
해당 라우터 상단의 GET /user/:userId의 설정에서 :userId에 해당 원래는 idx: number가 들어가야 하지만 해당 데이터가 숫자라는 지정이 없으므로 해당 라우터에 걸려서 followers 혹은 followings라는 아이디를 찾아버려 해당 라우터에 존재하는 404 에러가 발생한 것이다.

따라서 해당 라우터를 GET /user/:userId 라우터 상단으로 위치하도록 해주어야 해당 에러를 잡을 수 있다. 이처럼 미들웨어 또한 순서가 매우 중요하다. 위와 같이 라우터 위치를 변경해주면 화면 렌더링이 잘 된다.

이제 더보기 액션을 마무리 해 볼 차례이다. 해당 기능을 위해서는 먼저 초기 설정한 limit값 3이 계속 3의 배수로 데이터를 호출할 수 있도록 설정한다.

`pages/profile.js`

```jsx
const Profile = () => {
  const [followersLimit, setFollwersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  // 1. 3의 배수로 데이터를 가져오도록 변경
  const loadMoreFollowings = useCallback(() => setFollowingsLimit((prev) => prev + 3), []);
  const loadMoreFollowers = useCallback(() => setFollwersLimit((prev) => prev + 3), []);

  // code..

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        {/* 2. 클릭 이벤트 및 로드 상태에 대한 정보를 props로 상속 */}
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followersData}
        />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {});
export default Profile;
```

1. 각 클릭 이벤트를 3의 배수로 호출하도록 변경
2. 해당 클릭이벤트와 loading 정보를 자식 컴포넌트인 FollowList에 props로 상속

`components/FollowList.js`

```jsx
const FollowList = ({ header, data, onClickMore, loading }) => {
  // codes..

  return (
    <List
      loadMore={
        <div style={loadMoreStyle}>
          <Button onClick={onClickMore} loading={loading}>
            더보기
          </Button>
        </div>
      }
			{/* settings... */}
    />
  );
};

FollowList.propTypes = {
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
```

자식컴포넌트에서는 상위 profile.js에서 내려준 정보를 Button에 적용하여 더보기 액션이 진행될 수 있도록 한다. 현재 가져온 followersData, followingsData가 3의 배수보다 작을 경우 해당 더보기 버튼을 지워주는 등의 기능을 고도화할 수도 있겠다 🙂

위 코드를 보면 useSWR 동작 시 limit으로 처리한 것이 옳은 방식은 아니다. 왜냐면 처음에 3개의 데이터 두번 째는 6, 그 다음은 9 이런 식으로 중복된 데이터를 호출해오기 때문이다. 데이터 낭비인 부분이다. 따라서 이런 것의 경우 useEffect에 followersData 혹은 followingsData의 id로 비교해서 기존 state에 concat하는 방식으로 개선할 수 있다.

이와 같이 useSWR Hook을 사용하는 방법에 대해 알아보았다. 해당 Hook을 이용하면 기존의 loadAction을 위해 만들어줘야하는 복잡한 코드들을 굳이 쓰지 않아도 된다. 또 자체적으로 error와 loading 에 대한 단계를 내려주므로 비교적 간단하므로 많은 경우에 활용해볼 수 있겠다. 단, SSR이 필요없는 경우에만 그러하다. fetcher의 경우 유틸파일에 모아두고 동일한 함수를 불러서 재사용하여 사용하면 좋다!
