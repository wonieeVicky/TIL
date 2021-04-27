# multer

### 멀티파트 데이터 형식

form 태그의 enctype이 multipart/form-data인 경우

- body-parser로는 요청 본문을 해석할 수 없음
- multer 패키지를 사용한다

  ```bash
  $ npm i multer
  ```

## multer 설정하기

multer 함수를 호출

```jsx
// multer 호출
const multer = require("multer");
const fs = require("fs");

// multer 시 uploads 폴더 생성
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

// multer 설정 - diskStorage에 저장
// 어디에 어떻게 어떤 이름으로 저장할 것인지에 대한 설정을 upload객체를 생성 해준다.
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

- storage는 저장할 공간에 대한 정보
- diskStorage는 하드디스크에 업로드 파일을 저장하는 것
- destination은 저장할 경로
- filename은 저장할 파일명(파일명+날짜+확장자 형식)
- Limits는 파일 개수나 파일 사이즈를 제한할 수 있음
- 실제 서버 운영 시에는 서버 디스크 대신에 S3같은 스토리지 서비스에 저장하는 게 좋음
  - Storage 설정만 바꿔주면 된다.

### multer 미들웨어들

single과 none, array, fields 미들웨어 존재

- single은 하나의 파일을 업로드할 때, none 파일은 업로드 하지 않을 때
- req.file 안에 업로드 정보 저장

```jsx
// upload 객체 장착 - 주로 특정 라우터에 지정하는 방식으로 사용한다.
// upload.single() : 한 개의 파일만 업로드 할 때 사용한다.
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok");
});
// 보내는 데이터는 없지만, 전송방식은 multipart/form-data일 경우
app.post("upload", upload.none(), (req, res) => {
  console.log(req.body);
  res.send("ok");
});
```

- array와 field는 여러 개의 파일을 업로드 할 때 사용
- array는 하나의 요청 body 이름 아래 여러 파일이 있는 경우
- fields는 여러 개의 요청 body 이름 아래 파일이 하나씩 있는 경우
- 두 경우 모두 업로도된 이미지 정보가 req.files 아래에 존재

```jsx
// <input type="file" name="image1" multiple />
app.post("/upload", upload.array("many"), (req, res) => {
  console.log(req.files, req.body);
  res.send("ok");
});

// <input type="file" name="image1" />
// <input type="file" name="image2" />
app.post("/upload", upload.fields([{ name: "image1", limits: 5 }, { name: "image2" }]), (req, res) => {
  console.log(req.files.image1);
  console.log(req.files.image2);
  console.log(req.files, req.body);
  res.send("ok");
});
```
