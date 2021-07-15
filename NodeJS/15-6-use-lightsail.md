# LightSail 사용하기

### AWS 이용하기

1. aws.amazon.com/ko에 접속해서 로그인
2. 간단하게 노드 서비스를 배포할 수 있는 Lightsail 선택

### Lightsail 인스턴스 생성

1. 인스턴스 생성 버튼 클릭
2. 인스턴스 이미지 선택
   - 플랫폼 : Linux / Unix
   - 블루 프린트 선택: OS 전용 - Ubuntu 18.04 LTS (Node가 우분투가 아닌 데비안으로 설치되어 우분투로 설치)
3. 인스턴스 플랜 선택
   - 첫달 무료 $ 3.5 선택
4. 인스턴스 확인
   - Lightsail 리소스 이름 : nodebird로 설정
5. 인스턴스 생성

### Lightsail 인스턴스 설정

LightSail은 첫 한 달만 무료이므로, 실습 후 바로 삭제하는 것이 좋다.

1. connect - connect using SSH 클릭하면 터미널 생성

   ```bash
   $ sudo su // 관리자 권한으로 변경
   root@ip-172-26-0-88:/home/ubuntu#
   ```

2. 개발환경 설정

   1. 노드 설치

      - 리눅스(우분투 18 LTS 기준)

      ```bash
      $ sudo apt-get update // apt-get이라는 명령어로 최신 버전으로 설치할 수 있도록 업데이트
      $ sudo apt-get install -y build-essential // build-essential이 깔려야 bycript 네이티브 라이브러리 기반으로 돌아가는 모듈도 원활하게 돌리기 위해 설치한다.
      $ sudo apt-get install curl
      $ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash --
      $ sudo apt-get install -y nodejs // restart asking : <Yes> 선택
      ```

   2. 리눅스(우분투)에 MySQL 설치

      - GUI를 사용하지 않으므로 콘솔에 다음 명령어를 순서대로 입력한다.

      ```bash
      $ sudo apt-get update // 처음이라면
      $ sudo apt-get install -y mysql-server
      $ mysql_secure_installation // 이후 비번 설정, y - n - y - y

      $ mysql -uroot -p // mysql 잘 뜨는지 확인
      mysql > exit
      Bye
      ```

      - root 비밀번호 설정
      - 윈도와 같은 방법으로 mysql 접속
      - 우분투의 경우 워크벤치 대신 콘솔에서 작업한다.

   3. Git으로 프로젝트 clone

      ```bash
      $ git clone https://github.com/wonieeVicky/nodebird
      ...
      Unpacking objects: 100% (60/60), done.
      $ ls
      nodebird // 클론 잘 되었는지 확인
      $ cd nodebird
      ```

   ### LightSail 서버 실행

   - 기존의 아파치 서버 종료

     - 기존 사용되는게 있다면 종료해준다.

       ```bash
       $ cd /opt/bitnami
       $ sudo ./ctlscript.sh stop apache
       Unmonitored apache
       Syntax OK
       /opt/bitnami/apache2/scripts/ctl.sh : httpd stopped
       ```

     - 만약 없다면 80번 포트를 다른 누군가 사용하고 있는지 확인

       ```bash
       $ sudo lsof -i tcp:80
       ```

   - 노드 프로젝트 실행

     ```bash
     $ cd ~/nodebird
     $ vim .env // i 눌러서 INSERT 모드로 만든 후 .env 내용 복사 후 붙여넣기 처리, 저장
     $ cat .env // .env에 올린 데이터가 잘 저장되었는지 확인
     $ sudo npm i
     $ cat config/config.js // config.js에 sequlize 설정 다 잘되어있는지 확인 후 production 설치
     $ npx sequelize db:create --env production
     ..
     ERROR: Access denied for user 'root'@'localhost' // 이런 에러가 발생하면 아래와 같이 한다
     $ mysql -uroot -p
     mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '비밀번호';
     Query OK. 0 rows affected (0.00 sec)
     mysql> exit

     $ npx sequelize db:create --env production // 재시도
     ..
     Database nodebird created. // 성공!
     $ sudo npm start && sudo npx pm2 monit
     ```

     - 에러 발생 시!

       ```bash
       // ctrl+c로 pm2 monit에서 나온 후
       $ sudo npx pm2 list // error 내용 확인 후
       $ sudo npm i bcrypt@5

       $ sudo npx pm2 kill // pm2 종료 후 재시작
       $ sudo npm start && sudo npx pm2 monit // 성공!
       ```

   - LightSail 홈페이지에서 노출되고 있는 퍼블릭 IP(3.36.67.68)로 접근하면 정상적으로 nodebird 사이트가 배포되어 실행되는 것을 확인할 수 있다.
     - https 적용을 원할 경우 [블로그 글](https://www.zerocho.com/category/NodeJS/post/5ef450a5701d8a001f84baeb)을 참고하여 직접 구현해보자..!
