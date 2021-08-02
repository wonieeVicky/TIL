## 5. Destructuring

Destructuring은 구조화된 배열 또는 객체를 Destructuring(비구조화, 파괴)하여 개별적인 변수에 할당하는 것. 배열 또는 객체 리터럴에서 필요한 값 만을 추출하여 변수에 할당하거나 반환할 때 유용하다.

### Destructuring Array

```jsx
let data = ['vicky', 'jake', 'riley', 'jane', 'hannah'];
let jisu = data[0]; // vicky
let jung = data[2]; // riley
let [jisu, jung] = data; // jisu: vicky, jung: riley
```

### Destructuring Object

```jsx
let obj = {
  name: 'vicky',
  address: 'korea',
  age: 10,
};
let {name, age} = obj;
console.log(name, age); // vicky 10
let {myName: name, myAge: age} = obj; // myName: vicky, myAge: 10
```

### Destructuring 활용 JSON 파싱

```jsx
var news = [
  {
    title: 'sbs',
    imgurl: 'http:www.naver.com',
    newlist: ['aaa', 'bbb', 'ccc', 'ddd', 'eee'],
  },
  {
    title: 'kbs',
    imgurl: 'http:www.daum.net',
    newlist: ['111', '222', '333', '444', '555'],
  },
];

// 예시 1
let [, kbs] = news;
console.log(kbs); // {title: "kbs", imgurl: "http:www.daum.net", newlist: Array(5)}
let {title, imgurl} = kbs; 
console.log(title, imgurl); // kbs http:www.daum.net

// 예시 2
let [, {title, imgurl}] = news;
console.log(title, imgurl); // kbs http:www.daum.net
```

### Destructuring 활용 Event 객체 전달

```jsx
// 예시 1
var news = [
  {
    title: 'sbs',
    imgurl: 'http:www.naver.com',
    newslist: ['aaa', 'bbb', 'ccc', 'ddd', 'eee'],
  },
  {
    title: 'kbs',
    imgurl: 'http:www.daum.net',
    newslist: ['111', '222', '333', '444', '555'],
  },
];

const getNewsListLast = ([, {newslist}]) => {
  console.log(newslist);
}
getNewsListLast(news); // (5) ["111", "222", "333", "444", "555"]

const getNewsListFirst = ([{newslist}]) => {
	console.log(newslist);
}
getNewsListFirst(news); // (5) ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
```

```jsx
// 예시 2
<div>vicky hello?</div>;
document
  .querySelector('div')
  .addEventListener('click', function ({target, type}) {
    console.log(target.tagName); // "DIV"
    console.log(target.innerText); // "vicky hello?"
    console.log(type); // "click"
  });
```