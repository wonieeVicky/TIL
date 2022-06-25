<script>
  import { tick } from "svelte";

  let count = 0;
  let double = 0;

  $: {
    double = count * 2; // count 가 반응성을 가지므로 count가 변경될 때 double의 값도 바뀌게 됨
    console.log("double!");
  }

  // $: double = count * 2;
  async function assign() {
    count++;
    console.time("timer");
    await tick();
    console.timeEnd("timer");
    console.log(double);
  }
</script>

<button on:click={assign}>Assign!</button>
<h2>{count}</h2>
<h2>{double}</h2>
