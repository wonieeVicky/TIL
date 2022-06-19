## 보간법

### 내용/속성/표현식 보간

보간법은 쉽게 말해 `svelte` 파일의 `html` 구조에서 변수 데이터를 쓰는 방식을 의미한다.
`{name}` 이라고 적으면 `name` 변수를 html에 보간할 수 있다고해서 보간법이라고 부른다.

```html
<script>
  let href = "https://github.com/wonieeVicky";
  let name = "Vicky";
  let value = "New input value!";
  let isUpperCase = false;
</script>

<!-- <a href="https://github.com/wonieeVicky">Vicky</a> -->
<a {href}>{name}</a>

<!-- <input type="text" value="Default value.." /> -->
<!-- input 단방향 -->
<input {value} on:input={(e) => (value = e.target.value)} />
<!-- input 양방향 -->
<!-- <input bind:value={value} /> -->
<input bind:value />

<!-- 보간법에서는 표현식도 직접 적어넣을 수 있다. 권장되는 방법 -->
<div>{isUpperCase ? "DIV" : "div"}</div>
```

단방향/양방향 이벤트 바인딩에 따라 데이터 처리 방법이 바뀌므로 참고하자!
리액트에서와 마찬가지로 보간법을 사용해 표현식도 추가해서 넣을 수 있는데 스벨트에서는 별도의 코드 번들링을 처리하지 않고 그대로 파싱해넣으므로, 권장되는 방법 중에 하나이다.
