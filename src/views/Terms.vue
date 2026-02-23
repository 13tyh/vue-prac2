<script setup>
/**
 * 利用規約画面
 * 規約本文と新規登録へ戻るリンク。
 */
</script>

<template>
  <main class="terms">
    <h1 class="terms-ttl">利用規約</h1>
    <div class="terms-body">
      <p>利用規約の内容がここに表示されます。</p>
    </div>
    <nav class="terms-back" aria-label="新規登録に戻る">
      <RouterLink to="/register" class="terms-lnk">新規登録に戻る</RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.terms {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background: var(--color-surface);
}

.terms-ttl {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.terms-body {
  margin: 0 0 1.5rem;
  padding: 1.25rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.terms-back {
  margin: 0;
}

.terms-lnk {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.terms-lnk:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
