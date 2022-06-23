<script>
  loop1: for (let i = 1; i < 4; i += 1) {
    loop2: for (let k = 1; k < 4; k += 1) {
      if (i === 2) {
        break loop1;
      }
      console.log(i, k);
    }
    console.log("----------");
  }

  vicky: {
    console.log("vicky");
    break vicky;
    console.log("wonny"); // wonny는 출력하지 않는다.
  }

  // Svelte 반응성 구문!
  let count = 0;
  $: {
    console.log(count);
  }
</script>
