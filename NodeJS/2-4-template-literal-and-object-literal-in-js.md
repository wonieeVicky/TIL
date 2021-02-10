# 4) 템플릿 문자열 객체 리터럴

## 4-1. 탬플릿 문자열

- 문자열을 합칠 때 + 기호 때문에 지저분함

  - ES2015부터는 `(백틱) 사용 가능
  - 백틱 문자열 안에 ${변수} 처럼 사용

  ```jsx
  var num1 = 1;
  var num2 = 2;
  var result = 3;
  var string1 = num + "더하기" + num2 + "는 '" + result + "'";
  console.log(string1); // 1 더하기 2는 '3'

  // 백틱 사용
  const num3 = 1;
  const num4 = 2;
  const result2 = 3;
  const string2 = `${num3} 더하기 ${num4}는 '${result2}'`;
  console.log(string2); // 1 더하기 2는 '3'
  ```

  함수 호출 기능도 있다

  ```jsx
  function aa() {}
  aa(); // 기존의 함수 사용법
  a``; // tagged template literal
  ```

## 4-2. 객체 리터럴

- ES5 시절의 객체 표현 방법

  - 속성 표현 방식에 주목

  ```jsx
  var sayNode = function(){
  	console.log('Node');
  }
  var es = 'ES';
  var oldObject = {
  	sayJs: function(){
  		console.log('JS')l
  	},
  	sayNode: sayNode
  }
  oldObject[es + 6] = 'Fantastic';
  oldObject.sayNode(); // Node
  oldObject.sayJS(); // JS
  console.log(oldObject.ES6); // Fantastic
  ```

  - 훨씬 간결한 문법으로 객체 리터럴 표현 가능
    - 객체의 메서드에 function을 붙이지 않아도 된다.
    - { sayNode: sayNode }와 같은 것을 { sayNode }로 축약 가능
    - [변수 + 값] 등으로 동적 속성명을 객체 속성 명으로 사용 가능

  ```jsx
  const newObject = {
    sayJS() {
      console.log("JS");
    },
    sayNode,
    [es + 6]: "Fantastic",
  };

  newObject.sayJS(); // JS
  newObject.sayNode(); // Node
  console.log(newObject.ES6); // Fantastic
  ```
