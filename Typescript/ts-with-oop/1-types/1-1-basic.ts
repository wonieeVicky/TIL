{
  /**
   * Javascript
   * Primitive(원시) Type: number, string, boolean, bigint, symbol, null, undefined
   * Object(객체) Type: function, array...
   */

  // number
  // const num1: number = 'vicky'; // error
  const num2: number = 0.3;
  const num3: number = 3;

  // string
  const str1: string = 'hello';

  // boolean
  const bool1: boolean = true;

  // undefined - 값이 있는지 없는지 아무것도 결정되지 않은 상태
  let name: undefined; // 💩
  name = 'vicky'; // error

  let age: number | undefined; // 이렇게 주로 사용한다.
  age = 13; // ok
  age = undefined; // ok

  // null - 값이 없음을 명시적으로 표현
  let person: null; // 💩
  person = null; // ok
  person = 1; // error
  function find(): number | undefined {
    return undefined;
  }

  let person2: string | null; // 이렇게 주로 사용한다.
  person2 = 'vicky'; // ok
  person2 = null; // ok

  // unknown - 💩 어떤 데이터가 담길지 알 수 없음을 의미
  let notSure: unknown = 0;
  notSure = 'vivivi'; // ok
  notSure = true; // ok

  // any - 💩, 어떤 것이든 담을 수 있음을 의미
  let anything: any = 0;
  anything = 'hello'; // ok
  anything = true; // ok

  // void - 함수에서 아무것도 리턴하지 않을 때 사용
  function test(): void {
    console.log('test');
    return;
  }
  let unusable: void = undefined; // 💩

  // never - 함수에서 절대 리턴하지 않을 때 사용
  // 예상치 못한 에러가 발생 시 호출시키는 함수라고 정의했을 떄
  // 이 함수는 리턴할 계획이 없다는 것을 명시적으로 표현
  function throwError(message: string): never {
    // message -> server (log)
    throw new Error(message);
    // while(true) {}
    // return; // error
  }
  let neverEnding: never; // 💩

  // object - 원시 타입을 제외한 모든 object 타입을 할당할 수 있다.
  let obj: object; // 💩
  obj = [1, 2, 3]; // ok
  function acceptSomeObject(obj: object) {}
  acceptSomeObject({ name: 'vicky' }); // ok
  acceptSomeObject({ animal: 'dog' }); // ok
}
