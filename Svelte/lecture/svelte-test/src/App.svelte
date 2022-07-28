<script>
  import User from "./User.svelte";
  import Vicky from "./Vicky.svelte";

  let users = [
    { name: "Vicky", age: 33, email: "hwfongfing@gmail.com" },
    { name: "Wonny", age: 32, email: "fongfing@gmail.com" },
    { name: "Evan", age: 31 },
  ];
</script>

<section>
  {#each users as user}
    <User name={user.name} age={user.age} email={user.email} />
  {/each}
</section>

<section>
  {#each users as { name, age, email }}
    <User {name} {age} {email} />
  {/each}
</section>

<section>
  {#each users as user}
    <User {...user} />
  {/each}
</section>
