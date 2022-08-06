<script>
  import AudioPlayer, { stopAll } from "./AudioPlayer.svelte";
  let audioTracks = [
    "https://sveltejs.github.io/assets/music/strauss.mp3",
    "https://sveltejs.github.io/assets/music/holst.mp3",
    "https://sveltejs.github.io/assets/music/satie.mp3",
  ];
</script>

<button on:click={stopAll}>Stop all!</button>
{#each audioTracks as src}
  <AudioPlayer {src} />
{/each}
