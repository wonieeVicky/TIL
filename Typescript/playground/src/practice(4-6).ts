/* // 4-1 타입추론
let num = 12;
num = "hello Vicky!"; // TS2322: Type '"Hello type!"' is not assignable to type 'number'.

// 타입스크립트가 타입을 추론하는 경우는 다음과 같다.
// - 초기화된 변수
let newNum = 12;
// - 기본값이 설정된 매개 변수
function add(a: number, b: number = 2): number {
  // - 반환 값이 있는 함수
  return a + b;
}

// 4-3 타입단언
// 함수의 매개 변수 val은 유니언 타입으로 문자열(String)이거나 숫자(Number) 일 수 있다.
// 그리고 매개 변수 isNumber는 불린(Boolean)이며, 
// 이름을 통해 숫자 여부를 확인하는 값이라는 것을 추론할 수 있다. 
// 따라서 우리는 isNumber가 true일 경우 val은 숫자일 것이고, 이에 toFixed를 사용할 수 있음을 확실히 알 수 있다. 
// 하지만 타입스크립트는 'isNumber'라는 이름만으로 위 내용을 추론할 수 없으므로 
// "val이 문자열인 경우 toFixed를 사용할수 없다"고 컴파일 단계에서 아래와 같은 에러를 반환한다.

function someFunc(val: string | number, isNumber: boolean){
  // some logics..
  if(isNumber){
    val.toFixed(2); // Error - TS2339: ... Property 'toFixed' does not exist on type 'string'
  }
} */

// 따라서 우리는 isNumber가 true일 때 val이 숫자임을 다음과 같이 2가지 방식으로 단언할 수 있다.
// 두 번째 방식(<number>val)은 JSX를 사용하는 경우 특정 구문 파싱에서 문제가 발생할 수 있으며,
// 결과적으로 .tsx 파일에서는 전혀 사용할 수 없다.

function someFunc(val: string | number, isNumber: boolean) {
  // some logics..
  if (isNumber) {
    // 1. 변수 as 타입
    (val as number).toFixed(2);
  }
  // or
  // 2. <타입>변수
  // (<number>val).toFixed(2);
}

// 4-3-1 Non-null 단언 연산자
// `!`를 사용하는 Non-null 단언 연산자(Non-null assertion operator)를 통해
// 피연산자가 Nullish(`null`이나 `undefined`) 값이 아님을 단언할 수 있는데,
// 변수나 속성에서 간단하게 사용할 수 있기 때문에 유용하다.

// 아래의 예제 중 `fnA` 함수를 살펴보면, 매개 변수 `x`는 함수 내에서 `toFixed`를 사용하는 숫자 타입으로 처리되지만,
// `null`이나 `undefined`일 수 있기 때문에 에러가 발생한다.
// 이를 타입 단언이나 `if` 조건문으로 해결할 수도 있지만,
// 마지막 함수와 같이 `!`를 사용하는 Non-null 단언 연산자를 이용해 간단하게 정리할 수 있다.

// Error - TS2533: Object is possibly 'null' or 'undefined'.
function fnA(x: number | null | undefined) {
  return x.toFixed(2);
}

// if statement
function fnD(x: number | null | undefined) {
  if (x) {
    return x.toFixed(2);
  }
}
// Type assertion
function fnB(x: number | null | undefined) {
  return (x as number).toFixed(2);
}
function fnC(x: number | null | undefined) {
  return (<number>x).toFixed(2);
}
// Non-null assertion operator
function fnE(x: number | null | undefined) {
  return x!.toFixed(2);
}

// 특히 컴파일 환경에서 체크하기 어려운 DOM 사용에서 유용하다. 물론 일반적인 타입 단언을 사용할 수도 있다.
// Error - TS2531: Object is possibly 'null'.
document.querySelector(".menu-item")?.innerHTML;

// Type assertion
(document.querySelector(".menu-item") as HTMLDivElement).innerHTML;
(<HTMLDivElement>document.querySelector(".menu-item")).innerHTML;

// Non-null assertion operator
document.querySelector(".menu-item")!.innerHTML;
