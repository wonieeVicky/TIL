# 프론트엔드 자바스크립트

## 9-1. AJAX

### 서버로 요청을 보내는 코드

- 라이브러리 없이는 브라우저가 지원하는 XMLHttpRequest 객체 이용
- AJAX 요청 시 Axios 라이브러리를 사용하는 게 편하다.
- HTML 내에 cdn을 추가하면 사용할 수 있다.

### GET 요청 보내기

- axios.get 함수의 인수로 요청을 보낼 주소를 넣으면 된다.
- 프로미스 기반 코드라 async/await 사용 가능

```jsx
axios
  .get("https://www.vicky.com/api/get")
  .then((result) => {
    console.log(result);
    console.log(result.data); // {}
  })
  .catch((err) => {
    console.error(err);
  });

// 혹은
(async () => {
  try {
    const result = await axios.get("https://www.vicky.com/api/get");
    console.log(result);
    console.log(result.data); // {}
  } catch (err) {
    console.error(err);
  }
})();
```

### POST 요청 보내기 (데이터를 담아 서버로 보내는 경우)

- 전체적인 구조는 비슷하다 두 번째 인수로 데이터를 넣어 보낸다.

```jsx
(async () => {
	try {
		const result = await axios.post('https://www.vicky.com/api/post/json'), {
			name: 'vicky',
			birth: 1990
		});
	} catch(err){
		console.error(err);
	}
})();
```

## 9-2. FormData

### HTML form 태그에 담긴 데이터를 AJAX 요청으로 보내고 싶은 경우

- FormData 객체 이용

### FormData 메서드

- Append로 데이터를 하나씩 추가
- Has로 데이터 존재 여부 확인
- Get으로 데이터 조회
- getAll로 데이터 모두 조회
- delete로 데이터 삭제
- set으로 데이터 수정

```jsx
const formData = new FormData();
formData.append("name", "vicky");
formData.append("item", "orange");
formData.append("item", "melon");

formData.has("name"); // true
formData.has("item"); // true
formData.has("money"); // false

formData.get("item"); // orange
formData.getAll("item"); // ['orange', 'melon']

formData.append("test", ["hi", "vicky"]);
formData.get("test"); // hi, vicky

formData.delete("test");
formData.get("test"); // null
formData.set("item", "apple");
formData.getAll("item"); // ['apple']
```

### FormData POST 요청으로 보내기

- Axios 의 data 자리에 formData를 넣어서 보내면 된다.

```jsx
(async () => {
  try {
    const formData = new FormData();
    formData.append("name", "vicky");
    formData.append("birth", 1990);
    const result = await axios.post("https://www.vicky.com/api/post/formdata", formData);
  } catch (err) {
    console.error(err);
  }
})();
```

## 9-3. encodeURIComponent, decodeURIComponent

- URL과 URI의 차이점?

### 가끔 주소창에 한글 입력하면 서버가 처리하지 못하는 경우 발생

- encodeURIComponent로 한글 감싸줘서 처리

  - 노드를 encodeURIComponent하면 %EB%85%B8%EB%93%9C가 된다.
  - decodeURIComponent로 서버에서 한글 해석

    `decodeURIComponent(%EB%85%B8%EB%93%9C); // 노드`

```jsx
(async () => {
  try {
    const result = await axios.get(`https://www.vicky.com/api/search/${encodeURIComponent("노드")}`);
    console.log(result);
    console.log(result.data); // {}
  } catch (err) {
    console.error(err);
  }
})();
```

## 9-4. data attribute와 dataset

### HTML 태그에 데이터를 저장하는 방법

- 서버의 데이터를 프론트엔드로 내려줄 때 사용
  - 공개된 데이터만 간단히 저장하는 방법으로 사용한다.
  - HTML과 JavaScript 간의 데이터 교환 기능
- 태그 속성으로 data-속성명
- 자바스크립트에서 태그.dataset.속성명으로 접근 가능
  - data-user-job → dataset.userJob
  - data-id → dataset.id
- 반대로 자바스크립트 dataset에 값을 넣으면 data-속성이 생긴다.
  - dataset.monthSalary → 10000 : data-month-salary = "10000"

```html
<ul>
  <li data-id="1" data-user-job="programmer">Vicky</li>
  <li data-id="2" data-user-job="designer">Sara</li>
  <li data-id="3" data-user-job="programmer">Jone</li>
  <li data-id="4" data-user-job="ceo">Tommy</li>
</ul>
```
