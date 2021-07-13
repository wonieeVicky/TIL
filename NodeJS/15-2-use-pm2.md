# pm2 사용하기

### pm2(process manager 2) 소개

- 원활한 서버 운영을 위한 패키지
  - 서버가 에러로 인해 꺼졌을 때 서버를 다시 켜준다.
  - 멀티 프로세싱 지원(노드 프로세스 수를 1개 이상으로 늘릴 수 있다.)
  - 요청을 프로세스들에 고르게 분배한다.
  - Graceful reloading 지원 : 새로운 버전 배포 시 기존 서버를 끄지않고 2개 실행 후 모두 배포가 완료되면 최종 바꿔준다.
  - 단점: 멀티 프로세스 시 프로세스간 서버의 메모리 같은 자원 공유 불가
  - 극복: memcached나 redis 같은 메모리 DB 사용(공유 메모리를 별도 DB에 저장)
    - 프로세스들 간의 로그인 정보 등에 대한 기록을 공유할 수 있도록 해준다.

### pm2 사용하기

- pm2 전역 설치 후, 명령어 사용

  ```bash
  $ npm i pm2
  ```

- `package.json` 수정 : `pm2 start 파일명`으로 실행

  ```json
  "scripts": {
      "start": "cross-env NODE_ENV=production PORT=80 pm2 start server.js",
  ```

### 프로세스 목록 확인하기

- pm2 list로 프로세스 목록 확인 가능

  - 프로세스가 백그라운드로 돌아가기 때문에 콘솔에 다른 명령어 입력 가능

    ```bash
    $ sudo npx pm2 list
    ```

- 리눅스나 맥에서 pm2 실행 시
  - 리눅스나 맥에서 pm2 실행시 1024번 이하의 포트를 사용하려면 관리자의 권한이 필요하다. 따라서 sudo를 명령어 앞에 붙여 실행한다. 앞으로 나오는 다른 명령어도 `sudo npm start`, `sudo pm2 kill`, `sudo pm2 monit`처럼 하면 된다.

### pm2로 멀티 프로세싱하기

- `pm2 start [파일명] -i [프로세스 수]` 명령어로 멀티 프로세싱이 가능하다.

  - 프로세스 수에 원하는 프로세스의 수 입력
  - `0`이면 CPU 코어 개수만큼 생성, `-1`이면 CPU 코어 개수보다 1개 적게 생성

    - -1은 하나의 프로세스를 노드 외의 작업 수행을 위해 풀어주는 것(fs, cryto에서 사용하도록 남겨둠)
    - 뭐가 더 낫다고 결정할 수 없음 load test를 통해 뭐가 더 나은지 체크해본다..!

      ```json
      "scripts": {
          "start": "cross-env NODE_ENV=production PORT=80 pm2 start server.js -i 0",
      ```

### 서버 종료 후 멀티 프로세싱 하기

- `pm2 kill` 로 프로세스 전체 종료 가능

  ```bash
  $ sudo npx pm2 kill && npm start
  ```

  - 재시작하면 프로세스가 CPU 코어 개수만큼 실행됨

### 서버 재시작하기

- `pm2 reload all`로 프로세스 전체 재시작 가능

  ```bash
  $ sudo npx pm2 reload all
  ```

### 프로세스 모니터링하기

- pm2 monit으로 프로세스 모니터링

  ```bash
  $ sudo npx pm2 monit
  ```

  - 프로세스별로 로그를 실시간으로 볼 수 있음

- `pm2 logs —err` 으로 에러 로그들만 확인 가능
