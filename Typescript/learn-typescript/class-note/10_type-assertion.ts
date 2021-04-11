// 타입 단언(type assertion)
var a; // 타입 추론방식에 의해 a의 타입은 any로 추론
// var b = 10; // 타입 추론방식에 의해 b의 타입은 number로 추론
var b = a; // b의 타입은 맨처음에 선언된 a의 타입에 따라 any로 추론된다.

var c = a as string; // a를 string으로 할당되어 c의 타입은 string으로 선언된다.

// DOM API 조작할 때 타입 단언을 가장 많이 사용한다.
// <div id="app">hi</div>에 접근한다고 했을 때..
var div = document.querySelector('div') as HTMLDivElement; // 특정 tag에 대한 정보를 접근할 수 있음, 타입 HTMLDivElement
div.innerText = 'abc';
