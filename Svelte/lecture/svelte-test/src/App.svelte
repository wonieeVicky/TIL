<script>
  import Jinny from "./Jinny.svelte";
  import Wonny from "./Wonny.svelte";

  let components = [
    { name: "Jinny", comp: Jinny },
    { name: "Wonny", comp: Wonny },
  ];
  let index = 1;
  let selected = components[0].comp;
</script>

{#each components as { name, comp }, i (name)}
  <label>
    <input type="radio" value={comp} bind:group={selected} on:change={() => (index = i + 1)} />
    {name}
  </label>
{/each}

<svelte:component this={selected} {index} />
