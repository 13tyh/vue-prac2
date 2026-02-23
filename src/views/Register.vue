<script setup>
/**
 * 新規登録画面
 * 氏名・住所・連絡先・パスワード・性別を入力して登録。ログインへ戻るリンクあり。
 */
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import Button from '../components/ui/Button.vue';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import {useAuthStore} from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// --- フォーム状態 ---
const lastName = ref('');
const firstName = ref('');
const postalCode = ref('');
const address = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const gender = ref('');

// --- バリデーション ---
// メールアドレス
const emailError = computed(() => {
  if (!email.value) return '';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value) ? '' : '有効なメールアドレスを入力してください';
});

// パスワード
const passwordError = computed(() => {
  if (!password.value) return '';
  return password.value.length >= 6
    ? ''
    : 'パスワードは6文字以上で入力してください';
});

// 郵便番号
const postalCodeError = computed(() => {
  if (!postalCode.value) return '';
  const normalized = postalCode.value.replace(/\s/g, '');
  const ok = /^\d{3}-?\d{4}$/.test(normalized);
  return ok ? '' : '郵便番号は7桁で入力してください（例: 123-4567）';
});

// 電話番号
const phoneError = computed(() => {
  if (!phone.value) return '';
  if (!/^[\d\-]+$/.test(phone.value)) {
    return '電話番号は数字とハイフンで入力してください';
  }
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) {
    return '電話番号は10〜11桁で入力してください';
  }
  return '';
});

// 送信ボタン有効化
const canSubmit = computed(() => {
  return (
    lastName.value &&
    firstName.value &&
    postalCode.value &&
    !postalCodeError.value &&
    address.value &&
    phone.value &&
    !phoneError.value &&
    email.value &&
    !emailError.value &&
    password.value &&
    !passwordError.value &&
    gender.value
  );
});

// --- 送信 ---
async function onSubmit() {
  if (!canSubmit.value) return;
  const result = await authStore.register({
    lastName: lastName.value,
    firstName: firstName.value,
    postalCode: postalCode.value,
    address: address.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    gender: gender.value,
  });
  if (result.success) {
    router.push('/');
  }
}
</script>

<template>
  <main class="register">
    <header class="register-hdr">
      <button
        type="button"
        class="register-back"
        aria-label="ログインに戻る"
        @click="router.push('/')"
      >
        <span class="material-icons" aria-hidden="true">arrow_back</span>
      </button>
      <div class="register-hdr-inner">
        <h1 class="register-ttl">新規登録</h1>
      </div>
    </header>
    <div v-if="authStore.error" class="register-err" role="alert">
      {{ authStore.error }}
    </div>
    <form class="register-frm" @submit.prevent="onSubmit">
      <div class="register-inner">
        <div class="register-row register-row--flex">
          <FormGroup label="姓" html-for="reg-lastname">
            <Input
              id="reg-lastname"
              v-model="lastName"
              type="text"
              name="lastName"
              placeholder="山田"
              required
            />
          </FormGroup>
          <FormGroup label="名" html-for="reg-firstname">
            <Input
              id="reg-firstname"
              v-model="firstName"
              type="text"
              name="firstName"
              placeholder="太郎"
              required
            />
          </FormGroup>
        </div>
        <FormGroup
          label="郵便番号"
          html-for="reg-postal"
          :error="postalCodeError"
        >
          <div class="register-half">
            <Input
              id="reg-postal"
              v-model="postalCode"
              type="text"
              name="postalCode"
              placeholder="123-4567"
              inputmode="numeric"
              :invalid="!!postalCodeError"
            />
          </div>
        </FormGroup>
      </div>
      <div class="register-body">
        <FormGroup label="住所" html-for="reg-address">
          <Input
            id="reg-address"
            v-model="address"
            type="text"
            name="address"
            placeholder="東京都渋谷区..."
          />
        </FormGroup>
        <FormGroup label="電話番号" html-for="reg-phone" :error="phoneError">
          <Input
            id="reg-phone"
            v-model="phone"
            type="tel"
            name="phone"
            placeholder="090-1234-5678"
            :invalid="!!phoneError"
          />
        </FormGroup>
        <FormGroup
          label="メールアドレス"
          html-for="reg-email"
          :error="emailError"
        >
          <Input
            id="reg-email"
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
          html-for="reg-password"
          :error="passwordError"
        >
          <Input
            id="reg-password"
            v-model="password"
            type="password"
            name="password"
            placeholder="6文字以上"
            :invalid="!!passwordError"
            required
          />
        </FormGroup>
        <FormGroup label="性別" class="register-gender">
          <div class="register-gender-tabs" role="radiogroup">
            <label
              class="register-gender-tab"
              :class="{'register-gender-tab--checked': gender === 'male'}"
            >
              <input
                v-model="gender"
                type="radio"
                name="gender"
                value="male"
                class="register-gender-input"
              />
              <span class="register-gender-label">男性</span>
            </label>
            <label
              class="register-gender-tab"
              :class="{'register-gender-tab--checked': gender === 'female'}"
            >
              <input
                v-model="gender"
                type="radio"
                name="gender"
                value="female"
                class="register-gender-input"
              />
              <span class="register-gender-label">女性</span>
            </label>
          </div>
        </FormGroup>
        <div class="register-terms">
          <RouterLink to="/terms" class="register-terms-lnk">規約</RouterLink>
        </div>
        <Button
          type="submit"
          variant="primary"
          :loading="authStore.isLoading"
          :disabled="!canSubmit"
          full-width
        >
          登録する
        </Button>
      </div>
    </form>
    <nav class="register-lnk" aria-label="ログインへ">
      <button type="button" class="register-lnk-btn" @click="router.push('/')">
        ログインはこちら
      </button>
    </nav>
  </main>
