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
    try {
      this.userService.login();
    } catch (e) {
      console.log('error!');
      // show dialog to user
    }
  }
}

// service.login(); // Error 발생

const client = new NetworkClient();
const service = new UserService(client);
const app = new App(service);
app.run(); // Error 발생

// 어디에서 에러 핸들링(try - catch)을 해야할까? -> App 클래스에서 해야한다.
// 에러에 따라 다이얼로그 등을 띄우는 등의 다양한 상황 처리를 할 수 있는 곳이기 때문.
