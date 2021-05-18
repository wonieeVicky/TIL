# 시퀄라이즈 쿼리 알아보기

### 윗 줄이 SQL문, 아랫 줄은 시퀄라이즈 쿼리(자바스크립트) - 공식문서 참조

`INSERT INTO nodejs.users(name, age, married, comment) VALUES ('vicky', 32, 0, 'hi');`

```jsx
const { User } = require("../models");
User.create({
  name: "vicky",
  age: 32,
  married: false,
  comment: "hi",
});
```

`SELECT * FROM nodejs.users;`

```jsx
User.findAll({});
```

`SELECT name, married FROM nodejs.users;`

```jsx
User.findAll({
  attributes: ["name", "married"],
});
```

- 조건문 - 특수한 기능들인 경우 Sequelize.Op의 연산자 사용(gt, or 등)

  - gt `>` , lt`<`, gte`>=`, lte`<=`

  `SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;`

  ```jsx
  const { Op } = require("sequelize");
  const { User } = require("../models");
  User.findAll({
    attributes: ["name", "age"],
    where: {
      married: true,
      age: { [Op.gt]: 30 },
    },
  });
  ```

  `SELECT id, name FROM users WHERE married = 0 OR age > 30;`

  ```jsx
  const { Op } = require("sequelize");
  const { User } = require("../models");
  User.findAll({
    attributes: ["id", "name"],
    where: {
      [Op.or]: [{ married: 0 }, { age: { [Op.gt]: 30 } }], // 또는은 배열로 묶어줘야 함
    },
  });
  ```

  `SELECT id, name FROM users ORDER BY age DESC;`

  ```jsx
  User.findAll({
    attributes: ["id", "name"],
    order: [
      ["age", "DESC"],
      ["createdAt", "ASC"],
    ], // 2차원 배열: age를 내림차순으로 - 생성일 오름차순으로
  });
  ```

  `SELECT id, name FROM users ORDER BY age DESC LIMIT 1;`

  ```jsx
  User findAll({
  	attributes: ['id', 'name'],
  	order: [['age', 'DESC']],
  	limit: 1
  });
  ```

  `SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;`

  ```jsx
  User.findAll({
    attributes: ["id", "name"],
    order: ["age", "DESC"],
    limit: 1,
    offset: 1,
  });
  ```

- 수정

  `UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;`

  ```jsx
  User.update(
    {
      comment: "바꿀 내용",
    },
    {
      wehre: { id: 2 }, // 꼭 적어야 한다.
    }
  );
  ```

- 삭제

  `DELETE FROM nodejs.users WHERE id = 2;`

  ```jsx
  User.destroy({
    where: { id: 2 }, // 조건을 꼭 적어야 한다.
  });

  // 여러 개일 경우
  User.destroy({
    where: { id: { [Op.in]: [1, 3, 5] } }, // 1, 3, 5에 해당하는 것 모두 destroy
  });

  // n빼고 나머지
  User.destroy({
    where: { id: { [Op.ne]: [1, 3] } }, // 1, 3을 제외한 모든 것 destroy
  });
  ```
