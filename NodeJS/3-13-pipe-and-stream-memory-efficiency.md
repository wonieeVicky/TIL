# 13. pipe와 스트림 메모리 효율 확인

## 13-1. pipe

이전시간에서 알아본 것처럼 스트림은 데이터를 처리할 때 1MB로 나누어 처리한다. 이렇게 1MB 버퍼들이 흘러가는 것을 파이프 형태로 연결해놓을 수 있는데 이것을 Stream pipe, 혹은 piping 한다고 한다.

```jsx
const fs = require("fs");

const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 });
const writeStream = fs.createWriteStream("./writeme.txt");

readStream.pipe(writeStream);
```

위 코드는 `readStream`와 `writeStream`을 파이프로 연결해 둔 코드인데, `readStream`의 readme.txt를 16비트씩 읽어서 `writeStream`의 writeme.txt에 쓴다. 라는 의미이다.

이것말고도 zlib이라는 메서드를 활용하여 압축파일로 복사도 가능하다.

```jsx
const fs = require("fs");
const zlib = require("zlib");

const readStream = fs.createReadStream("./readme.txt", { highWaterMark: 16 });
const zlibStream = zlib.createGzip(); // 압축함
const writeStream = fs.createWriteStream("./writeme2.txt.gz");

readStream.pipe(zlibStream).pipe(writeStream);
```

위와 같이 파이프로 스트림을 연결시켜 사용할 수 있으며 실제 압축 파일로 결과물이 도출된다. stream을 지원하는데에만 pipe를 사용할 수 있으니 주의할 것..!

## 13-2. 스트림 메모리 효율 확인

이번에는 스트림 메모리 효율이 일반 버퍼보다 얼마나 효율적인지 실제 파일을 복사하는 것을 해보며 확인해보려 한다. 먼저 테스트를 위해 1GB짜리 txt 파일을 만들어준다.

```jsx
const fs = require("fs");
const file = fs.createWriteStream("./big.txt");

for (let i = 0; i <= 10_000_000; i++) {
  file.write("안녕하세요. 엄청나게 큰 파일을 만들어볼거에여 두구두구두구\n");
}

file.end();
```

이후 버퍼 형식으로 big.txt 파일을 복사하는 코드를 작성한다.

```jsx
const fs = require("fs");

console.log("before:", process.memoryUsage().rss);

const data1 = fs.readFileSync("./big.txt");
fs.writeFileSync("./big2.txt", data1);

console.log("buffer:", process.memoryUsage().rss);
```

위 코드로 기존의 big.txt를 big2.txt로 버퍼 방식으로 복사해보면 아래와 같이 기록되는데 사용한 메모리 양을 확인해보면 약 `800MB` 만큼의 메모리를 사용했다. 만약 해당 기능을 여러 유저가 사용할 경우 서버가 메모리 부하를 이기지 못하고 터질 가능성이 매우 높다.

```bash
$ node buffer-memory
before: 18841600
buffer: 869883904
```

이번에는 스트림 형식으로 big.txt 파일을 복사하는 코드를 작성한다.

```jsx
const fs = require("fs");

console.log("before:", process.memoryUsage().rss);

const readStream = fs.createReadStream("./big.txt");
const writeStream = fs.createWriteStream("./big3.txt");
readStream.pipe(writeStream);

readStream.on("end", () => {
  console.log("er:", process.memoryUsage().rss);
});
```

위 코드로 기존의 big.txt를 big3.txt로 스트림 방식으로 복사해보면 아래와 같이 기록된다. 사용한 메모리의 양을 확인해보면 약 `11MB`만을 메모리로 사용했다. 게다가 사용한 11MB도 해당 파일을 복사하는데 소요된 메모리라기 보다는 해당 스트림 객체를 생성하는데 소요되었을 가능성이 높다. 실제로는 복사하는 용량이 훨씬 더 적게 소모되는 것이다.

```bash
$ node test3
before: 18825216
er: 30396416
```

이로써 스트림 방식의 메모리 효율에 대한 확인을 마친다. 앞으로 파일 전송 등을 하는 과정에 있어서 스트림 방식을 이용해 효율적으로 처리하는 것이 바람직하다.

## 13-3. fs.access, mkdir, open, rename

fs에는 기타 메서드가 몇가지 더 있다. 아래 코드를 참고하자 :)

- `fs.access(경로, 옵션, 콜백)`
  - 폴더나 파일에 접근할 수 있는지를 체크, 두 번째 인자로 상수들을 넣는다. F_OK는 파일 존재 여부, R_OK는 읽기 권한 여부, W_OK는 쓰기 권한 여부를 체크한다. 파일/폴더나 권한이 없다면 에러가 발생하는데, 파일/폴더가 없을 때의 에러 코드는 ENOENT이다
