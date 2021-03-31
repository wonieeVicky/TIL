# 타입스크립트에서 변수와 함수타입 정의하기

## 기본 타입

### 문자열, 숫자, 배열

```tsx
// JS 문자열 선언
// var str = 'hello';

// TS 문자열 선언
var str: string = 'hello';

// TS 숫자 선언
let num: number = 10;

// TS 배열 선언
let arr: Array<number> = [1, 2, 3];
let heroes: Array<string> = ['capt', 'Thor', 'Hulk'];
let items: number[] = [1, 2, 3]; // Array<number>와 같은 타입 선언이다.
```

### 튜플, 객체, 진위값

```tsx
// TS 튜플 : 배열의 각 인덱스에 타입을 지정한 것을 튜플이라 함
let address: [string, number] = ['gangnam', 1];

// TS 객체
let obj: object = {};
let person: { name: string; age: number } = {
  // 객체의 구체적인 타입정의도 가능하다.
  name: 'vicky',
  age: 32,
};

// TS 진위값
let show: boolean = true;
```

## 함수 타입

### 파라미터, 반환값

```tsx
// 함수의 파라미터에 타입을 정의하는 방식
function sum(a: number, b: number) {
  return a + b;
}
sum(10, 20);

// 함수의 반환 값에 타입을 정의하는 방식
function add(): number {
  return 10;
}

// 종합: 함수에 타입을 정의하는 방식
function total(a: number, b: number): number {
  return a + b;
}
```

### 파라미터를 제한하는 특성

```tsx
// 종합: 함수에 타입을 정의하는 방식
function total(a: number, b: number): number {
  return a + b;
}

total(10, 20, 30, 40); // 지정하지 않은 인수가 있을 때 에러가 발생한다!
```

### 옵셔널(선택적) 파라미터

```tsx
// 함수의 옵셔널 파라미터(? 사용)
function log(a: string, b?: string) {}

log('hello world');
log('hello world', 'vicky');
log('hello ts', 'abc', 'dd'); // 'dd' 때문에 에러 발생
```
