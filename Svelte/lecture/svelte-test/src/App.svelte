<script>
  import { onMount } from "svelte";

  import Vicky from "./Vicky.svelte";
  let vicky;

  onMount(() => {
    console.log(vicky); // Vicky{$$: {}, $$set: f, $capture_stste: f, ...}
    console.log(vicky.title); // Error: Props cannot be read directly ... -> 스벨트는 컴포넌트 내 데이터에 접근하는 것을 기본적으로 막는다.(accessors를 사용하면 접근가능)
  });
</script>

<Vicky title="Good!" bind:this={vicky} />
