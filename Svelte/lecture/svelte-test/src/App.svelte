<script>
  let isError = false;
  function a() {
    return new Promise((resolve, reject) => {
      if (isError) {
        reject(new Error("Sorry.."));
      }
      setTimeout(() => {
        console.log("a");
        resolve("Vicky!");
      }, 1000);
    });
  }

  a()
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      console.log("Done");
    });

  // async function asyncFn() {
  //   try {
  //     const res = await a();
  //     console.log(res);
  //   } catch (e) {
  //     console.log(e.message);
  //   } finally {
  //     console.log("Done");
  //   }
  // }
  // asyncFn();
</script>
