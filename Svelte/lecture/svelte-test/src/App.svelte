<script>
  import UserCard from "./UserCard.svelte";
</script>

<UserCard>
  <h2 slot="name">VICKY</h2>
  <div slot="age">33</div>
  <div slot="email">hwfongfing@gmail.com</div>
</UserCard>

<UserCard>
  <h2 slot="name">WONNY</h2>
  <div slot="email">fongfing@uneedcomms.com</div>
  <div>adfadf</div>
</UserCard>

<UserCard>
  <h2 slot="name">TEDDY</h2>
  <div>아무 말이나 적어본다.</div>
</UserCard>
