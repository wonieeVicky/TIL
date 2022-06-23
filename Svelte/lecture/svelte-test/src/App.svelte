<script>
  let user = {
    name: "Vicky",
    depth: {
      a: "b",
    },
    numbers: [1, 2],
  };

  let numbers = user.numbers;

  function assign() {
    // user.name = "Wonny";
    // user.depth.a = "c";
    user.numbers.push(3);
    numbers = numbers;
  }
</script>

<button on:click={assign}>Assign!</button>
<h2>user name: {user.name}</h2>
<h2>user depth a: {user.depth.a}</h2>
<h2>user numbers: {user.numbers}</h2>
<h2>numbers: {numbers}</h2>
