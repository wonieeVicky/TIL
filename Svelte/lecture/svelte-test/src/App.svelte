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
