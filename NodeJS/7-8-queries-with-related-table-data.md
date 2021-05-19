# 관계 쿼리

### 관계 쿼리

- 결과값이 자바스크립트 객체이다.

  ```jsx
  const user = await User.findOne({}); // 사용자를 가져온다. findAll: 모두 가져온다.
  console.log(user.nick); // 사용자 닉네임
  ```

- include로 JOIN과 비슷한 기능 수행 가능(관계있는 것을 엮을 수 있다.)
  동시에 가져오기 위해서는 데이터베이스가 조금 더 많이 일함

      ```jsx
      // 사용자가 작성한 comments를 가져오고 싶을 때에는 Comment 테이블을 include
      const user = await User.findOne({
      	include: [{
      		model: Comment, // 혹은 get+모델명으로 처리 가능
      	}]
      });
      console.log(user.Comments); // 사용자 댓글
      ```

- 다대다 모델은 다음과 같이 접근이 가능하다.

  ```jsx
  db.sequelize.models.PostHashtag;
  ```

- `get+모델명`으로 관계 있는 데이터 로딩 가능

  ```jsx
  const user = await User.findOne({});
  const comments = await user.getComments(); // include 방식이 아닌 다른 방식
  console.log(comments); // 사용자 댓글
  ```

- as로 모델명 변경 가능

  ```jsx
  // 관계를 설정할 때 as로 등록
  db.User.hasMany(db.Comment, {
    foreignKey: 'commenter',
    sourceKey: 'id',
    as: 'Answers',
  });
  // 쿼리할 때는 아래와 같이 한다.
  const user = await User.findOne({});
  const comments = await user.getAnswers(); // getComments가 싫으면 이름을 as로 지정
  console.log(comments); // 사용자 댓글
  ```

- include나 관계 쿼리 메서드에도 where나 attributes

  ```jsx
  // 특정 대상의 코멘트 id 1번을 가져와라
  const user = await User.findOne({
    include: [
      {
        model: Comment,
        where: {
          id: 1,
        },
        attributes: ['id'], // 여러 값 중에 아이디만 가져온다.
      },
    ],
  });
  // 또는
  const comments = await user.getComments({
    where: {
      id: 1,
    },
    attributes: ['id'],
  });
  ```

- 생성 쿼리

  ```jsx
  const user = await User.findOne({});
  const comment = await Comment.create(); // comment를 먼저 생성 후
  await user.addComment(comment); // user에 comment 저장
  // 또는
  await user.addComment(comment.id);
  ```

- 여러 개를 추가할 때는 배열로 추가 가능

  ```jsx
  const user = await User.findOne({});
  const comment1 = await Comment.create();
  const comment2 = await Comment.create();
  await user.addComment([comment1, comment2]); // 배열로 저장 가능
  ```

- 수정은 `set+모델명`, 삭제는 `remove+모델명`

### raw 쿼리

- 직접 SQL을 쓸 수 있다.

  ```jsx
  const [result, metadata] = await sequelize.query('SELECT * from comments');
  console.log(result);
  ```
