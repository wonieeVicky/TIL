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

  function checkNoNull<GENERIC>(arg: GENERIC | null): GENERIC {
    if (arg == null) {
      throw new Error('not valid number!');
    }
    return arg;
  }
  const number = checkNoNull(123);
  const string = checkNoNull('123');
}
