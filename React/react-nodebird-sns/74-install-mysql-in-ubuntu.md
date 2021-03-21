# 우분투에 MySQL 설치하기

ubuntu back서버에 MySQL을 설치해준다. 원래는 mysql만을 위한 별도의 서버를 구축하는 것이 바람직하지만, 토이프로젝트이기 때문에 비용적인 면을 생각하여 해당 부분은 back서버에 함께 설치한다.

```bash
$ sudo apt-get install -y mysql-server
```

위 명령어로 설치 시 ubuntu가 5버전으로 설치되므로 [이 문서](https://www.tecmint.com/install-mysql-8-in-ubuntu/)를 보고 8버전으로 설치를 해준다.

```bash
$ wget -c https://repo.mysql.com//mysql-apt-config_0.8.13-1_all.deb
$ sudo dpkg -i mysql-apt-config_0.8.13-1_all.deb

$ sudo apt update
$ sudo apt-get install mysql-server
```

이후 MySQL secure installation을 해줘야하는데 이 설정은 root계정으로만 설치 가능하므로 우선 root 계정으로 전환 후 해당 설정을 마쳐준다.

```bash
$ sudo su
# mysql_secure_installation

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y

# mysql -uroot -p // 접속하는 명령어
mysql> exit;
```

MySQL secure installation이 끝났다! 이제 back 서버를 구동시킬 차례인데, 서버 구동 명령어를 `npm start`로 실행할 수 있도록 package.json 에 설정을 추가해준다.

`back/package.json`

```json
{
  "scripts": {
    "dev": "nodemon app",
    "start": "node app" // add
  }
}
```

master 브랜치에 업로드 후 `git pull` → `npm start`를 하면 정상적으로 node app이 동작하는데, 이 과정 중에 에러가 발생한다.

```json
ConnectionError [SequelizeConnectionError]: Access denied for user 'root'@'localhost
```

이는 db에 접근할 수 있는 .env 데이터가 없다.는 의미로 ubuntu 파일 안에 .env 파일을 생성해준다. (기존 프로젝트의 .env 데이터는 .gitignore에 의해 업로드되지 않았으므로 ubuntu가 알지 못함)

```bash
$ vim .env
```

`vim .env`이라는 명령어로 ubuntu에서만 사용하는 .env 파일을 생성해줄 수 있다. 여기에 `COOKIE_SECRET`, `DB_PASSWORD` 값을 넣어준 뒤 root 계정으로 mysql 비밀번호를 한번 더 업데이트 해준다. (`cat .env` 명령어를 실행하면 저장된 데이터를 확인할 수 있다.)

```bash
$ sudo su
$ mysql -uroot -p
Enter password:

mysql > ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new-password-here';
Query OK, 0 rows affected (0.00 sec)

mysql> exit;
$ npx sequelize db:create
$ npm start
```

위 과정으로 sequelize까지 create해준 뒤 npm start를 해주면 db가 잘 생성되는 것을 확인할 수 있다!

마지막으로 포트를 변경해준다. 기존 dev에서 작업하던 포트는 3026번인데, 서버에서는 허용하는 포트번호를 80과 443만 허용했으므로 해당 번호로 바꿔줘야하는 것이다. 이를 위해 ubuntu에서만 사용하는 포트번호를 설정해줘야 하는데 기존의 포트 번호가 설정된 `back/app.js`를 수정해준다.

```bash
$ vim app.js
```

`vim` 명령어로 app.js 내 3026번으로 연결된 포트번호를 80으로 변경 후 저장해준다. 이후 인스턴스에 생성된 아이피 주소에 :80을 넣어(물론 안넣어도 상관없음) 브라우저에서 실행하면 hello express가 나오면서 db가 정상적으로 노출되는 것을 확인할 수 있다.
