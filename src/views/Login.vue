<script setup>
/**
 * ログイン画面
 * メール・パスワードでサインイン。新規登録・ゲスト利用へのリンクあり。
 */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/ui/Button.vue';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// --- フォーム状態 ---
const email = ref('');
const password = ref('');
const showPassword = ref(false);

// --- バリデーション ---
const emailError = computed(() => {
  if (!email.value) return '';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value) ? '' : '有効なメールアドレスを入力してください';
});

const passwordError = computed(() => {
  if (!password.value) return '';
  return password.value.length >= 6
    ? ''
    : 'パスワードは6文字以上で入力してください';
});

// 送信ボタン有効化: 全項目入力済みかつエラーなし
const canSubmit = computed(() => {
  return (
    email.value && password.value && !emailError.value && !passwordError.value
  );
});

// --- 送信 ---
async function onSubmit() {
  if (!canSubmit.value || authStore.isLoading) return;
  const result = await authStore.login(email.value, password.value);
  if (result.success) {
    email.value = '';
    password.value = '';
  }
}
</script>

<template>
  <main class="login">
    <header class="login-hdr">
      <h1 class="login-ttl">ログイン</h1>
      <p class="login-stl">アカウントにサインインしてください</p>
    </header>
    <div v-if="authStore.error" class="login-err" role="alert">
      {{ authStore.error }}
    </div>
    <form class="login-frm" @submit.prevent="onSubmit">
      <FormGroup
        label="メールアドレス"
        html-for="login-email"
        :error="emailError"
      >
        <Input
          id="login-email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          :invalid="!!emailError"
          required
        />
      </FormGroup>
      <FormGroup
        label="パスワード"
        html-for="login-password"
        :error="passwordError"
      >
        <div class="login-pwd">
          <Input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            placeholder="6文字以上"
            :invalid="!!passwordError"
            required
          />
          <button
            type="button"
            class="login-pwd-btn"
            :aria-label="showPassword ? 'パスワードを隠す' : 'パスワードを表示'"
            @click="showPassword = !showPassword"
          >
            <span class="material-icons" aria-hidden="true">
              {{ showPassword ? 'visibility' : 'visibility_off' }}
            </span>
          </button>
        </div>
      </FormGroup>
      <RouterLink to="/forgot-password" class="login-forgot">
        パスワードを忘れた場合
      </RouterLink>
      <Button
        type="submit"
        variant="primary"
        :loading="authStore.isLoading"
        :disabled="!canSubmit"
        full-width
      >
        ログイン
      </Button>
    </form>
    <button
      type="button"
      class="login-lnk login-lnk--pill"
      @click="router.push('/register')"
    >
      新規登録はこちら
    </button>
    <button
      type="button"
      class="login-lnk login-lnk--sec"
      @click="router.push('/home')"
    >
      ログインせずに利用する
    </button>
  </main>
</template>

<style scoped>
.login {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--color-surface);
}

.login-hdr {
  margin-bottom: 2rem;
  text-align: center;
}

.login-ttl {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.login-stl {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  font-weight: 400;
  letter-spacing: 0.01em;
}

.login-err {
  margin-bottom: 1.25rem;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md, 14px);
}

.login-frm {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
}

.login-forgot {
  display: block;
  margin: -0.5rem 0 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--form-accent);
  text-decoration: none;
  text-align: right;
}

.login-forgot:hover {
  text-decoration: underline;
  color: var(--form-accent-hover);
}

.login-pwd {
  position: relative;
  width: 100%;
}

.login-pwd :deep(.input) {
  padding-right: 2.75rem;
}

.login-pwd-btn {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--form-placeholder);
  cursor: pointer;
  border-radius: var(--radius-sm, 10px);
  transition: color 0.2s ease;
}

.login-pwd-btn:hover {
  color: var(--form-accent);
}

.login-pwd-btn .material-icons {
  font-size: 1.25rem;
}

.login-lnk {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--form-accent);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
}

.login-lnk:hover {
  color: var(--form-accent-hover);
}

.login-lnk--pill {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-md, 14px);
  text-decoration: none;
  text-align: center;
  color: #fff;
  background: linear-gradient(180deg, var(--form-accent) 0%, var(--form-accent-hover) 100%);
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.login-lnk--pill:hover {
  background: linear-gradient(180deg, var(--form-accent-hover) 0%, #4c1d95 100%);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 14px rgba(109, 40, 217, 0.4);
  text-decoration: none;
}

.login-lnk--sec {
  display: block;
  margin-top: 0.75rem;
  width: 100%;
  text-align: center;
  color: var(--color-text-muted);
  font-weight: 400;
}

.login-lnk--sec:hover {
  color: var(--color-text);
}
</style>
