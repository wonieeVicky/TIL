{
  /**
   * Discriminated Union
   * Union 타입에 공통적인 프로퍼티를 두어 구분하는 방법을 활용하면 직관적 코딩이 가능함
   */
  // function: login -> success, fail
  type SuccessState = {
    result: 'success';
    response: {
      body: string;
    };
  };
  type FailState = {
    result: 'fail';
    reason: string;
  };
  type LoginState = SuccessState | FailState;

  function login(id: string, passworld: string): LoginState {
    // success
    return {
      result: 'success', // 명시적으로 붙여줘야 타입에러가 발생하지 않음
      response: {
        body: 'logged in!'
      }
    };
    // error
    return {
      result: 'fail', // 명시적으로 붙여줘야 타입에러가 발생하지 않음
      reason: 'failed'
    };
  }

  // printLoginState(state)
  // success -> 🎉 body
  // fail -> 😭 reason

  function printLoginState(state: LoginState): void {
    // key in value로 처리하지 않고 공통의 result 값을 바라보고 처리
    if (state.result === 'success') {
      console.log(`🎉 ${state.response.body}`);
    } else {
      console.log(`😭 ${state.reason}`);
    }
  }
}
