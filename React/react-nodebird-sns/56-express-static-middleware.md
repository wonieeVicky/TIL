# express.static 미들웨어

이미지는 정상적으로 업로드 되었으나 화면에 노출되지 않고있다.  
왜냐면 백엔드인 localhost:3065에 이미지가 올라갔는데, 프론트는 localhost:3026이기 때문이다!  
이를 위해 app.js에서 express.static 메서드를 사용하여 uploads 폴더에 접근할 수 있도록 설정해준다.

`back/app.js`

```jsx
const path = require("path");

app.use("/", express.static(path.join(__dirname, "uploads")));
```

app.js에서 path.join을 이용해 localhost:3065와 uploads 파일의 경로를 합쳐주는데, 기존에 `+` 를 이용해서 경로를 지정해주지 않는 이유는 운영체제에 맞게 알아서 path.join이 설정해주기 때문이다. express.static 메서드를 사용하면 프론트에서 localhost:3065/uploads에 접근할 수 있도록 해준다.

`components/PostForm.js`

```jsx
import { addPost, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from "../reducers/post";

const PostForm = () => {
  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      {/* codes... */}
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={`http://localhost:3065/${v}`} style={{ width: 200 }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
```

프론트 이미지 경로를 localhost:3065로 지정해주면 문제없이 이미지 미리보기가 구현되는 것을 확인할 수 있다. 이미지 제거를 위해 PostForm 컴포넌트의 제거 버튼에 onRemoveImage 함수를 추가했다.

> map 함수에 콜백으로 데이터를 넣고 싶을 땐, 반드시 고차함수를 이용하는 것 잊지말자!

`reducers/post.js`

```jsx
// 동기 액션이므로 하나의 액션만 만들면 된다. 프론트에서만 지워주므로.. saga 액션 만들 필요도 없음
export const REMOVE_IMAGE = "REMOVE_IMAGE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
        break;
      // another cases....
      default:
        break;
    }
  });
```

위와 같이 REMOVE_IMAGE에 대한 동기액션을 구현해준다. 해당 이미지는 실제 백엔드에서 삭제 처리는 하지 않으므로 프론트에서 filter로 데이터 정제만 해주며, 만약 실제 이미지를 삭제처리해야 할 경우 SUCCESS, FAILURE, saga이벤트 등을 추가로 만들어주어야 한다.

위와 같이 설정 후 삭제 버튼을 누르면 문제없이 이미지가 삭제되는 것을 확인할 수 있다. 이제 게시글을 등록하는 과정에서 기존에 올렸던 이미지 Path를 함께 추가해서 업로드해주도록 수정해주어야 한다.

`components/PostForm.js`

```jsx
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from "../reducers/post";

const PostForm = () => {
  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요.");
    }
    const formData = new FormData();
    imagePaths.forEach((p) => formData.append("image", p));
    formData.append("content", text);
    dispatch({ type: ADD_POST_REQUEST, data: formData });
  }, [text, imagePaths]);

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      {/* codes.. */}
    </Form>
  );
};

export default PostForm;
```

위와 같이 onSubmit 이벤트에 기존의 addPost 이벤트를 삭제하고 FormData를 이용해 dispatch 함수를 구현해보았다. 사실 이미지 업로드가 먼저 진행되었으므로 해당 데이터를 굳이 formData에 넣어주지 않고 imagePaths만 json내에 넣어 axios로 추가해주어도 문제가 없으나 multer를 통해 upload.none메서드를 사용해보고자 formData로 데이터를 주입하는 방식으로 작업해본다 :)

`sagas/post.js`

```jsx
function addPostAPI(data) {
  return axios.post("/post", data); // formData 사용으로 data를 그대로 보내준다!
}
```

formData의 경우 직접 data를 보내줘야 하므로 (json 형태로 보내면 안된다) 위와 같이 addPostAPI 이벤트를 수정해준 뒤 마지막으로 게시글을 추가하는 post.js 라우터도 조금 수정해준다.

`routes/posts.js`

```jsx
// 1. multer 설정 최상단으로 이동
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 비키

      done(null, basename + "_" + new Date().getTime() + ext); // 비키_12390123912.png
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// POST /post
// 2. formData 내 text만 존재
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    // 3. 이미지가 있을 때 추가
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // Promise.all을 사용해 이미지 경로만 DB에 한번에 저장한다.
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      // settings...
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// POST /post/images
router.post("/images", isLoggedIn, upload.array("image"), async (req, res, next) => {
  // codes..
});

module.exports = router;
```

1. multer 설정은 사용 라우터의 상단에 위치해야 하므로 위치를 더 올려준다.
2. formData에 text만 존재하므로(이미지도 경로 text로만 들어감) upload.none() 작성해준다.
3. 이미지 있을 때 해당 이미지를 Create로 넣는 과정이 필요한다. 이미지를 하나 올리느냐 여러개 올리느냐에 따라 코드가 달라지므로 분기를 나누어 처리해준다.
   - 이미지를 여러 개 올리면 image: [aa.png, bb.png]형태로 들어옴
     - Promise.all 메서드를 사용해 이미지 경로만 DB에 한번에 저장한 뒤 post.addImages 해준다.
   - 이미지를 하나만 올리면 image: aa.png로 들어옴

위와 같이 설정 후 게시글 업로드를 구현해보면 문제없이 게시글이 업로드되는 것을 확인할 수 있다! 단, 추가된 게시글 컴포넌트에 이미지가 정상 노출되지 않는데, PostForm에서 수정해준 것처럼 PostImages, ImagesZoom 컴포넌트도 추가 수정해주면 정상 노출된다.
