import {defineStore} from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || null, // 从 localStorage 中读取 token
    user: JSON.parse(localStorage.getItem('admin') || localStorage.getItem('user')) || {}
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token) // 存储 token 到 localStorage
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('admin', JSON.stringify(user))
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser() {
      this.token = null
      this.user = {}
      localStorage.removeItem('admin')
      localStorage.removeItem('user')
      localStorage.removeItem('token') // 清除 localStorage 中的 token
    }
  }
})
