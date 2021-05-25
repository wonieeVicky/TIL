# mongoDB CRUD

### Create

- 몽고디비는 컬럼을 정의하지 않아도 된다.

  - 자유로움이 장점, 무엇이 들어올지 모른다는 단점
  - 자바스크립트의 자료형을 따른다. (차이점도 존재)
  - ObjectId: 몽고디비의 자료형으로 고유 아이디 역할을 한다. (\_id형태, 등록일 순으로 정렬 가능)
  - save method로 저장

    ```bash
    $ mongo admin -u 이름 -p 비밀번호

    > use nodejs;
    switched to db nodejs
    > db.users.save({ name: 'vicky', age: 32, married: false, comment: '안녕하세요! 몽고디비는 처음입니다', createdAt: new Date() });
    WriteResult({ "nInserted" : 1 })
    > db.users.save({ name: 'wonny', age: 31, married: true, comment: '안녕하세요. 워니에요 :) ', createdAt: new Date() });
    WriteResult({ "nInserted" : 1 })
    ```

    - 혹은 compass에서 ADD DATA → Insert Document로 넣어줘도 된다.

### Create(관계 설정)

- 컬렉션 간 관계를 강요하는 제한이 없으므로 직접 ObjectId를 넣어 연결
- 사용자의 ObjectId를 찾은 뒤 댓글 컬렉션에 넣기

  - 사용자의 ObjectId 찾기

    ```bash
    > db.users.find({ name: 'vicky' }, { _id: 1 })
    { "_id" : ObjectId("60accbc7f91162450d0d9eda") }
    > db.users.find({ name: 'vicky' }, { _id: 1, createdAt: 1 })
    { "_id" : ObjectId("60accbc7f91162450d0d9eda"), "createdAt" : ISODate("2021-05-25T10:04:55.832Z") }
    ```

  - 댓글 컬렉션에 해당 ObjectId 로 댓글 컬렉션 추가 - comments와 users가 연결됨

    - 단 각 테이블이 연결된 것에 대해 몽고디비가 검증해주지 않는다. 즉 오타를 조심해야 한다.

    ```bash
    > db.comments.save({ commenter: ObjectId('60accbc7f91162450d0d9eda'), comment: '댓글넣기?', createdAt: new Date() });
    WriteResult({ "nInserted" : 1 })
    ```

### Read

- find로 조회, findOne으로 하나만 조회

  ```bash
  > db.users.find({});
  { "_id" : ObjectId("60accbc7f91162450d0d9eda"), "name" : "vicky", "age" : 32, "married" : false, "comment" : "안녕하세요! 몽고디비는 처음입니다", "createdAt" : ISODate("2021-05-25T10:04:55.832Z") }
  { "_id" : ObjectId("60accbf2f91162450d0d9edb"), "name" : "wonny", "age" : 31, "married" : true, "comment" : "안녕하세요. 워니에요 :) ", "createdAt" : ISODate("2021-05-25T10:05:38.356Z") }
  { "_id" : ObjectId("60accd63ab5d971fefdf0bac"), "name" : "'judy'", "age" : 28, "married" : false, "comment" : "주디는 술을 좋아해", "createdAt" : ISODate("2021-05-25T10:13:00Z") }

  > db.comments.find({});
  { "_id" : ObjectId("60acd043f91162450d0d9edc"), "commenter" : ObjectId("60accbc7f91162450d0d9eda"), "comment" : "댓글넣기?", "createdAt" : ISODate("2021-05-25T10:24:03.577Z") }
  { "_id" : ObjectId("60acd0d1ab5d971fefdf0baf"), "commenter" : ObjectId("60accbc7f91162450d0d9eda"), "comment " : "직접 댓글 추가해보기", "createdAt " : ISODate("2021-05-25T06:00:00Z") }
  ```

### Read(조건)

- 두 번째 인수로 조회할 필드를 선택할 수 있다.

  - 1은 추가, 0은 제외
  - \_id는 기본 1이므로 0을 넣어줘야 나오지 않는다.

  ```bash
  $ mongo
  > db.users.find({}, { _id: 0, name: 1, married: 1 });

  { "name" : "vicky", "married" : false }
  { "name" : "wonny", "married" : true }
  { "name" : "'judy'", "married" : false }
  ```

- 첫 번째 인수로 조회 조건 입력 가능

  - $gt나 $or 같은 조건 연산자 사용

  ```bash
  > db.users.find({ age: { $gt: 30 }, married: true }, { _id: 0, name: 1, age: 1 });
  { "name" : "wonny", "age" : 31 }
  ```

  ```bash
  > db.users.find({ $or: [{ age: { $gt: 30 } }, { married: false }] }, { _id: 0, name: 1, age: 1 });
  { "name" : "vicky", "age" : 32 }
  { "name" : "wonny", "age" : 31 }
  { "name" : "'judy'", "age" : 28 }
  ```

- 정렬은 sort 메서드로 한다. (sequelize에서 order)

  - desc(내림차순) : -1
  - acs(오름차순) : 1

  ```bash
  > db.users.find({}, { _id: 0, name: 1, age: 2 }).sort({ age: -1 });
  { "name" : "vicky", "age" : 32 }
  { "name" : "wonny", "age" : 31 }
  { "name" : "'judy'", "age" : 28 }
  ```

- limit 메서드로 조회할 다큐먼트 갯수 제한

  ```bash
  > db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1 }).limit(1);
  { "name" : "vicky", "age" : 32 }
  ```

- skip 메서드로 건너뛸 다큐먼트 갯수 제공

  - sequelize에서 offset이 몽고디비에서 skip이다.

  ```bash
  > db.users.find({}, { _id: 0, name: 1, age: 1 }).sort({ age: -1 }).limit(1).skip(1);
  { "name" : "wonny", "age" : 31 }
  ```

### Update

- update 메서드로 쿼리

  - 첫 번째 인수로 수정 대상(조건)을, 두 번째 인수로 수정 내용을 제공
  - `$set`을 붙이지 않으면 다큐먼트 전체가 대체되므로 주의한다.

  ```bash
  > db.users.update({ name: 'vicky' }, { $set: { comment: '댓글을 바꿀 수도 있네 신기하다' } });
  WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
  > db.users.findOne({});
  {
  	"_id" : ObjectId("60accbc7f91162450d0d9eda"),
  	"name" : "vicky",
  	"age" : 32,
  	"married" : false,
  	"comment" : "댓글을 바꿀 수도 있네 신기하다",
  	"createdAt" : ISODate("2021-05-25T10:04:55.832Z")
  }
  ```

- 결과로 수정된 갯수가 나온다. (nMatched)

### Delete

- remove 메서드로 쿼리

  - 첫 번째 인수로 삭제할 대상 조건 제공

  ```bash
  > db.users.remove({ name: 'wonny' })
  WriteResult({ "nRemoved" : 1 })
  ```

  - 성공 시 삭제된 개수가 반환됨 ⇒ nRemoved
