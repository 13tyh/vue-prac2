<script setup>
/**
 * フリーランス一覧画面
 * public/freelance.json を取得して一覧表示。画像は image があれば表示、なければ初期画像。ページネーションで移動可能。
 */
import { ref, computed, onMounted } from 'vue'

const PER_PAGE = 5
/** 画像がない場合・読み込み失敗時に表示する初期画像 */
const DEFAULT_AVATAR = '/default-avatar.svg'

const list = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)

// 表示するページのデータ（現在ページのみ）
const displayedList = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return list.value.slice(start, start + PER_PAGE)
})

// 総ページ数
const totalPages = computed(() => Math.max(1, Math.ceil(list.value.length / PER_PAGE)))

// 前へ
function goPrev() {
  if (currentPage.value <= 1) return
  currentPage.value--
}

// 次へ
function goNext() {
  if (currentPage.value >= totalPages.value) return
  currentPage.value++
}

// 指定ページへ
function goToPage(page) {
  const p = Number(page)
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

// 画像読み込み失敗時に初期画像へ差し替え
function onImageError(e) {
  e.target.src = DEFAULT_AVATAR
}

onMounted(async () => {
  try {
    const res = await fetch('/freelance.json')
    if (!res.ok) throw new Error('読み込みに失敗しました')
    const data = await res.json()
    list.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e.message || '一覧を取得できませんでした'
    list.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="freelance-list">
    <header class="freelance-list-hdr">
      <div class="freelance-list-hdr-spacer" />
      <nav class="freelance-list-hdr-right" aria-label="ホームへ">
        <RouterLink to="/home" class="freelance-list-lnk">ホーム</RouterLink>
      </nav>
    </header>
    <h1 class="freelance-list-ttl">フリーランス一覧</h1>
    <p v-if="loading" class="freelance-list-msg">読み込み中...</p>
    <p v-else-if="error" class="freelance-list-err" role="alert">{{ error }}</p>
    <template v-else>
      <p class="freelance-list-count">{{ list.length }}件（{{ currentPage }} / {{ totalPages }} ページ）</p>
      <ul class="freelance-list-items">
        <li
          v-for="person in displayedList"
          :key="person.id"
          class="freelance-list-item"
        >
          <div class="freelance-list-item-thumb">
            <img
              :src="person.image || DEFAULT_AVATAR"
              :alt="person.name"
              class="freelance-list-item-img"
              @error="onImageError"
            >
          </div>
          <div class="freelance-list-item-body">
            <div class="freelance-list-item-name">{{ person.name }}</div>
            <div class="freelance-list-item-role">{{ person.role }}</div>
            <p class="freelance-list-item-bio">{{ person.bio }}</p>
          </div>
        </li>
      </ul>
      <nav class="freelance-list-pagination" aria-label="ページネーション">
        <button
          type="button"
          class="freelance-list-pagination-btn"
          :disabled="currentPage <= 1"
          aria-label="前のページ"
          @click="goPrev"
        >
          前へ
        </button>
        <span class="freelance-list-pagination-pages">
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="freelance-list-pagination-num"
            :class="{ 'freelance-list-pagination-num--current': p === currentPage }"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
        </span>
        <button
          type="button"
          class="freelance-list-pagination-btn"
          :disabled="currentPage >= totalPages"
          aria-label="次のページ"
          @click="goNext"
        >
          次へ
        </button>
      </nav>
    </template>
  </main>
</template>

<style scoped>
.freelance-list {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--color-surface);
}

.freelance-list-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.freelance-list-hdr-spacer {
  flex: 1;
}

.freelance-list-hdr-right {
  flex-shrink: 0;
}

.freelance-list-lnk {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm, 10px);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.freelance-list-lnk:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary-hover);
  text-decoration: none;
}

.freelance-list-ttl {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.freelance-list-msg,
.freelance-list-err {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.freelance-list-err {
  color: var(--color-error);
}

.freelance-list-count {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.freelance-list-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.freelance-list-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
  box-sizing: border-box;
}

.freelance-list-item-thumb {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--form-bg);
}

.freelance-list-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.freelance-list-item-body {
  flex: 1;
  min-width: 0;
}

.freelance-list-item-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.freelance-list-item-role {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--form-accent);
  margin-bottom: 0.5rem;
}

.freelance-list-item-bio {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.freelance-list-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.freelance-list-pagination-btn {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--form-accent);
  background: none;
  border: 1px solid var(--form-accent);
  border-radius: var(--radius-sm, 10px);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.freelance-list-pagination-btn:hover:not(:disabled) {
  background: var(--form-accent-soft);
  color: var(--form-accent-hover);
  border-color: var(--form-accent-hover);
}

.freelance-list-pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.freelance-list-pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.freelance-list-pagination-num {
  min-width: 2rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text);
  background: var(--form-bg);
  border: 1px solid var(--form-border);
  border-radius: var(--radius-sm, 10px);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.freelance-list-pagination-num:hover {
  border-color: var(--form-accent);
  background: var(--form-accent-soft);
}

.freelance-list-pagination-num--current {
  background: var(--form-accent);
  color: #fff;
  border-color: var(--form-accent);
}

.freelance-list-pagination-num--current:hover {
  background: var(--form-accent-hover);
  border-color: var(--form-accent-hover);
  color: #fff;
}
</style>