</template>

<style scoped>
.register {
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  background: var(--color-surface);
  box-sizing: border-box;
}

.register-inner {
  max-width: 335px;
  width: 100%;
  margin: 0 auto 1rem;
  padding: 1rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
}

.register-hdr {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.register-back {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: var(--form-placeholder);
  background: var(--form-bg);
  border: 1px solid var(--form-border);
  cursor: pointer;
  border-radius: 50%;
  font-family: inherit;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.2s ease;
}

.register-back:hover {
  background: var(--form-accent-soft);
  color: var(--form-accent);
  border-color: var(--form-border-hover);
}

.register-back:active {
  transform: scale(0.95);
}

.register-back .material-icons {
  font-size: 1.25rem;
}

.register-hdr-inner {
  flex: 1;
  min-width: 0;
}

.register-ttl {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.register-stl {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.register-err {
  margin-bottom: 1.25rem;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md, 14px);
}

.register-frm {
  display: flex;
  flex-direction: column;
}

.register-row {
  margin-bottom: 0;
}

.register-row--flex {
  display: flex;
  gap: 12px;
  margin-bottom: 0;
}

.register-row--flex .form-group {
  flex: 1 1 0;
  min-width: 0;
  margin-bottom: 1.25rem;
}

.register-row--flex .form-group:only-child,
.register-row--flex .register-col {
  flex: 1 1 0;
  min-width: 0;
}

.register-half {
  width: calc(50% - 6px);
}

.register-body {
  max-width: 335px;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 14px);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
}

.register-body .form-group {
  margin-bottom: 1.25rem;
}

.register-body .form-group:last-of-type {
  margin-bottom: 1.5rem;
}

.register-gender .form-group__control {
  margin-top: 0.5rem;
}

.register-gender-tabs {
  display: flex;
  width: 100%;
  background: var(--form-bg);
  border-radius: var(--radius-md, 14px);
  padding: 5px;
  gap: 0;
  border: 1px solid var(--form-border);
}

.register-gender-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--form-placeholder);
  user-select: none;
  border-radius: 10px;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
  position: relative;
}

.register-gender-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.register-gender-label {
  white-space: nowrap;
}

.register-gender-tab--checked {
  background: var(--form-accent);
  color: #fff;
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.3);
}

.register-terms {
  margin: 0 0 1rem;
  font-size: 0.875rem;
}

.register-terms-lnk {
  font-weight: 500;
  color: var(--form-accent);
  text-decoration: none;
}

.register-terms-lnk:hover {
  text-decoration: underline;
  color: var(--form-accent-hover);
}

.register-lnk {
  margin: 1.5rem 0 0;
  text-align: center;
}

.register-lnk-btn {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--form-accent);
  background: var(--form-accent-soft);
  border: 1px solid var(--form-accent);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  border-radius: var(--radius-md, 14px);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.register-lnk-btn:hover {
  color: #fff;
  background: var(--form-accent-hover);
  border-color: var(--form-accent-hover);
}
</style>
