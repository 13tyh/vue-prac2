<script setup>
/**
 * パスワードを忘れた場合
 * 説明文とログインへ戻るリンクのみ（再設定フォームは未実装）。
 */
</script>

<template>
  <main class="forgot">
    <div class="forgot-content">
      <h1 class="forgot-ttl">パスワードを忘れた場合</h1>
      <p class="forgot-txt">
        メールアドレスを入力すると、再設定用のリンクをお送りします。
      </p>
      <nav class="forgot-back" aria-label="ログインへ戻る">
        <RouterLink to="/" class="forgot-lnk">ログインに戻る</RouterLink>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.forgot {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--color-surface);
}

.forgot-content {
  padding: 1.25rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
}

.forgot-ttl {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.forgot-txt {
  margin: 0 0 1.5rem;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.forgot-back {
  margin: 0;
}

.forgot-lnk {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--form-accent);
  text-decoration: none;
}

.forgot-lnk:hover {
  text-decoration: underline;
}
</style>