- `fs.mkdir(경로, 콜백)`
  - 폴더를 만드는 메서드, 이미 폴더가 있다면 에러가 발생하므로 먼저 accesss() 메서드를 호출하여 확인하는 것이 중요하다.
- `fs.open(경로, 옵션, 콜백)`
  - 파일의 아이디(fd 변수)를 가져오는 메서드. 파일이 없다면 파일을 생성한 뒤 그 아이디를 가져온다. 가져온 아이디를 사용해 fs.read()나 fs.write()로 읽거나 쓸 수 있다. 두 번째 인자로 어떤 동작을 할 것인지 설정할 수 있다. 쓰려면 w, 읽으려면 r, 기존 파일에 추가하려면 a이다. 예제에서는 w로 설정했으므로 파일이 없을 떄 새로 만들 수 있었다. r이었다면 에러가 발생했을 것이다.
- `fs.rename(기존 경로, 새 경로, 콜백)`
  - 파일의 이름을 바꾸는 메서드이다. 기존 파일 위치와 새로운 파일 위치를 적어주면 된다. 반드시 같은 폴더를 지정할 필요는 없으며 잘라내기 같은 기능을 할 수도 있다.

```jsx
const fs = require("fs").promises;
const constants = require("fs").constants;

fs.access("./folder", constants.F_OK | constants.W_OK | constants.R_OK)
  .then(() => {
    return Promise.reject("이미 폴더 있다");
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      console.log("폴더 없음");
      return fs.mkdir("./folder");
    }
    return Promise.reject(err);
  })
  .then(() => {
    console.log("폴더 만들기 성공");
    return fs.open("./folder/file.js", "w"); // 파일 만들기
  })
  .then((fd) => {
    console.log("빈 파일 만들기 성공");
    fs.rename("./folder/file.js", "./folder/newfile.js");
  })
  .then(() => {
    console.log("이름 바꾸기 성공");
  })
  .catch((err) => {
    console.error(err);
  });
```

```bash
$ node test
폴더 없음
폴더 만들기 성공
빈 파일 만들기 성공
이름 바꾸기 성공
```

## 13-4. 폴더 내용 확인 및 삭제

- `fs.readdir(경로, 콜백)`
  - 폴더 안의 내용물을 확인할 수 있다. 배열 안에 내부 파일과 폴더명이 나온다.
- `fs.unlink(경로, 콜백)`
  - 파일을 지울 수 있다. 파일이 없다면 에러가 발생하므로 먼저 파일이 있는지를 꼭 확인해야 한다.
- `fs.rmdir(경로, 콜백)`
  - 폴더를 지울 수 있다. 폴더 안에 파일이 있다면 에러 발생하므로 내부 파일을 모두 지우고 호출해야 한다.

```jsx
const fs = require("fs").promises;
fs.readdir("./folder")
  .then((dir) => {
    console.log("폴더 내용 확인", dir);
    return fs.unlink("./folder/newfile.js");
  })
  .then(() => {
    console.log("파일 삭제 성공");
    return fs.rmdir("./folder");
  })
  .then(() => {
    console.log("폴더 삭제 성공");
  })
  .catch((err) => {
    console.error(err);
  });
```

```bash
$ node test
폴더 내용 확인 [ 'newfile.js' ]
파일 삭제 성공
폴더 삭제 성공
```

## 13-5. 기타 fs 메서드

### 가. 파일을 복사하는 방법

- 복사할 파일이 없으면 에러발생
- 이 방법으로 위의 스트림 파이핑을 대신하면 되지 않나?
  - 이건 단순히 파일을 복사하는 작업만 수행, 다양한 커스텀 기능을 수행하려면 stream.pipe를 쓸 것

```jsx
const fs = require("fs").promises;

fs.copyFile("readme.txt", "writeme.txt")
  .then(() => {
    console.log("copy complete");
  })
  .catch((err) => {
    console.error(err);
  });
```

```bash
$ node test
copy complete!
```

### 나. 파일을 감시하는 방법(변경사항 발생 시 이벤트 호출)

```jsx
const fs = require("fs");

fs.watch("./readme.txt", (eventType, filename) => {
  console.log(eventType, filename);
});
```

```bash
$ node test
change readme.txt // 내용물 수정 후
change readme.txt
rename readme22.txt // 파일명 변경 또는 삭제 후
change readme22.txt
```

- `fs.existsSync`
  - 파일이 존재하는지 확인
- `fs.stat`
  - 파일이 폴더인지, 일반 파일인지, 바로가기 인지 확인
- fs.appendFIle
  - 일반 파일에 데이터를 추가해서 넣는 것

### 다. 이외에 fs의 경우 메서드가 많으니 공식문서를 참조하여 작업하자!
