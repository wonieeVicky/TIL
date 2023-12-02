{
  /**
   * Union Types: OR (|)를 사용하여 타입을 정의할 수 있다.
   */
  type Direction = 'left' | 'right' | 'up' | 'down';
  function move(direction: Direction) {
    console.log(direction);
  }
  move('left'); // ok
  move('right'); // ok
  move('up'); // ok
  move('down'); // ok

  type TileSize = 8 | 16 | 32;
  const tile: TileSize = 16; // ok
  // const tile2: TileSize = 15; // Error
  // const tile3: TileSize = 16.5; // Error

  // function: login -> success, fail
  type SuccessState = {
    response: {
      body: string;
    };
  };
  type FailState = {
    reason: string;
  };
  type LoginState = SuccessState | FailState;

  function login(id: string, passworld: string): LoginState {
    // success
    return {
      response: {
        body: 'logged in!'
      }
    };
    // error
    return {
      reason: 'failed'
    };
  }

  // printLoginState(state)
  // success -> 🎉 body
  // fail -> 😭 reason

  function printLoginState(state: LoginState): void {
    // response가 있는지 확인
    if ('response' in state) {
      console.log(`🎉 ${state.response.body}`);
    } else {
      console.log(`😭 ${state.reason}`);
    }
  }
}
