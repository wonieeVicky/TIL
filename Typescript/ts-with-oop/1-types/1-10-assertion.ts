{
  /**
   * Type Assertions 💩
   * 타입을 강요할 때 사용 - 불가피하게 써야할 수도 있다.
   */
  function jsStrFunc(): any {
    return 'hello';
  }
  const result = jsStrFunc();
  console.log((result as string).length); // 타입을 확신할 때 사용함(as)
  console.log((<string>result).length); // 이렇게 사용할 수도 있다.

  const wrong: any = 5;
  console.log((wrong as Array<number>).push(1)); // error!! 😱
  // 위처럼 런타임에서 에러가 발생할 수 있으므로 정말 장담하는 타입이 아니면 사용하지 않는다.

  function findNumbers(): number[] | undefined {
    return undefined;
  }
  const numbers = findNumbers();
  numbers.push(2); // error
  numbers?.push(2); // numbers가 undefined일 수도 있으므로 ?를 붙여줘야 함
  numbers!.push(2); // numbers가 undefined가 아니라고 확신할 때 !를 붙여줌

  const button = document.querySelector('class')!;
  button.nodeValue; // !를 붙여줘야 null이 아니라고 확신할 수 있음
}
