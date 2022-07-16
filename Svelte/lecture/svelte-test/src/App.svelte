<script>
  function a() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("a");
        resolve();
      }, 1000);
    });
  }
  function b() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("b");
        resolve();
      }, 1000);
    });
  }
  function c() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("c");
        resolve();
      }, 1000);
    });
  }
  function d() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("d");
        resolve();
      }, 1000);
    });
  }

  a()
    .then(() => b())
    .then(() => c())
    .then(() => d());
</script>
