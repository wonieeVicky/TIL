{
  /**
   * Type Inference
   */
  let text = 'hello';
  text = 'hi';
  text = 1; // type inference error

  function print(message = 'hello') {
    console.log(message);
  }
  print('hello');
  print(); // ok. default parameter
  print(1); // type error

  function add(x: number, y: number): number {
    return x + y;
  }
  add(1, 2); // number
}
