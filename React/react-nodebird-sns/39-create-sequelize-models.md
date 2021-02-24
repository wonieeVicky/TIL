# 시퀄라이즈 모델 만들기

시퀄라이즈에서는 테이블을 `모델`이라고 부른다. (MySQL에서는 테이블, 시퀄라이즈에서는 모델)
시퀄라이즈에서 대문자 단수로 저장하면, MySQL에서는 소문자 복수로 테이블이 생성된다.
이는 시퀄라이즈와 MySQL사이의 규칙이다.

`/back/model/user.js` 생성

```jsx
module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const User = sequelize.define(
    "User",
    {
      // id가 기본적으로 들어있다.(MySQL에서 자동으로 넣어준다.)
      email: {},
      nickname: {},
      password: {},
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // charset, collate 설정으로 한글 저장 활성화
    }
  );
  User.associate = (db) => {}; // 테이블 간의 관계를 적는다.
  return User;
};
```

1. 위와 같이 User 모델에 대한 코드를 적어주면 users라는 테이블이 만들어진다.
   (시퀄라이즈에서 대문자로 시작하는 단수형 단어를 적으면, MySQL에서 users 테이블 생성)
2. 수집할 개인정보 선언 시 MySQL에서 id값을 자동으로 넣어주기 때문에 별도로 넣을 필요는 없다.
3. 두번째 객체에 charset, collate 값을 utf8로 넣으면 한글 저장이 활성화된다.

위와 같은 방법으로 models 폴더 하위에 comment.js, hashtag.js, image.js, post.js를 생성해준다.

```jsx
// post.js, comment.js 동일 변수명만 다르게 해주면 된다.
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {},
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장!
    }
  );
  Post.associate = (db) => {};
  return Post;
};
```

1.  게시글에는 이모티콘이 포함될 수 있으므로 charset과 collate 타입을 utf8mb4로 지정해준다.

```jsx
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {}, // hashtag는 name,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Image.associate = (db) => {};
  return Image;
};
```

이렇게 독립적인 모델들을 만들다보면 팔로잉, 팔로워 등의 데이터는 어디에 둬야할지 고민이 된다.  
이런 데이터들은 보통 2개 이상의 모델이 서로 관계를 가지는 데이터이다.  
user의 팔로잉, user의 팔로워, ~의 이미지 등이 여기에 속한다.

이런 조합된 데이터는 `[모델명].associate` 함수에 들어가는데 우선 그 부분을 작업하기 전  
위와 같이 단일 모델에 속하는 독립적인 데이터부터 설계 후 관계를 추가해주는 순서로 작업한다.

이제, models의 `user.js`에서 define의 두번째 인자 의 객체값으로 받아올 데이터에 대한 설정을 해주자.
define의 두번째 인자 객체 값에는 key, value 형태의 각 컬럼들에 대한 정보가 들어간다. (테이블의 세로줄!)  
데이터 타입은 주로 **INTEGER, FLOAT, TEXT, BOOLEAN, DATETIME**를 사용한다.

```jsx
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // 하위 key, value가 각각의 컬럼들에 대한 정보이다.
      email: {
        type: DataTypes.STRING(30), // 30글자 이내의 문자
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30), // 30글자 이내의 문자
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), // 비밀번호는 암호화하므로 길이를 길게 잡는다.
        allowNull: false, // 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  User.associate = (db) => {};
  return User;
};
```

위와 같이 나머지 모델도 컬럼데이터에 대한 정보를 추가해주자

```jsx
// Comment.js 동일
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 받는다!
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  Post.associate = (db) => {};
  return Post;
};
```

Post글은 길수있기 때문에 제한 글자를 두지 않고 TEXT로 설정한다.

```jsx
module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200), // URL이 길어질 수 있으므로 200자로 잡는다.
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Image.associate = (db) => {};
  return Image;
};
```

이미지 URL은 길어질 수 있으므로 최대 200자로 잡아본다.

```jsx
module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  Hashtag.associate = (db) => {};
  return Hashtag;
};
```

위와 같이 컬럼에 대한 기본값, 필수값 등에 대한 지정이 끝나면 시퀄라이즈가 자동으로 MySQL 테이블을 만들어준다..!
