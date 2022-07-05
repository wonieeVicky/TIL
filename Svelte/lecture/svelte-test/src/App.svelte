<script>
  let text = "";
  let number = 3;
  let checked = false;
  let fruits = ["Apple", "Banana", "Cherry"];
  let selectedFruits = [];
  let group = "Banana";
  let textarea = "";
  let select = "";
  let multipleSelect = ["Banana", "Cherry"];
</script>

<!-- input 요소에는 양방향 데이터 바인딩을 한다. -->
<!-- let text = ''; -->
<section>
  <h2>Text</h2>
  <input type="text" bind:value={text} />
</section>

<!-- let number = 3 -->
<section>
  <h2>Number/Range</h2>
  <div>
    <input type="number" bind:value={number} min="0" max="10" />
  </div>
  <div>
    <input type="range" bind:value={number} min="0" max="10" />
  </div>
</section>

<!-- let checked = false; -->
<section>
  <h2>Checkbox</h2>
  <input type="checkbox" bind:checked /> Agree?
  <!-- label wrapping을 하면 label 클릭 시 checkbox 토글 됨 -->
  <label><input type="checkbox" bind:checked /> Agree?(label wrapping)</label>
</section>

<!-- let fruits = ["Apple", "Banana", "Cherry"]; -->
<!-- let selectedFruits = []; -->
<!-- checkbox 다중 선택 시에는 목록 데이터와 값을 담는 배열 데이터가 필요함 -->
<section>
  <h2>Checkbox 다중 선택</h2>
  <strong>Selected: {selectedFruits}</strong>
  {#each fruits as fruit}
    <!-- bind:value가 아니므로 단방향 데이터 바인딩, 즉 단순하게 값을 받아 출력하는 용도로만 사용한다는 의미이다. -->
    <!-- bing:group으로 선택한 내용이 배열에 저장된다. -->
    <label><input type="checkbox" value={fruit} bind:group={selectedFruits} /> {fruit}</label>
  {/each}
</section>

<!-- let group = "Banana"; -->
<!-- group에 문자 데이터를 넣어줘야 한다. 다중 선택일 경우에는 checkbox, 단일 선택일 경우에는 radio -->
<section>
  <h2>Radio</h2>
  <!-- 
  <input type="radio" value="Apple" name="my radio" />
  <input type="radio" value="Banana" name="my radio" />
  <input type="radio" value="Cherry" name="my radio" /> 
  -->
  <strong>Selected: {group}</strong>
  <label>
    <input type="radio" value="Apple" bind:group /> Apple
  </label>
  <label>
    <input type="radio" value="Banana" bind:group /> Banana
  </label>
  <label>
    <input type="radio" value="Cherry" bind:group /> Cherry
  </label>
</section>

<!-- let textarea = ""; -->
<section>
  <h2>Textarea</h2>
  <pre>{textarea}</pre>
  <textarea bind:value={textarea} />
</section>

<!-- let select = "Banana"; -->
<section>
  <h2>Select 단일 선택</h2>
  <strong>Selected: {select}</strong>
  <div>
    <select bind:value={select}>
      <option disabled value="">Please select one!</option>
      <option>Apple</option>
      <option>Banana</option>
      <option>Cherry</option>
    </select>
  </div>
</section>

<!-- let multipleSelect = ["Banana", "Cherry"]; -->
<!-- select 다중 선택 시에는 배열 데이터로 연결해야 한다 -->
<section>
  <h2>Select 다중 선택(Multiple)</h2>
  <strong>Selected: {multipleSelect}</strong>
  <div>
    <select multiple bind:value={multipleSelect}>
      <option disabled value="">Please select one!</option>
      <option>Apple</option>
      <option>Banana</option>
      <option>Cherry</option>
    </select>
  </div>
</section>
