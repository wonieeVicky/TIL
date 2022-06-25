<script>
  let count = 0;

  // 선언
  $: double = count * 2; // double 별도 선언 불필요, let double 자동 처리

  // 블록
  $: {
    console.log("block - count:", count);
    console.log("block - double:", double);
  }

  // 함수 실행
  $: count, log(); // count가 변경되면 실행, 반드시 함수를 실행해야 한다.

  // 즉시 실행 함수(IIFE)
  $: count,
    (() => {
      console.log("iife: Vicky!");
    })();

  // 조건문(If)
  $: if (count > 0) {
    console.log("if:", double);
  }

  // 반복문(For)
  $: for (let i = 0; i < 3; i++) {
    count; // 반응성 데이터를 for문 내에 둔다.
    console.log("for:", i);
  }

  // 조건문(Switch)
  $: switch (
    count // 반응성 데이터를 switch 변수로 둔다
  ) {
    case 1:
      console.log("switch: 1");
      break;
    default:
      console.log("switch: default");
  }

  // 유효범위
  $: {
    function scope1() {
      console.log("scope1");
      function scope2() {
        console.log("scope2");
        function scope3() {
          console.log("scope3", count);
          console.log("---------");
        }
        scope3();
      }
      scope2();
    }
    scope1();
  }

  function log() {
    console.log("fn: Vicky!");
  }
  function assign() {
    count++;
  }
</script>

<button on:click={assign}>Assign!</button>
