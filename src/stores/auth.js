/**
 * 認証ストア
 * ログイン後のユーザー情報を Pinia の state と localStorage に保存しておき、
 * リロードしても簡易的にログイン状態を維持する実装。
 * 実務ではセッション or トークンでサーバー側と状態を共有する必要があります。
 */
import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

// API のベース URL（相対パスでよければ空文字でOK）
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export const useAuthStore = defineStore('auth', () => {
  // --- 状態 ---
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // user が null かどうかでログイン状態を判定
  const isLoggedIn = computed(() => !!user.value);

  // --- セッション初期化（アプリ起動時などに呼び出す想定） ---
  async function initSession() {
    isLoading.value = true;
    error.value = null;
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        user.value = JSON.parse(stored);
      } else {
        user.value = null;
      }
    } catch (_) {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // --- ログイン ---
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;
    try {
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください');
      }

      // /api/login?id=...&password=... に対してログインリクエスト
      const loginUrl = `${API_BASE}/api/login?id=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}`;
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.message || 'メールアドレスまたはパスワードが正しくありません';
        throw new Error(msg);
      }

      // サーバーがユーザー情報を返してくれる前提
      const data = await res.json().catch(() => ({}));
      if (!data.user) {
        throw new Error('ユーザー情報の取得に失敗しました');
      }

      user.value = data.user;
      // ログインユーザーを localStorage に保存
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      return {success: true};
    } catch (e) {
      error.value = e.message || 'ログインに失敗しました';
      return {success: false, error: error.value};
    } finally {
      isLoading.value = false;
    }
  }

  // --- 新規登録 ---
  async function register(payload) {
    isLoading.value = true;
    error.value = null;
    try {
      const {
        lastName,
        firstName,
        postalCode,
        address,
        phone,
        email,
        password,
        gender,
      } = payload;

      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください');
      }
      if (password.length < 6) {
        throw new Error('パスワードは6文字以上で入力してください');
      }

      // /api/auth/register に登録リクエスト
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          lastName,
          firstName,
          postalCode,
          address,
          phone,
          email,
          password,
          gender,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message || '登録に失敗しました';
        throw new Error(msg);
      }

      // 登録に成功したら、送信した情報をもとにそのままログイン状態にする
      user.value = {
        lastName,
        firstName,
        name: `${lastName} ${firstName}`.trim() || email,
        email,
        postalCode,
        address,
        phone,
        gender,
      };
      // 登録直後のユーザーも localStorage に保存
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      return {success: true};
    } catch (e) {
      error.value = e.message || '登録に失敗しました';
      return {success: false, error: error.value};
    } finally {
      isLoading.value = false;
    }
  }

  // --- ログアウト ---
  function logout() {
    user.value = null;
    error.value = null;
    localStorage.removeItem('auth_user');
  }

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    initSession,
    login,
    register,
    logout,
  };
});
