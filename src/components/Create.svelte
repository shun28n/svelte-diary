<script>
  import { onDestroy } from "svelte";
  import { Slider, TextField, Button } from "smelte";
  import { userId } from "../store";
  import { postDiary } from "../helpers/api";

  let uid = null;
  const unsubscribe = userId.subscribe((id) => (uid = id));

  let rate = 5;
  let body = "";
  let image = "";
  let preview = "";

  const submit = async () => {
    if (body.length < 10) {
      alert("日記の内容は10文字以上書いてください。");
      return false;
    }
    // ここにfirebaseへPOSTする関数を呼び出す処理を書く
    console.log(uid, body, rate, image);
    const result = await postDiary(uid, body, rate, image);
    if (!result) {
      alert("日記の追加が失敗しました。");
    } else {
      alert("日記が保存されました。");
      document.location.href = "/";
    }
  };

  onDestroy(() => {
    unsubscribe;
  });

  // e イベントを取得する
  const onFileSelect = (e) => {
    // 画像本体を取得、imageへ
    let target = e.target.files[0];
    image = target;
    let reader = new FileReader();
    reader.readAsDataURL(target);
    reader.onload = (e) => {
      // target.result でプレビュー画像を表示できる
      preview = e.target.result;
    };
  };
</script>

<h3>日記を書こう</h3>
<form on:submit|preventDefault={submit} class="p-5">
  <p class="mb-4">今日の気分は{rate}点です。</p>
  <Slider class="mb-4" min="1" max="10" bind:value={rate} />
  <TextField
    label="日記の本文"
    class="bg-white-400"
    bind:value={body}
    textarea
    rows="5"
    outlined
  />
  {#if preview}
    <img src={preview} alt="preview" class="mb-6" />
  {/if}
  <label for='file-input' class='bg-primary-900 text-white-900 dark:bg-dark-800 px-4 py-3 block w-4/12 m-auto rounded mb-6'>画像を選択</label> 
  <input
    type="file"
    accept="image/*"
    id = 'file-input'
    class = 'hidden'
    bind:this={image}
    on:change={(e) => onFileSelect(e)}
  />
  <Button type="submit" class="text-white-900 dark:bg-accent-500 dark:text-black">日記を保存</Button>
</form>
