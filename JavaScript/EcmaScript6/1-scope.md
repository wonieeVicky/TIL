## 1. Scope

### let

let은 Block 단위로 스코프를 지닌다.

```jsx
var name = 'global var';
function home() {
	name = 'home var';
	for (var i = 0; i < 100; i++) {}
	console.log(i);
}
home(); // 100
console.log(name); // home var
```

### let과 closure

let은 스스로의 클로저를 가지므로, for문 등에서 변수 값 사용 시 오염되지 않은 값을 보존해준다.

```jsx
var list = document.querySelectorAll('li');
for (let i = 0; i < list.length; i++) {
  list[i].addEventListener('click', function () {
    console.log(i + '번째 리스트입니다'); // 4번째 리스트입니다 * n번 실행
  });
}
```

### const - 선언된 변수 지키기

- const를 기본으로 사용한다.
- 단, 변경이 될 수 있는 변수는 let을 사용한다.
- var는 사용하지 않는다.

```jsx
function home() {
  var homename = 'my house';
  homename = 'your house';
  console.log(homename);
}
home(); // 'your house'
function company() {
  const companyname = 'my house';
  companyname = 'your house';
  console.log(companyname);
}
company(); // error : const는 한번 선언되면 변수값을 재할당할 수 없다.
```

### const 특성과 immutable Array

const를 사용하더라도 배열과 오브젝트의 값을 변경하는 것은 가능하다.

```jsx
function home() {
  const list = ['apple', 'orange', 'watermelon'];
  list.push('banana');
  console.log(list); // ['apple', 'orange', 'watermelon', 'banana']
}
```

```jsx
// immutable array 를 어떻게 만들까?
const list = ['apple', 'orange', 'watermelon'];
list2 = [].concat(list, 'banana'); // 새로운 배열을 만들어준다.
console.log(list2); // ['apple', 'orange', 'watermelon', 'banana']
list === list2; // false
```