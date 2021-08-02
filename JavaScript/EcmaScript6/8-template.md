## 8. Template

### Template 처리

템플릿 처리는 UI 개발에서 굉장히 중요한 작업이다.

- JSON으로 응답을 받고, javaScript Object로 변환한 후에 어떤 데이터 처리 조작을 한 후 Dom에 추가
- 데이터 + HTML문자열의 결합이 필요하기 때문에 중요하다.
- 데이터는 보통 ${}로 감싸고 해당 HTML 문자열은 ``로 감싸준다.

```jsx
const data = [
	{
		name: 'coffee-bean',
		order: true,
		items: ['americano', 'milk', 'green-tea']
	},
	{
		name: 'startbucks',
		order: false,
	}
];

const template = `<div>welcome ${data[0].name} !!</div>`;
console.log(template);
```

### Tagged Template literals

템플릿을 forEach를 사용해 각 value 값을 순회하며 넣어줄 수 있다.

---

```jsx
const data = [
	{
		name: 'coffee-bean',
		order: true,
		items: ['americano', 'milk', 'green-tea']
	},
	{
		name: 'startbucks',
		order: false, 
	},
	{
		name: 'coffee-king',
		order: true,
		items: ['americano', 'latte']
	},
];

// Tagged template literals
function fn(tags, name, items){
	console.log(tags);
	if(typeof items === 'undefined'){
		items = '<span sytle="color:red">주문 가능한 상품이 없습니다.</span>';
	}
	return (tags[0] + name + tags[1] + items + tags[2]);
}
data.forEach((v) => {
	let template = fn`
		<div>welcome ${v.name} !!</div>
		<h2>주문가능항목</h2>
	  <div>${v.items}</div>`;
	document.querySelector('#message').innerHTML += template;
});

```