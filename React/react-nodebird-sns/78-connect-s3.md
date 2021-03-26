# 이미지업로드 S3 연결

현재 이미지 업로드 시 해당 이미지가 백엔드 서버에 저장되어 이후 스케일링 작업 시 불필요한 데이터가 소모되고 있다. 이것을 AWS의 S3에 연결하여 해결하는데, S3는 이미지를 알아서 백업해주므로 백업에 대한 고민을 할 필요가 없다.

먼저 AWS S3에 접근하여 [버킷 만들기]를 눌러준다. 버킷 이름은 고유해야하므로 주의하고 모든 설정은 그대로 두되, **[모든 퍼블릭 엑세스 차단] 설정을 비활성화** 해준 뒤 생성한다. (모든 유저에게 열려있어야 하는 S3이므로)

생성된 버킷을 눌러 들어가서 [권한] → [버킷 정책]에 아래의 코드를 그대로 작성해준다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AddPerm",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::vicky-nodebird-s3/*"
    }
  ]
}
```

위 Resource의 네이밍이 버킷 이름과 동일해야 하는 것 주의, Allow, GetObject, PutObject가 중요함. 위와 같이 설정하면 버킷 정책이 퍼블릭으로 변경된다! 이는 곧 다른 사람들이 이 S3에 접속할 수 있음을 의미한다.

다음으로는 access-key가 필요하다.

AWS → my page → [내 보안 자격 증명] → [액세스 키(액세스 키 ID 및 비밀 액세스 키)] → [새 액세스 키 만들기]를 통해 키 파일을 다운로드 받는다. 해당 파일의 정보도 보안이 되어야 하므로 .env에 넣어주면 좋다.

### 백엔드에서 S3로 이미지 업로드 구현

먼저 back 폴더 위치에서 S3 이미지 업로드를 위한 라이브러리 2개를 설치해주겠다

```bash
$ npm i multer-s3 aws-sdk
```

`multer-s3`는 multer를 통해 s3로 파일을 업로드할 때 사용하고, `aws-sdk`는 S3 접근권한 얻을 때 사용한다.그리고 다운받은 rootkey.csv 파일에 들어있는 AWSAccessKeyId와 AWSSecretKey를 .env 파일에 넣어 저장한다.

`back/.env`

```
COOKIE_SECRET=******
DB_PASSWORD=******
S3_ACCESS_KEY_ID=******
S3_SECRET_ACCESS_KEY=******
```

`back/routes/post.js`

```jsx
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// set AWS sdk
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(), // S3 사용 권한을 얻음!
    bucket: 'vicky-nodebird-s3',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// POST /post/images
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  try {
    console.log(req.files);
    res.json(req.files.map((v) => v.location)); // location으로 수정
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

위와 같이 aws-sdk와 multer-s3를 이용해 이미지 업로드 라우트를 업데이트 해준 뒤 front 폴더 내 이미지 경로에 넣어두었던 불필요한 backUrl 데이터도 날려준다. (PostImages.js, imagesZoom/index.js)

해당 변경사항을 또 다시 git merge 시켜 각각 프론트, 백엔드 서버에 배포해준다.

프론트: git pull → npm run build → npx pm2 reload all & npx pm2 monit
백: git pull → npm i(multer-s3, aws-sdk) → npx pm2 reload all & npx pm2 monit

위와 같이 설정 후 이미지 업로드 기능을 실행시키면 404에러가 발생한다. pm2 monit 기능으로 에러를 추적하면 `CredentialsError: Missing credentials in config..`라는 에러가 발생하는데 이는 ubuntu 백엔드 서버에 .env에 업로드해준 S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY가 없어서 발생하는 오류이다. 따라서 ubuntu 서버에서 vim 명령어를 사용해 해당 데이터를 추가해준다.

위와 같이 설정 후 서버 재실행하여 기능을 실행시키면 문제없이 동작한다! 😇  
덧, 이미지 여러 가지 업로드 시 1개만 노출되는 프론트 이슈는 reducer에서 아래와 같이 수정해준다.

```jsx
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_IMAGES_SUCCESS: {
        draft.imagePaths = draft.imagePaths.concat(action.data); // concat으로 합쳐주기
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        break;
      }
      default:
        break;
    }
  });

export default reducer;
```
