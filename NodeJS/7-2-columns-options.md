# 컬럼 옵션들

지난 시간 테이블을 생성해본 것에 이어 각종 옵션 값에 대해 알아본다.

### 1. 컬럼 옵션들

- id INT NOT NULL AUTO_INCREMENT
  - 컬럼명 옆의 것들은 컬럼에 대한 옵션들
  - 자료형
    - INT: 정수 자료형(FLOAT(소수), DOUBLE(복잡한 소수)은 실수)
    - VARCHAR: 문자형 자료형, 가변길이(CHAR은 고정 길이)
    - TEXT: 긴 문자열은 TEXT로 별도 저장
    - DATETIME: 날짜 자료형 저장
    - TINYINT: -128에서 127까지 저장하지만 여기서는 1 또는 0만 저장해 불리언 값 표현
  - 옵션
    - NOT NULL: 빈 값은 받지 않는다는 뜻 (NULL은 빈 값 허용)
    - AUTO_INCREMENT: 숫자 자료형인 경우 다음 로우가 저장될 때 자동으로 1 증가
    - UNSIGNED: 0과 양수만 허용
    - ZEROFILLL: 숫자의 자리 수가 고정된 경우 빈 자리에 0을 넣음
    - DEFAULT now(): 날짜 컬럼의 기본값을 현재 시간으로 (DEFAULT 0, DEFAULT 1)
    - CONSTRAINT: 제약을 둔다.

### 2. Primary Key, Unique Index

- Primary KEY(id)
  - id가 테이블에서 로우를 특정할 수 있게 해주는 고유한 값임을 의미
  - 학번, 주민등록번호 같은 개념
- UNIQUE INDEX name_UNIQUE(name ASC)
  - 해당 컬러(name)이 고유해야 함을 나타내는 옵션
  - name_UNIQUE는 이 옵션의 이름(아무거나 다른 걸로 지어도 된다.)
  - ASC는 인덱스를 오름차순으로 저장함(내림차순은 DESC)

### 3. 테이블 옵션

- COMMENT: 테이블에 대한 보충 설명(필수 아님)
- DEFAULT CHARSET: utf8로 설정해야 한글이 입력됨(utf8mb4 하면 이모티콘 가능)
- ENGINE: InnoDB 사용(이외에 MyISAM이 있음. 엔진별로 기능 차이 존재)

### 4. 테이블 생성되었는지 확인

- DESC 테이블명

  ```bash
  mysql> show Database;
  mysql> use nodejs;
  mysql> DESC users;
  +------------+--------------+------+-----+-------------------+-------------------+
  | Field      | Type         | Null | Key | Default           | Extra             |
  +------------+--------------+------+-----+-------------------+-------------------+
  | id         | int          | NO   | PRI | NULL              | auto_increment    |
  | name       | varchar(20)  | NO   | UNI | NULL              |                   |
  | age        | int unsigned | NO   |     | NULL              |                   |
  | married    | tinyint      | NO   |     | NULL              |                   |
  | comment    | text         | YES  |     | NULL              |                   |
  | created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
  +------------+--------------+------+-----+-------------------+-------------------+
  6 rows in set (0.00 sec)
  ```

- 테이블 삭제하기 : DROP TABLE 테이블명

  ```bash
  mysql> DROP TABLE users;
  ```

### 5. 외래기(foreign key)

- 댓글 테이블은 사용자 테이블과 관계가 있음 (사용자가 댓글을 달기 때문)

  - 외래기를 두어 두 테이블이 관계가 있다는 것을 표시

  - FOREIGN KEY (컬럼명) REFERENCES 데이터베이스.테이블명 (컬럼)
  - FOREIGN KEY (commenter) REFERENCES nodejs.users (id)
  - 댓글 테이블에는 commenter 컬럼이 생기고 사용자 테이블의 id값이 저장됨

  - ON DELETE CASCADE, ON UPDATE CASCADE
  - 사용자 테이블의 로우가 지워지고 수정될 떄 댓글 테이블의 연관된 로우들도 같이 지워지고 수정됨
  - 데이터를 일치시키기 위해 사용하는 옵션(CASCADE 대신 SET NULL과 NO ACTION도 있다)

### 6. 테이블 목록 보기

- SHOW TABLES;

  ```bash
  mysql> SHOW TABLES;
  +------------------+
  | Tables_in_nodejs |
  +------------------+
  | comments         |
  | users            |
  +------------------+
  2 rows in set (0.00 sec)
  ```

커맨드를 사용하기 어렵다면 workBench로도 테이블 생성이 가능하다~!
