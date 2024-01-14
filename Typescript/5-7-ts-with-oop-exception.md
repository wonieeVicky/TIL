## 에러 처리

### 에러처리

프로그래밍에서 에러처리는 중요하다! exception handling은 잘 관리한다면 우리에게 큰 도움이 된다.
어플리케이션을 운영하다보면 다양한 exception이 발생함, 이를 잘 관리하면 안정성과 유지보수성이 높아짐

- 어플리케이션 내부에서 예상이 가능한 에러 = Error
- 예상치 못한 이슈를 뜻하며 = Exception

### Error에 대하여

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    default:
      throw new Error('unknown direction: ' + direction);
  }
}
```

위와 같은 move 함수가 있다고 했을 때 direction은 4개의 값으로 가둬짐. 만약 아래와 같다면?

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right' | 'he') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    default:
      const invalid: never = direction; // 'string' 형식은 'never' 형식에 할당할 수 없습니다. direction = 'he'로 추론..
      throw new Error('unknown direction: ' + invalid);
  }
}
```

`he`라는 타입이 direction에 추가되고 invalid 변수에 never 타입을 넣는다면 에러가 발생함.

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right' | 'he') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    // he 케이스를 고려
    case 'he':
      break;
    default:
      const invalid: never = direction; // Ok
      throw new Error('unknown direction: ' + invalid);
  }
}
```

아래와 같이 he 케이스가 switch 문에서 미리 고려될 경우에는 invalid 케이스는 never 타입이 맞기 때문에 별도의 에러가 발생하지 않는다.

### 에러 처리 기본(try, catch, finally)

보통 에러 처리를 할 때 try, catch, finally를 사용한다.

```tsx
// Error(Exception) Handling: try -> catch -> finally
function readFile(fileName: string): string {
  if (fileName === 'not exist!💩') {
    throw new Error(`file not exist! ${fileName}`);
  }
  return 'file contents 📃';
}

function closeFile(file: string) {
  // ..
}
```

아래와 같은 readFile, closeFile 함수가 있을 때 에러 발생이 예측되는 부분은 try, catch, finally문을 감싸서 사용함

```tsx
const fileName = 'file';
try {
  console.log(readFile(fileName));
} catch (e) {
  console.log('catched!');
} finally {
  closeFile(fileName);
  console.log('finally!');
}
console.log('!!!');
```

finally에 굳이 가두지 않고 사용하지 않는 경우가 많은데 아래 예시를 보면 finally를 써야겠단 생각이 든다.

```tsx
function run() {
  // const fileName = 'file';
  const fileName = 'not exist!💩';

  try {
    console.log(readFile(fileName));
  } catch (e) {
    console.log('catched!');
    return; // catch 안에서 돌아가는 로직으로 인해 하단 closeFile이 수행되지 않을 수 있음
  }

  closeFile(fileName);
  console.log('finally!');
}

run();
// catched!
```

만약 catch 문 안에 return 문이라도 들어간다면 아래 closeFile이 수행되지 않음

```tsx
function run() {
  // const fileName = 'file';
  const fileName = 'not exist!💩';

  try {
    console.log(readFile(fileName));
  } catch (e) {
    console.log('catched!');
    // catch 안에서 돌아가는 로직으로 인해 하단 closeFile이 수행되지 않을 수 있음
    return;
  } finally {
    closeFile(fileName);
    console.log('finally!');
  }
}

run();
// catched!
// finally!
```

위처럼 finally 안에 수행될 내용을 넣었을 때 catch에서 무엇이 수행되어도 문제없이 돌아감..
에러 처리의 기본..

### 에러 처리 핸들링 어디서 할까?

```tsx
class NetworkClient {
  tryConnect(): void {
    throw new Error('no network!');
  }
}

class UserService {
  constructor(private client: NetworkClient) {}

  login() {
    this.client.tryConnect();
    // login...
  }
}

class App {
  constructor(private userService: UserService) {}
  run() {
    this.userService.login();
  }
}
```

위와 같이 NetworkClient, UserService, App 클래스가 있다고 했을 때 실행은 아래와 같이 한다.

```tsx
const client = new NetworkClient();
const service = new UserService(client);
const app = new App(service);
app.run(); // Error 발생
```

이 때 발생하는 에러는 어떤 위치에서 에러 핸들링(try - catch)을 하는게 바람직할까?
불필요하게 catch를 여러군데에서 쓰는 것은 바람직하지 않을 수 있음. 만약 UserService 클래스라면?

```tsx
class UserService {
  constructor(private client: NetworkClient) {}

  login() {
    try {
      this.client.tryConnect();
      // login...
    } catch (e) {
      console.log(e); // Error: no network
    }
  }
}
```

로그인 행위에 대한 에러 처리는 특별히 할게 없다. 만약 에러핸들링이 App 클래스에 있다면..

```tsx
class App {
  constructor(private userService: UserService) {}
  run() {
    try {
      this.userService.login();
    } catch (e) {
      console.log('error!');
      // show dialog to user
    }
  }
}
```

App 클래스에서 에러 핸들링을 하면, run 동작시 발생하는 에러에 따라 사용자에게 다이얼로그 등을 띄우는 등의 다양한 상황 처리를 할 수 있으므로 catch 할 위치로는 가장 적합함.

위와 같이 적합한 위치에서 에러 핸들링을 할 수 있도록 하는 것이 바람직하다.
