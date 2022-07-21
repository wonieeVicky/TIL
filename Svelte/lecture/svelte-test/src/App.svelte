<script>
  import { apikey } from "./auth.ts";
  import axios from "axios";
  let title = "";
  let movies = null;
  let error = null;
  let loading = false;

  async function searchMovies() {
    if (loading) return; // 중복 클릭 방지 용도로 조건 추가
    movies = null;
    error = null;
    loading = true;
    try {
      const res = await axios.get(`http://www.omdbapi.com/?apikey=${apikey}&s=${title}`);
      movies = res.data.Search;
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }
</script>

<input type="text" bind:value={title} />
<button on:click={searchMovies}>검색!</button>

{#if loading}
  <p style="color: royalblue;">Loading</p>
{:else if error}
  <p style="color: red;">{error.message}</p>
{:else if movies}
  <ul>
    {#each movies as movie}
      <li>{movie.Title}</li>
    {/each}
  </ul>
{/if}
