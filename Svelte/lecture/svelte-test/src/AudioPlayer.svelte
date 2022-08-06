<script context="module">
  const players = new Set();
  export function stopAll() {
    players.forEach((p) => p.pause());
  }
</script>

<script>
  import { onMount } from "svelte";
  export let src;
  let player;

  onMount(() => [
    // Like players.push(player)
    players.add(player),
  ]);
</script>

<div>
  <audio {src} bind:this={player} constrols>
    <track kind="captions" />
  </audio>
</div>
