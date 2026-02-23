/**
 * ルート定義
 * / ログイン, /register 新規登録, /home ホーム, /freelance フリーランス一覧, /forgot-password パスワード忘れ, /terms 利用規約
 */
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import FreelanceList from '../views/FreelanceList.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Terms from '../views/Terms.vue'

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/freelance', name: 'freelance', component: FreelanceList },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPassword },
  { path: '/terms', name: 'terms', component: Terms }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
