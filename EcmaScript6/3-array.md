## 3. Array

### for ~ of 순회하기

ES2016의 Array에는 Array값을 보존해주는 for ~ of 구문이 새롭게 새겼다.
주로 순회를 위해서는 for, forEach, for~of 문을 사용하도록 하자.

```jsx
// for
let data = [1, 2, undefined, NaN, null, ''];
for (var i = 0; i < data.length; i++) {
  console.log(i); // 0 ~ 5
}

// forEach
data.forEach(function (val) {
  console.log(val); // 1, 2, undefined, NaN, null, ''
});
```

- for ~ of 문 : ES6에서 나온 새로운 문법, Array값을 보존해준다. (문자열 순회도 가능)

```jsx
let data = [1, 2, undefined, NaN, null, ''];
for (let val of data) {
  console.log(val); // 1, 2, undefined, NaN, null, ''
}
// for ~ of 의 또다른 기능 - 문자열 순회도 가능하다!
var str = 'hello world!';
for (let val of str) {
  console.log(val); // h,e,l,l,o, ,w,o,r,l,d,!
}
```

- for ~ in 문 : 이후에 추가해주는 값까지 모두 계산되어서 나온다. 때문에 Array에서 for ~ in은 되도록 사용 X

```jsx
let data = [1, 2, undefined, NaN, null, ''];
Array.prototype.getIndex = function () {};
for (let val in data) {
  console.log(data[val]); // 1, 2, undefined, NaN, null, '', function(){}
}
```

### Spread Operator - 배열의 복사

배열의 Spread Operator(펼침연산자)가 추가되었다.

```jsx
let pre = ['apple', 'orange' , 100];
let newPre = [...pre];
console.log(newPre); // ['apple', 'orange' , 100]
console.log(pre === newPre); // false
```

- 몇가지 활용 예시

```jsx
let pre = [100, 200, 'hello', null];
let newData = [0, 1, 2, 3, ...pre, 4]; // [0, 1, 2, 3, 100, 200, "hello", null, 4]
let pre2 = [100, 200, 300];
function sum(a, b, c) {
  return a + b + c;
}
sum.apply(null, pre2); // 600, 예전엔 배열의 총합을 이렇게 구했다.(before)
sum(...pre2); // 600, 전개 연산자를 통해 배열의 총합을 구할 수 있다.(after)
```

### from 메서드 - 진짜 배열 만들기

for 문을 돌려 배열을 만드는 방식이 아닌 from 메서드를 통해 진짜 배열을 간단히 만들 수 있다.

```jsx
// 예전 방법
const addMark = () => {
	let newData = [];
	for (let i = 0; i < arguments.length; i++){
		newDate.push(arguments[i]+'!';
	}
}

// from 메서드를 활용해 배열을 만드는 방법
const addMark = () => {
	// Array.from을 통해 유사 배열(Object)를 실제 배열로 바꿔준다.
	let newArray = Array.from(arguments);
	let newData = newArray.map((val) => {
		return val + '!';
	});
}

addMark(1, 2, 3, 4, 5); // ["1!", "2!", "3!", "4!", "5!"]
```