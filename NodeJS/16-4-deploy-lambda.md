# 람다 배포하기

### 람다 함수 코드를 github로 전송

- 먼저 Github에 aws-upload 레퍼지토리 생성 후 LightSail 인스턴스에서 클론

  ```bash
  $ git init
  $ git add.
  $ git commit -m "Initial commit"
  $ git remote add origin http://wonieeVicky@github.com/wonieeVicky/aws-upload
  $ git push origin master
  ```

- `ssh`

  ```bash
  $ git clone https://github.com/wonieeVicky/aws-upload
  $ cd aws-upload
  $ sudo npm i
  ```

### 코드 압축해서 S3로 보내기

- 압축 후 S3로 업로드 (`ssh`)

  ```bash
  $ sudo apt-get install zip // 전역으로 zip 설치
  $ sudo zip -r aws-upload.zip ./* // 현재 파일의 모든 내용을 zip파일로 압축해준다.
  $ ls
  aws-upload.zip  index.js  node_modules  package-lock.json  package.json

  $ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  $ ls
  aws-upload.zip  awscliv2.zip  index.js  node_modules  package-lock.json  package.json

  $ sudo unzip awscliv2.zip // awscliv2.zip 압축 해제
  $ sudo ./aws/install
  You can now run: /usr/local/bin/aws --version

  $ aws configure
  AWS Access Key ID [None]: 123
  AWS Secret Access Key [None]: abcabc // .env 정보 가져오기
  Default region name [None]: ap-northeast-2 // .env 정보 가져오기
  Default output format [None]: json

  $ aws s3 cp "aws-upload.zip" s3://nodebird-vicky // s3에 aws-upload.zip 파일 업로드
  upload: ./aws-upload.zip to s3://nodebird-vicky/aws-upload.zip
  ```

위와 같이 업로드를 마치면 S3에 `aws-upload.zip` 파일이 업로드 된 것을 확인할 수 있다.
