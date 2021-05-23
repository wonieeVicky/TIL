# 몽고디비 설치하기

### NoSQL

- MySQL 같은 SQL(관계형) 데이터베이스와는 다른 유형의 데이터
  - NoSQL의 대표주자인 mongoDB(몽고디비) 사용
- SQL과 NoSQL의 비교
  - SQL(MySQL)
    - 규칙에 맞는 데이터 입력
    - 테이블 간 JOIN 지원
    - 안전성, 일관성(cascade)
    - 용어(테이블, 로우, 컬럼)
  - NoSQL(몽고디비)
    - 자유로운 데이터 입력
    - 컬렉션 간 JOIN 미지원
    - 확장성, 가용성
    - 용어(컬렉션, 도큐먼트, 필드)
- JOIN: 관계가 있는 테이블끼리 데이터를 합치는 기능(몽고디비 aggregate로 흉내낼 수 있음)
- 빅데이터, 메시징, 세션 관리 등의 비정형 데이터의 경우 몽고디비를 사용하면 좋다.

### 몽고디비, 컴파스 설치하기

1. 설치파일 다운로드 받기

   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) 에서 다운로드

2. 다운로드 받은 tgz 파일 압축 해제

   ```bash
   $ cd Downloads
   $ tar xvfz mongodb-macos-x86_64-4.4.6.tgz
   ```

3. 다운로드 받은 mongodb 파일을 usr/local 디렉토리로 이동

   ```bash
   $ sudo mv mongodb-osx-x86_64-4.2.0 /usr/local/mongodb
   ```

4. /data/db 폴더 생성 및 해당DB에 대한 권한 변경

   db를 관리하고자 하는 directory로 이동 후 data/db directory 생성
   (/usr/local/mongodb에 생성함)

   ```bash
   $ cd Nodejs
   $ sudo mkdir -p data/db
   $ whoami
   vicky
   $ sudo chown vicky ./data/db
   ```

### MongoDB 환경변수 Path 설정

```bash
$ vi ~/.bash_profile
export MONGO_PATH=/usr/local/mongodb
export PATH=$PATH:$MONGO_PATH/bin
:wq
```

위와 같이 bash_profile에 mongoDB 사용을 위한 환경변수를 추가한 뒤 해당 소스를 실행시켜준다.

```bash
$ source ~/.bash_profile
```

### 몽고디비 정상 설치여부 확인

```bash
$ mongo -version
MongoDB shell version v4.4.6
Build Info: {
    "version": "4.4.6",
    "gitVersion": "72e66213c2c3eab37d9358d5e78ad7f5c1d0d0d7",
    "modules": [],
    "allocator": "system",
    "environment": {
        "distarch": "x86_64",
        "target_arch": "x86_64"
    }
}
```

### 서버/ 클라이언트 실행

먼저 아래의 명령어를 사용하여 서버 실행

```bash
$ mongod
```

다음 새로운 터미널을 열어 아래의 명령어를 실행하여 클라이언트를 실행하면 된다.

```bash
$ mongo
```

만약 mongod 실행과정에서 무결성 관련 오류가 날 경우 이는 맥OS의 게이트 키퍼 기능에 따른 문제가 발생한 것이므로 [여기](https://somjang.tistory.com/entry/Mac-OSX%EB%AC%B4%EA%B2%B0%EC%84%B1%EC%9D%84-%ED%99%95%EC%9D%B8%ED%95%A0-%EC%88%98-%EC%97%86%EA%B8%B0-%EB%95%8C%EB%AC%B8%EC%97%90mongod%EC%9D%84%EB%A5%BC-%EC%97%B4-%EC%88%98-%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4)를 참조하여 오류 개선할 것 !
