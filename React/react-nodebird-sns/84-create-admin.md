# forest-admin을 활용한 어드민 페이지 구현

비교적 사용하기 괜찮은 노드 어드민 중 forest-express-sequelize를 한번 적용해보자.
express + sequelize의 연동성이 괜찮다고 한다.

먼저 forestadmin.com으로 가서 회원가입을 마친 뒤 Create a project를 해준다.

```
project Name : vicky-nodebird
Datasource type : MySQL
Host : localhost 3306
User : root (***)
Database name : vicky-nodebird
```

installation method는 `install with NPM`으로 설정한 뒤 뒤이어 나오는 명령어들을 prepare 하위에 admin이라는 폴더를 생성하여 실행해준다.

```bash
npm install -g lumber-cli@latest -s

lumber generate "vicky-nodebird" --connection-url "***"
zsh: command not found: lumber
```

이렇게 lumber-cli라는 라이브러리를 깔고 `lumber generate "vicky-nodebird"` 를 실행시키면 Lumber가 없다는 에러가 발생한다. 이건 뭘까? 바로 NPM을 글로벌로 install 했을 때 권한 등에서 발생하는 에러이다.

아래와 같이 해결했다

```bash
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
vi ~/.profile
```

위와 같이 .profile이라는 파일을 vi 편집기로 생성하여 들어간 뒤 알파벳 i(insert)를 넣고 아래 내용을 넣는다.

```
export PATH=~/.npm-global/bin:$PATH
```

:wq(저장 후 나감)한 뒤 다시 lumber-cli를 설치한 뒤 lumber generate를 시켜주면 forest-admin이 내가 만든 MySQL sequelize 모델들을 읽어서 그대로 어드민을 만들어준다.

설치가 완료되면 vicky-nodebird 폴더로 이동 후 package.json을 인스톨 해준 뒤 npm start를 해준다.

```jsx
$ cd vicky-nodebird
$ npm i
$ npm start

Your application is listening on port 3310.
OPTIONS /forest 204 0 - 1.794 ms
GET /forest 404 145 - 7.895 ms
Your admin panel is available here: https://app.forestadmin.com/projects
```

npm start를 실행시키면 3310번 포트가 구동되지만 실재 Localhost:3310으로 들어가면 별도의 어드민페이지가 아닌 Your application is running!이라는 메시지만 나옴. 실제 사이트는 `https://app.forestadmin.com/projects`에 가야한다.

해당 페이지에 접근하면 내가 생성한 MySQL 테이블에 맞춰 데이터가 뿌려진다. 검색이나 filtering, sorting 등의 기능이 모두 제공되며, action에 대한 커스텀 기능도 가능하기 때문에 있는 틀을 활용하여 기능만 빠르게 구현할 수 있다.

또 데이터를 활용한 대시보드도 쉽게 구현할 수 있기 때문에 빠르게 활용이 가능하다. Collaboration, Activity의 경우 유료 버전이지만 배포만하지않으면 개발자가 localhost로 해당 dev를 띄워놓으면 여러 사람들이 위 url에 들어와 작업이 가능하므로 어느정도는 무료로 기능을 사용할 수 있다.

기존의 react-admin, core-ui, adminlte같은 어드민 탬플릿이 존재하지만 해당 어드민 내부의 레이아웃을 컴포넌트로 제공할 뿐 테이블 분석을 해주진 않았다. 다시 말해 실제 테이블은 직접 개발자가 맞춰넣어 구현해주어야 하는 불편함이 있었으나 forest-admin을 사용하면 해당 DB에 맞춰 sequelize가 모델 구조를 자동으로 분석해 테이블을 만들어주므로 매우 유용한 편이다.
