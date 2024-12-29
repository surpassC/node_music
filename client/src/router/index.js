import {createRouter, createWebHistory} from 'vue-router'
import Auth from '../components/Auth.vue'
import MusicListManager from '../components/MusicListManager.vue'
import GenreManagement from '../components/GenreManagement.vue'
import AudioVisualizer from '../components/AudioVisualizer.vue'
import {useStore} from '../stores/useStore' 
import ComposerManagement from '../components/ComposerManagement.vue'
import MusicList from '../components/MusicList.vue'
import D3Chart from '../components/D3Chart.vue'
import Analysis from '../components/Analysis.vue'
import Map from '../components/Map.vue'
const routes = [
  {path: '/', component: Auth},
  {path: '/music', component: MusicListManager},
  {path: '/musicList', component: MusicList},
  {path: '/genres', component: GenreManagement},
  {path: '/visualizer', component: AudioVisualizer},
  {path: '/composers', component: ComposerManagement},
  {path: '/d3chart', component: D3Chart},
  {path: '/analysis', component: Analysis},
  {path: '/map', component: Map}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = !!store.token // 检查用户是否已登录

  if (to.path === '/' || to.path === '/register') {
    if (isAuthenticated) {
      next() // 已登录用户重定向到音乐列表
    } else {
      next() // 允许访问登录和注册页面
    }
  } else {
    next() // 允许访问其他页面
  }
})

export default router
