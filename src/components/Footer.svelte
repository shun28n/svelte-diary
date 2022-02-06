<script>
  import { onDestroy } from "svelte";
  import { Router, Link } from "svelte-routing";
  import { userId } from "../store";
  // コンポーネントでストアの値を使用する際には入れ替えないといけない。
  let uid;
  const unsubscribe = userId.subscribe((id) => {
    uid = id;
  });
  onDestroy(() => unsubscribe);
</script>

<footer class="bg-secondary-900 text-white-900 dark:bg-dark-900 flex item-center justify-around">
  <Router>
    <Link class="block mb-3" to="/">Home</Link>
    <Link class="block mb-3" to="about">日記の効果とは？</Link>
    {#if uid}
      <Link class="block mb-3" to="create">日記を書く</Link>
    {/if}
  </Router>
</footer>

<style>
  footer {
    height: 60px;
  }
</style>
