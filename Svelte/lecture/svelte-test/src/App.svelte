<div class="box" />

<style>
  :global(body) {
    padding: 60px;
  }
  .box {
    width: 100px;
    height: 100px;
    background: tomato;
    border-radius: 10px;
    animation: zoom 0.4s infinite alternate;
  }
  /* @ At-rules */
  @keyframes -global-zoom {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }
</style>
