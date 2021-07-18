# 람다 함수 만들기

### 이미지 리사이징을 위해 람다 사용

- 이미지 리사이징은 CPU를 많이 사용하므로 기존 서버로 작업하면 무리가 간다.

  - Lambda라는 기능을 사용해 필요할 대만 서버를 실행하여 리사이징되도록 한다.

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d838328-6abb-4477-b10a-c3e95b9f4e5c/_2021-07-18__10.19.34.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d838328-6abb-4477-b10a-c3e95b9f4e5c/_2021-07-18__10.19.34.png)

  ### 람다용 package.json 작성

  - aws-upload 폴더를 만든 후 package.json 작성

    `aws-upload/package.json`

    ```json
    {
      "name": "aws-upload",
      "version": "1.0.0",
      "description": "Lambda 이미지 리사이징",
      "main": "index.js",
      "author": "Vicky",
      "license": "ISC",
      "dependencies": {
        "aws-sdk": "^2.948.0",
        "sharp": "^0.28.3"
      }
    }
    ```

    `aws-upload/.gitignore`

    ```
    node_modules
    ```

### 이미지 리사이즈 람다 함수 작성

- `aws-upload/index.js`

  ```jsx
  const AWS = require("aws-sdk");
  const sharp = require("sharp");

  const s3 = new AWS.S3();

  // context 안에는 함수 실행에 관한 정보가 포함
  exports.handler = async (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name; // nodebird-vicky
    const Key = event.Records[0].s3.object.key; // folder + filename
    const filename = Key.split("/")[Key.split("/").length - 1]; // filename
    const ext = Key.split(".")[Key.split(".").length - 1]; // 확장자(png, jpg ..)
    const requiredFormat = ext === "jpg" ? "jpeg" : ext; // sharp에서는 jpg 대신 jpeg 사용한다.
    console.log("name", filename, "ext", ext);

    try {
      const s3Object = await s3.getObject({ Bucket, Key }).promise(); // Buffer로 가져오기 - s3 설정 권한 열어준 이유(getObject)
      console.log("original", s3Object.Body.length); // 사진 용량
      const resizedImage = await sharp(s3Object.Body) // 리사이징
        .resize(400, 400, { fit: "inside" })
        .toFormat(requiredFormat)
        .toBuffer(); // 16진수 데이터(Buffer 데이터)로 반환된다.
      await s3
        .putObject({
          // thumb 폴더에 저장 - s3 설정 권한 열어준 이유(putObject)
          Bucket,
          Key: `thumb/${filename}`, // original/vicky.png 20mb -> thumb/vicky.png 4mb
          Body: resizedImage,
        })
        .promise();
      console.log("put", resizedImage.length);
      return callback(null, `thumb/${filename}`); // 에러 발생 시 첫번째 인수 사용, 성공 시 두번째 인수 실행 - http 로 람다 호출 시 callback 사용
    } catch (error) {
      console.error(error);
      return callback(error);
    }
  };
  ```
