## 4. Object

### 간단히 객체 생성하기

```jsx
const name = 'vicky';
const age = 33;

// 예전 방법
const obj = {
  name: name,
  age: age,
};

// 발전된 방법
const getObj = () => {
	const name = 'vicky';
	const getName = () => {
		return name;
	}
	const setName = (newName) => {
		name = newName;
	}
	const printName = () => {
		console.log(name);
	}
	return {getName, setName, printName};
}
let obj = getObj();
obj.getName(); // vicky
obj.name; // vicky
```