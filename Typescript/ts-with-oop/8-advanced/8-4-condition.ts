type Check<T> = T extends string ? boolean : number;
// 위와 같은 조건부 타입으로 만들 수 있다.
type Type = Check<string>; // boolean
type Type2 = Check<'aa'>; // boolean

// conditional type은 조건부로 타입을 결정할 수 있는 타입을 의미함
// T extends U ? X : Y
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object';

type T0 = TypeName<string>; // 'string' type
type T1 = TypeName<'a'>; // 'string' type
type T2 = TypeName<() => void>; // 'function' type
