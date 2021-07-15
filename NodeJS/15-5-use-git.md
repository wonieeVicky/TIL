# Git과 Github 사용하기

### Git으로 소스코드 관리하기

- 소스 코드가 수정될 때마다 직접 업로드하는 게 성가시다.
  - 협업할 때도 서로 코드가 달라서 충돌이 발생하는 경우가 발생
  - Git이라는 분산형 버전 관리 시스템을 많이 사용한다.
  - GitHub은 Git으로 부터 업로드한 소스 코드를 서버에 저장할 수 있는 원격 저장소
  - 여러 사람이 코드를 공동 관리할 수 있다.

### git 명령어 사용하기

- 콘솔에서 git —version 입력, 제대로 나오면 설치 성공

  ```bash
  $ git --version
  git version 2.30.1 (Apple Git-130)
  ```

- .gitignore에 git으로 소스 관리를 하지 않을 파일과 디렉토리 등록

  ```bash
  node_modules
  uploads
  *.log
  coverage
  .env
  ```

  - 실제 서비스에서는 .env 파일도 git에 업로드 하지 않는다. 추가하면 .env에 적어둔 비밀 키가 모두 기록되어 버리기 대문. 배포용 서버에서는 직접 .env 파일을 생성하여 비밀 키를 적어주는 것이 바람직하다.

### Github 사용하기

1. GIthub 로그인 후 레퍼지토리 생성
2. nodebird 프로젝트로 이동 후 git init 명령어 입력

   ```bash
   $ git init
   ```

3. .gitignore에 적힌 것을 제외한 모든 파일이 git 관리 대상이 된다.

   - 점(.)은 모든 파일을 의미함

   ```bash
   $ git add .
   ```

4. 사용자 정보 설정 후 소스 코드 commit(상태 저장)

   ```bash
   $ git config --global user.email "wonnieVicky@gmail.com" // 등록 안되어 있을 때
   $ git config --global user.name "vicky" // 등록 안되어 있을 때
   $ git commit -m "initial commit"

   [master (root-commit) 1ea8fa1] initial commit
    33 files changed, 20584 insertions(+)
    create mode 100644 .gitignore
    create mode 100644 app.js
   ...
   ```

5. 아이디와 비밀번호 부분 대체

   ```bash
   $ git remote add origin https://wonieeVicky@github.com/wonieeVicky/nodebird.git

   // 만약 remote 주소를 잘못 입력했을 경우?
   git remote rm origin
   git remote add [주소]
   ```

6. git push origin master 입력

   - 소스코드가 github에 올라간 것을 확인할 수 있다.

   ```bash
   git push origin master
   Enumerating objects: 43, done.
   Counting objects: 100% (43/43), done.
   Delta compression using up to 4 threads
   Compressing objects: 100% (39/39), done.
   Writing objects: 100% (43/43), 192.15 KiB | 3.84 MiB/s, done.
   Total 43 (delta 0), reused 0 (delta 0), pack-reused 0
   To https://github.com/wonieeVicky/nodebird.git
    * [new branch]      master -> master
   ```
