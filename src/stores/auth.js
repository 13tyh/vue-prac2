/**
 * 認証ストア
 * クッキー / セッション / トークン / localStorage なしのシンプルな「その場だけログイン」実装。
 * 実務では必ずセッション or トークンで認証状態をサーバー側と共有する必要がありますが、
 * ここでは書き方のイメージ用に、API を呼んで state にだけ保持する形にしています。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// API のベース URL（相対パスでよければ空文字でOK）
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

// --- 現在のログインユーザーを取得 ---
async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE}/api/auth/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      // 本来ならここに Authorization ヘッダーや cookie が必要
    },
  })

  if (!res.ok) {
    throw new Error('ユーザー情報の取得に失敗しました')
  }

  const data = await res.json()
  return data // { id, name, email, ... } を想定
}

export const useAuthStore = defineStore('auth', () => {
  // --- 状態 ---
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // user が null かどうかでログイン状態を判定
  const isLoggedIn = computed(() => !!user.value)

  // --- セッション初期化（アプリ起動時などに呼び出す想定） ---
  async function initSession() {
    isLoading.value = true
    error.value = null
    try {
      const me = await fetchCurrentUser()
      user.value = me
    } catch (_) {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // --- ログイン ---
  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください')
      }

      // /api/auth/login に対してログインリクエスト
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.message || 'メールアドレスまたはパスワードが正しくありません'
        throw new Error(msg)
      }

      // サーバーがユーザー情報を返してくれる前提
      const data = await res.json().catch(() => ({}))
      if (!data.user) {
        throw new Error('ユーザー情報の取得に失敗しました')
      }

      user.value = data.user
      return { success: true }
    } catch (e) {
      error.value = e.message || 'ログインに失敗しました'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // --- 新規登録 ---
  async function register(payload) {
    isLoading.value = true
    error.value = null
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
      } = payload

      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください')
      }
      if (password.length < 6) {
        throw new Error('パスワードは6文字以上で入力してください')
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
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.message || '登録に失敗しました'
        throw new Error(msg)
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
      }
      return { success: true }
    } catch (e) {
      error.value = e.message || '登録に失敗しました'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // --- ログアウト ---
  // セッション・トークンを使っていないので、クライアントの状態を消すだけで十分
  function logout() {
    user.value = null
    error.value = null
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
  }
})
