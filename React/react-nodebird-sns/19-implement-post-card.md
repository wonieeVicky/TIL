# 게시글 구현하기

이제 nodeBirds 핵심 기능인 게시글을 구현해 볼 차례이다.
아직 서버와 통신하는 것들이 없으므로 클릭 이벤트의 동작은 useState로 구현한다.

```jsx
import { useCallback, useState } from "react";
import { Button, Card, Popover, Avatar } from "antd";
import PropTypes from "prop-types";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import PostImages from "./PostImages";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpend] = useState(false);
  const id = useSelector((state) => state.user.me?.id); // 1. optional chaining

  const onToggleLike = useCallback(() => setLiked((prev) => !prev), []);
  const onToggleComment = useCallback(() => setCommentFormOpend((prev) => !prev), []);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger">삭제</Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={post.content}
        />
      </Card>
      {commentFormOpened && <div>댓글 부분</div>}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
```

1. Optional Chaining을 사용하면 코드량을 대폭 줄일 수 있다.
   optional chaining 연산자 `?.`는 체인의 각 참조가 유효한지 명시적으로 검증하지 않고, 연결된 객체 체인 내에 깊숙이 위치한 속성 값을 읽을 수 있다. `.`체이닝 연산자와 유사하게 작동하지만 만약 참조가 Nullish(null or undefined)라면 에러가 발생하는 것 대신에 표현식의 리턴 값은 undefined로 단락된다.

```jsx
// optional chaining
const adventurer = {
  name: "Alice",
  cat: {
    name: "Dinah",
  },
};
const dogName = adventurer.dog?.name; // undefined
const result = adventurer.customMethod?.(); // 함수 동작에도 사용 가능
const age = adeventure.age ?? "unknown age"; // unknown age
```
