<script>
  import { getContext, setContext } from "svelte";

  import Anderson from "./Anderson.svelte";
  const pocketMoney = 10000;
  setContext("pm", pocketMoney);

  const pm = getContext("pm");
</script>

<h1 style="color:red">Vicky({pm})</h1>
<ul><li><Anderson /></li></ul>
