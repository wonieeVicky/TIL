# 이미지 업로드를 위한 multer

이번에는 게시글을 업로드할 때 이미지 업로드에 대한 기능을 구현해본다.

현재 이미지업로드 컴포넌트인 PostForm을 보면 이미지 업로드 시 `encType="multipart/fom-data"` 를 사용한다. 그런데 현재 프론트에서 백엔드로 데이터를 보낼 때 백엔드에서 미들웨어 설정을 통해 허용한 형식으로는 `express.json()`, axios를 통한 json 형태의 데이터와 `express.urlencoded({ extended: true })`, 일반 form 데이터를 허용한다.

보통 파일, 이미지, 비디오 등의 파일을 multipart 타입인데, 해당 타입을 허용하기 위해서는 back 폴더 내에 multer라는 라이브러리를 설치해서 사용해야 한다.

```bash
$ cd prepare back
$ npm i multer
```

multer 미들웨어는 최상위인 app에 장착할 수도 있지만 보통 라우터에 장착하여 사용하는 경우가 많다. 라우터마다 이미지를 여러개 올리거나, 하나를 올리거나, 순수 텍스트 형태의 multipart를 올리므로 데이터 타입이 달라지기 때문에 app에 설정 시 모든 라우터에 적용되므로 직접 라우터에서 적용하여 사용하는 것이다.

`routes/post.js`

```jsx
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 7. uploads 폴더 생성
try {
  fs.accessSync("uploads"); // uploads 폴더가 있는지 확인
} catch (err) {
  // 없으면 에러 발생
  console.log("uploads 폴더가 없으므로 생성한다.");
  fs.mkdirSync("uploads"); // uploads 폴더 생성
}

// 이미지 업로드를 위한 설정
const upload = multer({
  // 1. 하드디스크에 이미지 업로드
  storage: multer.diskStorage({
    // 2. 저장 위치 설정
    destination(req, file, done) {
      done(null, "uploads");
    },
    // 3. 파일명 설정
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // .png
      const basename = path.basename(file.originalname, ext); // 비키

      done(null, basename + "_" + new Date().getTime() + ext); // 비키_12390123912.png
    },
  }),
  // 4. 파일 저장 용량 제한
  limits: {
    fileSize: 20 * 1024 * 1024,
  }, // 20MB
});
// POST /post/images
// 5. multer 이미지 업로드 함수 적용
router.post("/images", isLoggedIn, upload.array("image"), async (req, res, next) => {
  // 6. 이미지 업로드 후 내부 코드 실행
  try {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

먼저 이미지 업로드 설정은 라우터 바깥에서 해준다.

1. 우선 하드디스크에 이미지 업로드를 해주기 위해 `multer.diskStorage` 메서드를 사용한다.
   - 이후에는 S3 클라우드에 저장한다. 왜 이미지를 S3 클라우드에 저장할까?
2. destination 안에는 이미지가 저장될 위치를 설정해준다. (uploads라는 폴더에 저장한다.)
3. 기본적으로 노드는 파일명이 중복될 경우 기존 파일을 오버라이드 한다.  
   따라서 파일 내에 업로드 일시에 대한 정보(ms까지)를 함께 붙여 파일명이 중복되지 않도록 처리한다.
   만약 업로드 파일명이 `비키.png`라면 ext 변수에 확장자(.png)가 담기고, basename 변수에 파일명(비키)가 담긴다) done의 두번째 인자에 파일명을 커스텀하여 넣어주면 중복되지 않은 값으로 저장된다.
4. limits 안에는 파일 저장 용량을 제한해준다. 비디오 파일일 경우 100MB정도로 높여줘야 하지만 이미지 업로드 또한 보안에 취약한 점이므로 최대한 클라우드에 직접 업로드하는 방식으로 사용해주면 좋다.
5. 라우터 내에 상단에 설정한 이미지 업로드 함수인 upload를 적용해준다. 이번 기능에서는 이미지를 하나의 input에서 여러 장 업로드할 수 있도록 구현하므로 upload.array('image')라는 메서드로 구현한다
   - 하나의 Input, 여러 장 업로드 시: `upload.array('image')` 로 구현
     - PostForm의 input[name = "image"]로 들어온 데이터가 array로 들어온다
   - 하나의 Input, 한 장만 업로드 시: `upload.single('image')` 로 구현
   - 텍스트만 업로드 시: `upload.none()` 로 구현
   - 두 개 이상의 Input, 여러 장 업로드 시: `upload.fill()` 로 구현
6. 상단 `upload.array('image')`를 통해 먼저 이미지는 업로드가 된 후 내부 코드가 실행된다.
7. 이미지 저장 위치를 uploads로 지정했으므로 저장할 폴더에 대한 체크 후 없으면 해당 폴더가 생성되도록 해주는 node 코드를 추가해준다.
   - fs는 node의 내장 함수로 파일에 접근할 수 있는 메서드이다.

위와 같이 이미지 업로드를 구현했는데, 이미지 업로드를 구현하는 방법은 다양한 방식이 있다.

1. 이미지를 한번에 백엔드로 전송하여 업로드
   - 이미지가 이진법으로 변환되어 들어오는데 이미지 미리보기 등을 구현할 때 애매한 감이 있다.
     `{ content: 'hello', image: 010101011000111 }`
   - 이미지 업로드 후에 추가적인 작업(보정, 리사이징 등)이 가능한데, 업로드 할 때 용량으로 인해 시간이 오래 걸리므로 잘 사용하지 않는다.
2. 두번에 나누어 백엔드로 전송하여 업로드
   - 먼저 이미지만 백엔드로 전송한다. `{ image: 01010100011 }`
   - 백엔드에서 이미지 업로드 후 이미지명을 반환 `[비키1.png, 비키2.png]`
   - 해당 정보를 올린 후에 content를 사용자가 작성하거나 미리보기, 리사이징 등이 처리되도록 함
     - 만약 이미지를 올린 후 사용자가 글을 게시하지 않을 때는 어떻게 할까?

우리는 2번 방식으로 이미지 업로드를 구현해보겠다. 우선 PostForm 컴포넌트에 이미지 업로드 action을 마무리해주자.

`components/PostForm.js`

```jsx
import { addPost, UPLOAD_IMAGES_REQUEST } from "../reducers/post";

