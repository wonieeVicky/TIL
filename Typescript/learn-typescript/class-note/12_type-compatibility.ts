var add = function (a: number) {
  // ...
};

var sum = function (a: number, b: number) {
  // ...
};

// 두 함수의 차이는 파라미터의 차이가 있고, sum 함수의 타입 구조가 add 함수보다 더 크다.
sum = add; // OK! 타입 호환 가능 sum에는 a, b 두 개의 인자를 받아들이고, add는 그 중 a라는 인자를 포함하므로
add = sum; // Type Error! add에는 a라는 하나의 인자만 받아들이나 sum은 a, b의 더 큰 타입 구조를 가지므로

interface Empty<T> {
  // ..
}

var empty1: Empty<string>;
var empty2: Empty<number>;

empty1 = empty2; // OK
empty2 = empty1; // OK

interface NotEmpty<T> {
  data: T;
}

var notempty1: NotEmpty<string>;
var notempty2: NotEmpty<number>;

notempty1 = notempty2; // Type Error!
notempty2 = notempty1; // Type Error!
