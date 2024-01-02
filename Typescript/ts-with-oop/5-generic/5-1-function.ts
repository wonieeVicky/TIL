{
  function checkNotNullBad(arg: number | null): number {
    if (arg == null) {
      throw new Error('not valid number!');
    }
    return arg;
  }
  const result = checkNotNullBad(123); // 123
  checkNotNullBad(null); // ErcheckNotNullBadror: not valid number!

  // 타입의 정보가 없어지므로 any를 사용하면 좋지 않다.
  function checkNotNullAnyBad(arg: any | null): any {
    if (arg == null) {
      throw new Error('not valid number!');
    }
    return arg;
  }
  const result2 = checkNotNullAnyBad(123); // any로 추론함

  // 제네릭은 코딩 시 타입이 결정되므로, 타입 보장의 확장성을 가질 수 있다.
  // generic = 통상적인, 일반적인
  function checkNoNullWithGeneric<T>(arg: T | null): T {
    if (arg == null) {
      throw new Error('not valid number!');
    }
    return arg;
  }
  const number = checkNoNullWithGeneric(123); // number로 타입 추론
  const string = checkNoNullWithGeneric('123'); // string으로 타입 추론
  const bool = checkNoNullWithGeneric(false); // boolean으로 타입 추론
}
