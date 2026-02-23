<script setup>
/**
 * アプリのルート
 * ログイン中はウェルカム画面、未ログイン時は RouterView でログイン/登録/ホームなどをスライド表示。
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import Button from './components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isLoggedIn, user } = storeToRefs(authStore)

// ログインへ戻る: 左から / それ以外: 右からスライド
const slideName = computed(() => {
  if (route.path === '/') return 'slide-from-left'
  return 'slide-from-right'
})

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <template v-if="isLoggedIn">
      <main class="app-welcome">
        <div class="app-welcome-icon">👋</div>
        <p class="app-welcome-txt">ようこそ、<strong>{{ user?.name }}</strong> さん</p>
        <Button variant="outline" @click="logout">ログアウト</Button>
      </main>
    </template>
    <template v-else>
      <div class="app-slide">
        <RouterView v-slot="{ Component }">
          <Transition :name="slideName" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-card);
  border-radius: 0;
}

.app-slide {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.app-slide > * {
  width: 100%;
  min-height: 100vh;
}

/* 新規登録・ホームへ: 右からスライドイン */
.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-from-right-enter-from {
  transform: translateX(100%);
}

.slide-from-right-enter-to {
  transform: translateX(0);
}

.slide-from-right-leave-from {
  transform: translateX(0);
}

.slide-from-right-leave-to {
  transform: translateX(-100%);
}

/* ログインへ戻る: 左からスライドイン */
.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-from-left-enter-from {
  transform: translateX(-100%);
}

.slide-from-left-enter-to {
  transform: translateX(0);
}

.slide-from-left-leave-from {
  transform: translateX(0);
}

.slide-from-left-leave-to {
  transform: translateX(100%);
}

.app-welcome {
  text-align: center;
  padding: 2rem 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  background: var(--color-surface-card);
  border-radius: var(--radius-lg, 20px);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
}

.app-welcome-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.app-welcome-txt {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  color: var(--color-text);
}

.app-welcome-txt strong {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
