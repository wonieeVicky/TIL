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
}
