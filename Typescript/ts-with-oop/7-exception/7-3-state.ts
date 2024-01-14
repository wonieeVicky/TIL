{
  class TimeoutError extends Error {}
  class OfflineError extends Error {}

  type SuccessState = {
    result: 'success';
  };
  type NetworkErrorState = {
    result: 'fail';
    reason: 'offline' | 'down' | 'timeout'; // union type
  };
  type ResultState = SuccessState | NetworkErrorState;

  class NetworkClient {
    tryConnect(): ResultState {
      return {
        result: 'fail',
        reason: 'offline'
      };
      return {
        result: 'success'
      };
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
        // error는 any 타입으로 추론되어 instanceof를 사용할 수 없다.
        // Error exception은 가급적 정말 예상치 못했던 곳에서 에러 발생 시 사용하는 것이 좋다.
        // if(error instanceof OfflineError){
        //   //
        // }
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
}
