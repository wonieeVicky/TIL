# 게시글 해시태그 링크로 만들기

게시글 하단의 해시태그를 링크로 변경하는 기능을 만들고자 한다. 이후에 같은 해시태그가 있는 글만 필터링하여 노출할 수 있도록 구현할 것이다. 우선 이렇게 특수한 기능을 해야하는 경우 기존의 컴포넌트에 기능을 추가하는 대신 별도의 컴포넌트를 구성하여 작업하는 것이 좋다.

`/components/PostCard.js`

아래와 같이 기존의 post.content를 노출하던 데이터를 `PostCardContent` 컴포넌트를 생성하여 구현한다.

```jsx
import PostCardContent from "./components";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpend] = useState(false);
  const id = useSelector((state) => state.user.me?.id); // me?.id는 optional chaining 연산자

  const onToggleLike = useCallback(() => setLiked((prev) => !prev), []);
  const onToggleComment = useCallback(() => setCommentFormOpend((prev) => !prev), []);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card.Meta
        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
        title={post.User.nickname}
        description={<PostCardContent postData={post.content} />}
      />
    </div>
  );
};

export default PostCard;
```

`PostCardContent`를 구현하기 위해서는 먼저 정규식을 알아야 한다.
`#`문자를 기준으로 링크를 생성해야하기 때문이다!

```
//g : 뒤에 g가 붙으면 여러 개를 찾는다는 뜻
/#/g : 문장 내 #을 모두 찾음
/#/ : 문장 내 첫 #을 찾음

/#./g : 문자 # 뒤에 첫 글자
/#../g : 문자 # 뒤에 첫 두 글자
/#.../g : 문자 # 뒤에 첫 세 글자
/#.+/g : 문자 # 뒤에 모든 글자
/#[해익제]+/g : 괄호 안 [해,익,제] 문자만 선택함
/#[^해익제]+/g : 괄호 안 [해,익,제] 문자만 제외함
/#[^\s]+/g : 괄호 안 공백 문자만 제외함
/#[^\s#]+/g : 괄호 안 공백과 #문자만 제외함(해시태그 분리)
```

위와 같이 해시태그만 가져오는 정규표현식을 만들어보았다.
이것을 실제 함수에 넣어 실행시키는데 실행할 때에는 반드시 정규표현식을 ()로 감싸주어야 하니 참고하자.

`/components/PostCardContent.js`

```jsx
import PropTypes from "prop-types";
import Link from "next/link";

const PostCardContent = ({ postData }) => {
  return (
    <>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
						{/* 아래와 같이 게시글데이터가 크게 변할 일이 없을 때에는 key에 Index를 사용해도 괜찮다 */}
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
```