const PostForm = () => {
  const onChangeImages = useCallback(
    (e) => {
      const imageFormData = new FormData(); // 1. new FormData사용
      // 2. [].forEach.call 메서드 사용 이유
      [].forEach.call(e.target.files, (f) => imageFormData.append("image", f));
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    },
    [imageInput.current]
  );

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="오늘은 어떤 맛있는 것을 드셨나요?"
      />
      {/* codes.. */}
    </Form>
  );
};

export default PostForm;
```

1. new FormData를 사용해야 multipart 형식으로 보낼 수 있다.
2. e.target.files는 유사배열이므로 [].forEach.call 메서드를 사용한다.  
   imageupload 라우터 내 upload.array('image')가 같아야 하니 주의할 것!

이제 이미지 업로드 액션인 `UPLOAD_IMAGES_REQUEST`를 만들어주자.

`reducers/posts.js`

```jsx
export const initialState = {
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
};

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS: {
        draft.imagePaths = action.data;
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        break;
      }
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/posts.js`

```jsx
import {
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
} from "../reducers/post";

function uploadImagesAPI(data) {
  return axios.post(`/post/images`, data); // formData는 그대로 넣어줘야한다. json에 넣으면 JSON 타입이 됨
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

export default function* postSaga() {
  yield all([fork(watchUploadImages)]);
}
```

위와 같이 설정 후 이미지를 여러 개 업로드 해보면 정상적으로 업로드가 실행되어 back 내 uploads 폴더에 이미지가 업로드되는 것을 확인할 수 있다!
