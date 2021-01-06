## 6. Set & WeakSet

Set이란? 중복없이 유일한 값을 저장하려고 할 때 사용한다. 이미 존재하는지 체크할 때 유용하다.

### Set으로 유니크한 배열만들기

```jsx
let mySet = new Set();
console.log(toString.call(mySet)); // [object Set]
mySet.add('vicky');
mySet.add('hyewon');
mySet.add('vicky');

mySet.forEach((v)=>{
	console.log(v); //vicky, hyewon, undefined
});

if(mySet.has('vicky')){
	console.log('vicky가 있다');
} else {
	console.log('vicky가 없다');
}

mySet.delete('hyewon');
mySet; // vicky
```

### WeakSet으로 효과적인 객체타입 저장하기

```jsx
let arr = [1, 2, 3, 4];
let arr2 = [5, 6, 7, 8];

let obj = {arr, arr2}; // {arr: Array(4), arr2: Array(4)}
let ws = new WeakSet();
ws.add(arr); 
ws; // WeakSet {Array(4)}

// 참조를 가지고 있는 객체만 저장 가능
ws.add(111); // Uncaught TypeError
ws.add('111'); // Uncaught TypeError
ws.add(null); // Uncaught TypeError
ws.add(function () {});
console.log(ws); // WeakSet {(4)[1,2,3,4, function]}

ws.add(arr);
ws.add(arr2);
ws.add(obj);
console.log(ws); // WeakSet {Array(4), Array(4), {…}}

arr = null;
console.log(ws); // WeakSet {Array(4), Array(4), {…}}
console.log(ws.has(arr), ws.has(arr2)); // false, true

arr2 = null;
console.log(ws.has(arr), ws.has(arr2)); // false, false
```