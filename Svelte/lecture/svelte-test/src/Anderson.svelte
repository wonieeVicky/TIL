<script>
  import { getContext } from "svelte";
  import Neo from "./Neo.svelte";
  import Emily from "./Emily.svelte";

  const pm = getContext("pm");
</script>

<h2>Anderson({pm})</h2>
<ul>
  <li><Neo /></li>
  <li><Emily /></li>
</ul>
