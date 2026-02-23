<script setup>
/**
 * ホーム画面
 * ウェルカム・クイックリンク・特徴・フッターリンクのセクション構成。
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const { isLoggedIn, user } = storeToRefs(authStore)

// 表示用の名前（姓名 or name）
const displayName = computed(() => {
  if (!user.value) return ''
  if (user.value.lastName && user.value.firstName) {
    return `${user.value.lastName} ${user.value.firstName}`
  }
  return user.value.name || ''
})

// クイックリンク（ログイン状態で出し分け）
const quickLinks = computed(() => {
  const links = [
    { to: '/freelance', label: 'フリーランス一覧', desc: '登録メンバーを一覧で見る' }
  ]
  if (!isLoggedIn.value) {
    links.push({ to: '/', label: 'ログイン', desc: 'アカウントでサインイン' })
    links.push({ to: '/register', label: '新規登録', desc: '会員登録する' })
  }
  return links
})
</script>

<template>
  <main class="home">
    <!-- ヘッダー -->
    <header class="home-hdr">
      <div class="home-hdr-spacer" />
      <div class="home-hdr-right">
        <template v-if="isLoggedIn">
          <span class="home-user">{{ displayName }} さん</span>
        </template>
        <template v-else>
          <RouterLink to="/" class="home-lnk">ログイン</RouterLink>
        </template>
      </div>
    </header>

    <!-- ヒーロー（ウェルカム） -->
    <section class="home-hero">
      <h1 class="home-ttl">
        {{ isLoggedIn ? `${displayName} さん、ようこそ` : 'ようこそ' }}
      </h1>
      <p class="home-hero-txt">
        {{ isLoggedIn ? 'いつもご利用ありがとうございます。' : 'ログインせずに閲覧もできます。会員登録でより便利に。' }}
      </p>
    </section>

    <!-- クイックリンク -->
    <section class="home-section">
      <h2 class="home-section-ttl">メニュー</h2>
      <nav class="home-cards" aria-label="メニュー">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="home-card"
        >
          <span class="home-card-label">{{ link.label }}</span>
          <span class="home-card-desc">{{ link.desc }}</span>
        </RouterLink>
      </nav>
    </section>

    <!-- このアプリについて -->
    <section class="home-section">
      <h2 class="home-section-ttl">このアプリについて</h2>
      <ul class="home-features">
        <li class="home-features-item">
          <span class="home-features-icon">👥</span>
          <span>フリーランスのプロフィールを一覧で閲覧できます。</span>
        </li>
        <li class="home-features-item">
          <span class="home-features-icon">📝</span>
          <span>会員登録でログインし、利用を続けられます。</span>
        </li>
        <li class="home-features-item">
          <span class="home-features-icon">📱</span>
          <span>シンプルな画面で、スマホでも使いやすく。</span>
        </li>
      </ul>
    </section>

    <!-- フッターリンク -->
    <footer class="home-footer">
      <RouterLink to="/terms" class="home-footer-lnk">利用規約</RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.home {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 2rem;
  box-sizing: border-box;
  background-color: var(--color-surface);
}

/* --- ヘッダー --- */
.home-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.home-hdr-spacer {
  flex: 1;
}

.home-hdr-right {
  flex-shrink: 0;
}

.home-user {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.home-lnk {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm, 10px);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.home-lnk:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
  text-decoration: none;
}

/* --- ヒーロー --- */
.home-hero {
  margin-bottom: 2rem;
}

.home-ttl {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.3;
}

.home-hero-txt {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* --- セクション共通 --- */
.home-section {
  margin-bottom: 2rem;
}

.home-section-ttl {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

/* --- カード（クイックリンク） --- */
.home-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-card {
  display: block;
  padding: 1rem 1.25rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.home-card:hover {
  border-color: var(--form-accent);
  background: var(--form-accent-soft);
  box-shadow: var(--shadow-card);
}

.home-card-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.home-card-desc {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* --- 特徴リスト --- */
.home-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-features-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface-card);
  border-radius: var(--radius-md, 14px);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  border: 1px solid var(--color-border);
}

.home-features-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  line-height: 1;
}

/* --- フッター --- */
.home-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.home-footer-lnk {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.home-footer-lnk:hover {
  color: var(--form-accent);
  text-decoration: underline;
}
</style>
