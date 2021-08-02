## 9. Function
### Arrow function 활용

```jsx
setTimeout(function(){
	console.log('setTimeout');
}, 1000);

// 위의 코드를 arrow function을 활용하면 아래와 같이 쓸 수 있다.
setTimeout(() => {
	console.log('setTimeout');
}, 1000);

let newArr = [1, 2, 3, 4, 5].map(function(value, index, object){
	return value * 2;
});

// 위의 코드를 arrow function을 활용하면 아래와 같이 쓸 수 있다.
let newArr = [1, 2, 3, 4, 5].map((v) => v * 2 );
```

### Arrow function 의 this context

```jsx
const myObj = {
	runTimeout() {
		setTimeout(function(){
			console.log(this === window); // true
			this.printData(); // hi Vicky
		}.bind(this), 200);
	},
	printData(){
		console.log('hi Vicky');
	}
}

// 위의 코드를 arrow function으로 사용하면 아래와 같이 나온다.
const myObj = {
	runTimeout() {
		setTimeout(() => {
			console.log(this === window); // false :: arrow는 컨텍스트를 유지하고 있으므로
			this.printData(); // hi Vicky
		}, 200);
	},
	printData(){
		console.log('hi Vicky');
	}
}
```

이와 같이 arrow function을 쓰면 this context를 유지하므로 bind 없이 this를 가리킬 수 있다!

```jsx
<p>my Div!</p>
const el = document.querySelector('p');
const myObj = {
	register(){
		el.addEventListener('click', (e) => {
			this.printData(evt.target);
		});
	},
	printData(el){
		console.log('clicked!!', el.innerText);
	}
}
myObj.register(); // clicked!! my Div!
```

### function default parameters

함수의 기본 매개변수(default parameters)

```jsx
function sum(value, size){
	size = size || 1; // point!
	return value * size;
}
console.log(sum(3)); // NaN

// 위의 코드 중 Point를 매개변수 형태로 넣을 수 있다.
function sum(value, size = 1){
	return value * size;
}
console.log(sum(3)); // 3

// 그리고 객체형태의 값으로도 넣을 수 있다
function sum(value, size = {value: 1}){
	return value * size;
}
console.log(sum(3,{value: 3})); // 9
```

### rest parameters

- Spread Operator와 사용법은 비슷하지만 다르다.
- Rest Parameters의 경우 매개변수에 ...이 포함되며, 이 경우 인자값(들)이 배열 안에 변환되어 담긴다.

```jsx
// ES6 이전에는 arguments의 갯수나 종류를 예상하지 못하는 함수의 경우
// argument를 배열로 만들어 메서드를 사용하여 처리해야 했다.
function checkNum() {
	// 인자의 값을 배열로 만들어준다.
	const argArray = Array.prototype.slice.call(arguments);
	console.log(argArray); // [10, 2, 3, 4, 5, '55']
	console.log(toString.call(argArray)); // [Object Array]

	// 배열로 만든 인자의 값을 every 메서드를 이용해 타입을 정리할 수 있다.
	const result = argArray.every((v) => typeof v === "number");
	console.log(result); // false, "55" is string
}

// ES6에는 rest parameter가 추가되어 손쉽게 작업이 가능하다.
// spread operator와 다르다! 
// 매개변수에 ...이 사용되는 경우를 rest parameters라고 한다.
function checkNum(...argArr) {
	console.log(toString.call(argArr)); // [Object Array]
	const result = argArr.every((v) => typeof v === "number");
	console.log(result); // false
}

const result = checkNum(10, 2, 3, 4, 5, "55");
```