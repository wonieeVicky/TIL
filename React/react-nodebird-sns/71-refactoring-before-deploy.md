# 배포 전 리팩토링

### 1. models 코드 클래스형으로 최신화하기

배포 전 코드 중 최신화 해줘야 할 부분이 있다. 바로 서버 쪽의 모델 설정 부분이다. class형으로 model 상세 구현부분을 고쳐서 소스를 최신화 해주는데, 이 방법을 권장하는 이유는 나중에 타입스크립트 도입시에도 이후에 타입추론이 잘되기 때문에 해당 방법으로 변경해준다.

포맷은 아래와 같다.

```jsx
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class ModelName extends Model {
  static init(sequelize) {
    return super.init(
      {
        // define한 내용 옮겨준다.
      },
      {
        modelName: 'ModelName',
        tableName: 'modelnames', // 소문자 복수로 변경되므로
        charset: 'utf8mb4', // charset define
        collate: 'utf8mb4_general_ci', // collate define
        sequelize,
      }
    );
  }

  static associate(db) {
    // ModelName assiociate 내에 있던 부분을 모두 옮겨준다.
  }
};
```

예를 들어 back/models/user.js의 경우 아래와 같이 소스를 class 형으로 변경해준다.

```jsx
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'FollowingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    });
  }
};
```

나머지 코드도 위와 같은 포맷에 맞춰 모두 변경해준 뒤 models의 index.js에 class형 문법으로 변경된 부분을 업데이트 해준다.

`models/index.js`

```jsx
const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

// db에 각 sequelize를 init해주는 것을 추가한다!
Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

수정 이후 back 서버를 재 구동하여 정상 동작을 재 확인하자!

### 2. immer IE에서 미지원 이슈

immer가 IE에서 미지원되어 발생하는 이슈를 개선해보도록 하자. 기존에 immer를 사용하는 react 프로젝트의 경우 reactDOM.render 시 최상위에 immer에서 제공하는 enableES5 를 선언하면 되었지만, next 프로젝트에서는 별도로 reactDOM.render를 넣어주는 포인트가 없으므로 해당 영역이 실행될 수 있도록 파일을 만들어추가하는 방법을 immer에서 제안하고 있다.

우선 front 폴더에 util이라는 폴더를 생성하여 enableES5를 produce상단에서 실행시켜준다.

`front/util/produce.js`

```jsx
import produce, { enableES5 } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};
```

그리고 immer를 사용하는 각 리듀서 파일(user.js, post.js)의 produce 임포트 부분의 경로를 기존 immer에서 '../util/produce'로 수정해준다.

```jsx
// post.js reducer
import produce from '../util/produce';

// codes..
```

### 3. 실제 css도 SSR이 되는지 궁금할 때

크롬 콘솔창의 Preferences → Debugger → Disable JavaScript를 활성화해주면 스크립트가 들어오지 않으므로 서버에서 받아온 html만 그대로 노출된다. 이렇게 화면을 새로고침했을 때 레이아웃이 그대로 잘 들어오므로 이를 통해 html에 css가 적용되어 들어오고 있음을 확인할 수 있다.

### 4. swr Hook을 pre-render page(getStaticProps) 에서도 적용하는 방법

```jsx
export async function getStaticProps() {
  // `getStaticProps` is invoked on the server-side,
  // so this `fetcher` function will be executed on the server-side.
  const posts = await fetcher('/api/posts');
  return { props: { posts } };
}

function Posts(props) {
  // Here the `fetcher` function will be executed on the client-side.
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts });

  // ...
}
```

위 내용은 [swr 공식문서](https://swr.vercel.app/docs/with-nextjs)에서 참조했다. 보통 getStaticProps에서 데이터를 fetcher로 호출한 뒤 해당 데이터를 props로 반환해주어 해당 데이터를 컴포넌트의 Props로 상속받아서 사용하면 initialData라는 옵션에 넣어서 사용할 수 있다!
