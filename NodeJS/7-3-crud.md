# CRUD 작업

### 1. CRUD

- Create, Read, Update, Delete의 두 문자어
  - 데이터베이스에서 많이 하는 작업 4가지

### 2. Create

- INSERT INTO 테이블 (컬럼명들) VALUES (값들)

  ```bash
  mysql> INSERT INTO nodejs.users(name, age, married, comment) VALUES('vicky', 32, 0, 'HI!');
  Query OK, 1 row affected (0.01 sec)
  mysql> INSERT INTO nodejs.users(name, age, married, comment) VALUES('wonny', 30, 1, "HELLO!");
  Query OK, 1 row affected (0.00 sec)

  mysql> INSERT INTO nodejs.comments(commenter, comment) VALUES(1, "안녕하세요! 비키입니다:)");
  Query OK, 1 row affected (0.01 sec)
  ```

### 3. Read

- SELECT 컬럼 FROM 테이블명

  - SELECT \*는 모든 컬럼을 선택한다는 의미

    ```bash
    mysql> SELECT * FROM nodejs.users;
    +----+-------+-----+---------+---------+---------------------+
    | id | name  | age | married | comment | created_at          |
    +----+-------+-----+---------+---------+---------------------+
    |  1 | vicky |  32 |       0 | HI!     | 2021-05-13 22:28:17 |
    |  2 | wonny |  30 |       1 | HELLO!  | 2021-05-13 22:29:07 |
    +----+-------+-----+---------+---------+---------------------+
    2 rows in set (0.00 sec)

    mysql> SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
    Empty set (0.00 sec)
    ```

  - 컬럼만 따로 추리는 것도 가능

    ```bash
    mysql> SELECT name, married FROM nodejs.users;
    +-------+---------+
    | name  | married |
    +-------+---------+
    | vicky |       0 |
    | wonny |       1 |
    +-------+---------+
    2 rows in set (0.01 sec)
    ```

### 4. Read 옵션들

- WHERE로 조건을 주어 선택 가능

  - AND로 여러가지 조건을 동시에 만족하는 것을 찾음

    ```bash
    mysql> SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 29;
    +-------+-----+
    | name  | age |
    +-------+-----+
    | wonny |  30 |
    +-------+-----+
    1 row in set (0.00 sec)
    ```

  - OR로 여러가지 조건 중 하나 이상을 만족하는 것을 찾음

    ```bash
    mysql> SELECT id, name FROM nodejs.users WHERE married = 0 OR age > 29;
    +----+-------+
    | id | name  |
    +----+-------+
    |  1 | vicky |
    |  2 | wonny |
    +----+-------+
    2 rows in set (0.00 sec)
    ```

### 5. 정렬해서 찾기

- ORDER BY로 특정 컬럼 값 순서대로 정렬 가능

  - DESC는 내림차순, ASC 오름차순

    ```bash
    mysql> SELECT id, name FROM nodejs.users ORDER BY age ASC;
    +----+-------+
    | id | name  |
    +----+-------+
    |  2 | wonny |
    |  1 | vicky |
    +----+-------+
    2 rows in set (0.00 sec)
    ```

### 6. LIMIT, OFFSET

- LIMIT으로 조회할 개수 제한

  ```bash
  mysql> SELECT id, name FROM nodejs.users ORDER BY age ASC LIMIT 1;
  +----+-------+
  | id | name  |
  +----+-------+
  |  2 | wonny |
  +----+-------+
  1 row in set (0.00 sec)
  ```

- OFFSET으로 앞의 로우들 스킵 가능(OFFSET 2면 세 번째 것부터 찾음)

  ```bash
  mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 0;
  +----+-------+
  | id | name  |
  +----+-------+
  |  1 | vicky |
  +----+-------+
  1 row inset (0.00 sec)

  mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;
  +----+-------+
  | id | name  |
  +----+-------+
  |  2 | wonny |
  +----+-------+
  1 row in set (0.00 sec)

  mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 2;
  Empty set (0.00 sec)
  ```

### 7. Update

- 데이터베이스에 있는 데이터를 수정하는 작업

  - UPDATE 테이블명 SET 컬럼 = 새값 WHERE 조건

    ```bash
    mysql> UPDATE nodejs.users SET comment = '바꿀내용' WHERE id = 2;
    Query OK, 1 row affected (0.01 sec)
    Rows matched: 1  Changed: 1  Warnings: 0
    mysql> UPDATE nodejs.users SET comment = '내용이 바뀌는지 확인해요' WHERE id = 1;
    Query OK, 1 row affected (0.00 sec)
    Rows matched: 1  Changed: 1  Warnings: 0

    mysql> SELECT * FROM nodejs.users;
    +----+-------+-----+---------+-------------------------------------+---------------------+
    | id | name  | age | married | comment                             | created_at          |
    +----+-------+-----+---------+-------------------------------------+---------------------+
    |  1 | vicky |  32 |       0 | 내용이 바뀌는지 확인해요                  | 2021-05-13 22:28:17 |
    |  2 | wonny |  30 |       1 | 바꿀내용                              | 2021-05-13 22:29:07 |
    +----+-------+-----+---------+-------------------------------------+---------------------+
    2 rows in set (0.01 sec)
    ```

### 8. Delete

- 데이터베이스에 있는 데이터를 삭제하는 작업

  - DELETE FROM 테이블명 WHERE 조건

    ```bash
    mysql> DELETE FROM nodejs.users WHERE id = 2;
    Query OK, 1 row affected (0.01 sec)

    mysql> SELECT * FROM nodejs.users;
    +----+-------+-----+---------+-------------------------------------+---------------------+
    | id | name  | age | married | comment                             | created_at          |
    +----+-------+-----+---------+-------------------------------------+---------------------+
    |  1 | vicky |  32 |       0 | 내용이 바뀌는지 확인해요            | 2021-05-13 22:28:17 |
    +----+-------+-----+---------+-------------------------------------+---------------------+
    1 row in set (0.00 sec)
    ```
