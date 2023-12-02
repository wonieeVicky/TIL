{
  /**
   * Type Aliases : type aliases는 새로운 타입을 정의하는 것이 아니라 정의된 타입에 대한 참조를 생성한다.
   */
  type Text = string;
  const name: Text = 'vicky';
  const address: Text = 'korea';

  type Num = number;
  type Student = {
    name: string;
    age: number;
  };
  const student: Student = {
    name: 'vicky',
    age: 33
  };

  /**
   * String Literal Types : 문자열을 타입으로 지정할 수 있다.
   */
  type Name = 'name';
  let vickyName: Name;
  vickyName = 'name'; // ok
  vickyName = 'json'; // Error

  type JSON = 'json';
  let json: JSON = 'json'; // ok
  json = 'JSON'; // Error
}
