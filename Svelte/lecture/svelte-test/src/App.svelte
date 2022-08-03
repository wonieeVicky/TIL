<script>
  // getContext & setContext
  import { getContext } from "svelte";
  import Vicky from "./Vicky.svelte";
  import Lewis from "./Lewis.svelte";
  import Evan from "./Evan.svelte";

  const pm = getContext("pm");
</script>

<h1>App({pm})</h1>
<div>
  <Vicky />
  <Lewis />
  <Evan />
</div>

<style>
  h1 {
    font-size: 50px;
  }
  div {
    padding-left: 50px;
  }
</style>
