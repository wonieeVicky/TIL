# getStaticProps 적용하기

getStaticProps에 대한 사용법을 익혀보자. 간단한 컴포넌트를 생성해본다. 내가 아닌 특정 유저의 정보를 불러오는 컴포넌트이다.

`pages/about.js`

```jsx
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>Vicky | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="followings">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="followings">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아22"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
```

그리고 특정 사용자 정보를 가져오는 GET /user/{:userId} 라우터를 구현해준다.

`routes/user.js`

```jsx
// GET /user/1 (id 1번 유저 정보 가져오기)
router.get("/:userId", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      // 개인정보 침해 예방
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;

      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});
```

위 라우터의 특징은 개인정보 침해 예방을 위해 length만 내려준다는 점이다. 실제 어떤 유저의 정보를 확인할 때 상세 팔로워, 팔로잉 정보 등을 내려줄 경우 개인정보 침해가 되므로 위와 같이 data 변수에 새로 담아 반환해준다.위와 같이 처리 후 localhost:3026/about에 접근하면 정상적으로 id=1 의 정보가 노출된다.

그렇다면 `getStaticProps`와 `getServerSideProps`는 정확히 어떤 차이가 있는 것일까? 언제 접속해도 데이터가 바뀔 일이 없다면 `getStaticProps`를, 접속할 때마다 접속한 상황에 따라서 화면이 바뀌어야 한다면 `getServerSideProps`을 써야 한다. 보통 웬만한 경우는 다 `getServerSideProps`를 사용한다.

만약 `getStaticProps`를 사용하여 화면을 구현해 줄 경우 나중에 Next에서 빌드를 해줄 때 아예 정적인 HTML 파일로 빌드해준다. 따라서 해당 페이지에 유저가 접근 시 정적인 html 화면을 제공해주는 것이다. 따라서 `getStaticProps`로 구현이 가능한 페이지의 경우에는 최대한 해당 메서드를 이용해주어야 서버의 무리가 덜 가게된다. 하지만 대부분의 페이지가 정보가 실시간으로 업데이트되고, 또한 개인화 정보가 표시되어야 하는 페이지이므로, 블로그 페이지나 이벤트 페이지 정도만이 해당 메서드를 사용할 수 있다.

이제 나머지 페이지들 `pages/profile.js, signup.js`도 getServerSideProps를 적용해준다.

```jsx
import axios from "axios";
import Router from "next/router";
import wrapper from "../store/configureStore";

const Profile = () => {
  return <>{/* codes.. */}</>;
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log("getServerSideProps start");
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : "";
  axios.defaults.headers.Cookie = "";
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log("getServerSideProps end");
  await context.store.sagaTask.toPromise();
});

export default Profile;
```
