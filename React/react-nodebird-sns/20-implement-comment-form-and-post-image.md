# 댓글과 이미지 영역 구현하기

이제 댓글 영역을 구현해본다.
먼저 PostCard 컴포넌트에서 댓글영역을 List 태그를 이용해 구현하고 별도로 CommentForm을 이용해 입력받는 영역은 별도로 구현해준다.

`/Components/PostCard.js`

```jsx
const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpend] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      {/* ...codes */}
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
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

댓글이 모두 정상적으로 노출된다면 이제 댓글 입력 양식 `CommentForm`을 구현한다. 해당 영역은 페이지를 작업하다보면 폼 영역이 굉장히 많은데, 모든 폼을 하나하나 일일히 구현하기 매우 번거로우므로 ReactForm이나 ReduxForm등의 훅스 라이브러리를 활용하여 빠르게 작업하는 것도 좋은 방법이다.

`/components/CommentForm.js`

```jsx
import { Form, Input, Button } from "antd";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { addPost } from "../reducers/post";

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.me?.id);
  const [commentText, onChangeCommentText] = useInput("");
  const onSubmitComment = useCallback(() => {
    /* 입력 이벤트 구현 */
  }, [commentText]);
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button style={{ position: "absolute", right: 0, bottom: -40 }} type="primary" htmlType="submit">
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
```

다음은 게시글 내 이미지 영역을 구현해본다.
ant design 컴포넌트를 활용한 간단 코드 구현부분이므로 참고한다.

`/components/PostImages.js`

```jsx
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  if (images.length === 1) {
    return (
      <>
        {/* 1. role="presentation" 이 뭘까? */}
        <img src={images[0].src} alt={images[0].src} onClick={onZoom} role="presentation" />
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          src={images[0].src}
          style={{ width: "50%", display: "inline-block" }}
          alt={images[0].src}
          onClick={onZoom}
          role="presentation"
        />
        <img
          src={images[1].src}
          style={{ width: "50%", display: "inline-block" }}
          alt={images[1].src}
          onClick={onZoom}
          role="presentation"
        />
      </>
    );
  }
  return (
    <>
      <div>
        <img
          src={images[0].src}
          style={{ width: "50%", display: "inline-block" }}
          alt={images[0].src}
          onClick={onZoom}
          role="presentation"
        />
        <div
          role="presentation"
          onClick={onZoom}
          style={{ display: "inline-block", width: "50%", textAlign: "center", verticalAlign: "middle" }}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더보기
        </div>
      </div>
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
```

1. `role="presentation"` 이라는 메서드는 스크린리더를 이용하는 시각장애인에게 "이 것은 클릭할 수는 있지만 굳이 클릭할 필요가 없다."는 의미를 전달할 수 있다. 더 정확하게는 스크린리더에서 해당 태그가 인식되지 않도록 설정하는 요소이다. 참고할 것
