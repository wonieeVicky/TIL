# Link, Router 메서드를 이용해 다이나믹 라우팅 페이지로 연결

이번에는 메인 상단의 검색창 영역 컴포넌트에 해시태그 검색을 구현해보자.

이미 해시태그 검색은 지난 시간에 기능 구현을 해두었기 때문에 해당 검색창에서 검색 실행 시 해시태그 검색이 실행되도록 페이지 연결만 해주면 된다.

`components/AppLayout.js`

```jsx
import React, { useCallback } from "react";
import Router from "next/router";
import useInput from "../hooks/useInput";

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput("");
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        {/* codes.. */}
        <Menu.Item>
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>
      {/* codes.. */}
    </div>
  );
};

export default AppLayout;
```

위와 같이 SearchInput에 value, onChange, onSearch 값을 부여하는데 먼저 value와 onChange는 지난 시간에 만들어 둔 커스텀 훅을 적용하고, onSearch의 경우 next에서 제공하는 Router 메서드에 시도할 path를 push 해주는 방법으로 구현한다.

이번에는 게시글에서 아바타를 누르면 해당 사람의 게시글 피드를 볼 수 있는 페이지로 이동시켜보자.

`components/PostCard.js`

```jsx
import Link from "next/link";

const PostCard = ({ post }) => {
  // settings..

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
				{/* Settings.. */}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <Card.Meta
							{/* Link로 동적 라우팅 페이지로 연결 */}
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              {/* Settings.. */}
            />
          </Card>
        ) : (
          <Card.Meta
						{/* Link로 동적 라우팅 페이지로 연결 */}
            avatar={
              <Link href={`/user/${post.User.id}`}>
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            {/* Settings.. */}
          />
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
						{/* Settings.. */}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
									{/* Link로 동적 라우팅 페이지로 연결 */}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
```

위와 같이 설정하면 아바타 영역을 클릭했을 때 해당 유저가 작성한 게시글만 정확하게 노출된다! `localhost:3026/user/1`

위와 같은 방법으로 UserProfile 영역 하단의 짹짹, 팔로잉, 팔로워도 해당 페이지로 연결시켜주도록 하자

`components/UserProfile.js`

```jsx
import Link from "next/link";

const UserProfile = () => {
  // settings..
  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            <a>
              짹짹
              <br />
              {me.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="followings">
          <Link href={"/profile"}>
            <a>
              팔로잉
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="followings">
          <Link href={"/profile"}>
            <a>
              팔로워
              <br />
              {me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      {/* codes.. */}
    </Card>
  );
};

export default UserProfile;
```

위처럼 Link 를 이용해 [짹짹]을 누르면 업로드한 게시글을 조회할 수 있는 게시글페이지로 [팔로잉, 팔로워]를 누르면 상세 내역을 볼 수 있도록 profile 패스로 라우팅해준다 : )

프로젝트의 마무리 단계로 상세한 설정을 이렇게 맞춰준다.
