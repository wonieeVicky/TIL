<script>
  let active = true
  let test = true
  let valid = false
  let camelCase = true

  function multi() {
    return 'active multiple-class'
  }
</script>

<div class={active ? 'active' : ''}>3항 연산자 보간</div>

<div class:active={test}>Class 지시어(Directive) 바인딩</div>

<!-- <div class:active={active}>Class 지시어 바인딩 단축 형태</div> -->
<div class:active>Class 지시어 바인딩 단축 형태</div>

<!-- camelCase dashCase, snackCase 등은 아래처럼 각각 처리할 수 있다.-->
<!-- valid는 false이므로 추가되지 않음 -->
<div class:active class:valid class:camelCase class:camel-case={camelCase}>다중(Mutiple) Class 지시어 바인딩</div>

<!-- <div class="active multiple-class">함수 실행</div> 로 도출된다. -->
<div class={multi()}>함수 실행</div>
