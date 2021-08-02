## 12. Proxy

### Proxy로 interception 기능 구현

Proxy는 어떤 Object가 있을 때 그 Object가 다른 작업을 추가로 할 수 있는 기능을 제공한다.

```jsx
const myObj = { name: 'vicky' };

// Proxy는 어떤 객체를 감싸주는 역할을 한다.
const proxy = new Proxy(myObj, {});
proxy.name; // vicky

// 값을 변경할 수도 있다.
proxy.name = 'wonny';
proxy.name; // wonny

toString.call(proxy); // Object
proxy; // { name: 'wonny' }
myObj; // // { name: 'wonny' }

proxy === myObj; // false
proxy.name === myObj.name // true
```

프록시는 객체의 변화나 접근을 중간에 가로채서 새로운 이벤트를 발생시킬 수 있는 메서드 get, set을 제공한다.

```jsx
const myObj = { name: 'vicky' };

const proxy = new Proxy(myObj, {
	get: function(target, property, receiver){
		console.log('get value');
		return target[property];
	},
	set: function(target, property, value){
		console.log('set value');
		target[property] = value;
	}
});

proxy.name;
// get value
// vicky

proxy.name = 'wonny'; 
// change value
// "wonny"

```

직접 객체에 데이터를 수정할 경우 객체의 값이 변경되지 않도록 하는 이벤트 구성이 가능하다.

```jsx
const myObj = { name: 'vicky', changedValue: 0 };

const proxy = new Proxy(myObj, {
	get: function(target, property, receiver){
		console.log('get value');
		return target[property];
	},
	set: function(target, property, value){
		console.log('set value');
		target[property] = value;
		target['changedValue']++;
	}
});

proxy.name;
// get value
// vicky

proxy.name = 'wonny'; 
// set value
// "wonny"

proxy.changedValue; // 1

myObj.name = 'anna'; // 직접 객체에 값 변경
proxy; // { name: 'anna', changedValue: 1 } -> changedValue 올라가지 않음
myObj; // { name: 'anna', changedValue: 1 } -> changedValue 올라가지 않음

proxy.name = 'jake';
// set value
// "jake"

proxy; // { name: 'jake', changedValue: 2 }
myObj; // { name: 'jake', changedValue: 2 }
```

targetObj를 별도로 꺼내놓지 않고 Proxy 안으로 숨겨놓을 수도 있다.

```jsx
const proxy = new Proxy({ name: 'vicky', changedValue: 0 }, {
	get: function(target, property, receiver){
		console.log('get value');
		return target[property];
	},
	set: function(target, property, value){
		console.log('set value');
		target[property] = value;
		target['changedValue']++;
	}
});

proxy.name = 'wonny';
// set value
// wonny

proxy.changedValue;
// get value
// 1
```

이렇듯 Proxy는 변화에 대한 모니터링이 가능하고 이러한 변화 감지를 통해 다른 컴포넌트에 영향을 주는 등의 기능(로깅 등)으로 활용이 가능한 메서드이다. 또한, Proxy에서는 값을 반환해줄 때 `target[property]`로 바로 리턴해주는 것보다 `Reflect.get`이라는 별도의 메서드를 사용하는 것을 권장한다.

```jsx
const proxy = new Proxy({ name: 'vicky', changedValue: 0 }, {
	get: function(target, property, receiver){
		console.log('get value');
		return (property in target) ? Reflect.get(target, property) : "anonymous"
	},
	set: function(target, property, value){
		console.log('set value');
		target[property] = value;
		target['changedValue']++;
	}
});

proxy.name = 'wonny';
// set value
// wonny

proxy.changedValue;
// get value
// 1

proxy.age;
// "anonymous"
```