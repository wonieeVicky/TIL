## 7. Map & WeakMap
Map은 key & value 의 object 구조이다

### 추가 정보를 담은 객체 저장하기

```jsx
// map은 key & value 구조이다
let wm = new WeakMap();
let myFunc = function(){};

// 이 myFuc이 얼마나 실행되었는가? 
wm.set(myFunc,0);
console.log(wm); // WeakMap {ƒ => 0}

let count = 0;
for (let i = 0; i < 10; i++){
	count = wm.get(myFunc); // get value
	count++;
	wm.set(myFunc, count);
}
console.log(wm); // WeakMap {ƒ => 10}

myfunc = null;
console.log(wm.get(myfunc)); // undefined
console.log(wm.has(myfunc)); // false
```

### WeakMap 클래스 인스턴스 변수 보호하기

```jsx
const wm = new WeakMap();

function myArea(height, width){
	wm.set(this, {height, width});
}
myArea.prototype.getArea = function(){
	const {height, width} = wm.get(this);
	return height * width;
}
let myarea = new Area(10,20);
console.log(myarea.getArea()); // 200
console.log(myarea.height); // undefined, 접근불가

myarea = null;
console.log(wm.has(myarea)); // false

// 다른 방법
const obj = {};
function Area(height, width){
	obj.height = height;
	obj.width = width;
}
Area.prototupe.getArea = function(){
	reutn obj,height * obj.width;
}
let myarea = new Area(10,20);
console.log(obj); // object {height: 10, width: 20}
myarea = null;
console.log(obl); // object {height: 10, width: 20}
```