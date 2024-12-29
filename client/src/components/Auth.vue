<template>
  <div class="home">
    <div class="content">
      <div class="main-content">
        <h1>欢迎来到各流派作曲家可视化系统</h1>
        <p>
          在这里，您可以探索各种音乐流派的丰富信息，了解每个流派的
          <span class="highlight">历史</span>、<span class="highlight">特点</span>以及 <span class="highlight">著名作曲家</span>。
        </p>
        <p>
          我们的系统提供了直观的可视化展示，帮助您更好地理解音乐的
          <span class="highlight">多样性</span>和<span class="highlight">魅力</span>。
        </p>
        <p>
          无论您是音乐爱好者、学生还是专业人士，这里都能为您提供有价值的
          <span class="highlight">资源</span>和<span class="highlight">灵感</span>。
        </p>
        <div class="show">
          <img
            width="20%"
            src="https://images.pexels.com/photos/1319799/pexels-photo-1319799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="music" />
        </div>
        
        <div class="music-animation">
          <div class="note"></div>
          <div class="note"></div>
          <div class="note"></div>
          <div class="note"></div>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="form-container">
        <div v-if="isLoginForm">
          <h2>用户登录</h2>
          <el-form @submit.prevent="login" label-width="120px">
            <el-form-item label="用户名">
              <el-input v-model="loginData.username" placeholder="请输入用户名" required />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginData.password" type="password" placeholder="请输入密码" required />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登录</el-button>
              <el-button @click="toggleForm">注册</el-button>
              <el-button @click="showAdminLogin">管理员登录</el-button>
              <!-- 添加管理员登录按钮 -->
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="isAdminLoginForm">
          <h2>管理员登录</h2>
          <el-form @submit.prevent="adminLogin" label-width="120px">
            <el-form-item label="管理员用户名">
              <el-input v-model="adminLoginData.username" placeholder="请输入管理员用户名" required />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="adminLoginData.password" type="password" placeholder="请输入密码" required />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="adminLogin">登录</el-button>
              <el-button @click="toggleForm">用户登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <h2>注册</h2>
          <el-form @submit.prevent="register" label-width="120px">
            <el-form-item label="用户名">
              <el-input v-model="registerData.username" placeholder="请输入用户名" required />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="registerData.password" type="password" placeholder="请输入密码" required />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="registerData.confirmPassword" type="password" placeholder="请确认密码" required />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="register">注册</el-button>
              <el-button @click="toggleForm">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed} from 'vue'
  import {useStore} from '../stores/useStore'
  import axios, {getUserInfo} from '../utils/axios' // 引入封装的 Axios
  import {ElMessage} from 'element-plus'
  import {useRouter} from 'vue-router'

  const store = useStore()
  const router = useRouter()

  const loginData = ref({
    username: '11',
    password: '11'
  })

  const registerData = ref({
    username: '',
    password: '',
    confirmPassword: '' // 添加确认密码字段
  })

  const adminLoginData = ref({
    username: '111',
    password: '111'
  })

  const isLoginForm = ref(true) // 控制显示用户登录表单
  const isAdminLoginForm = ref(false) // 控制显示管理员登录表单

  const isAuthenticated = computed(() => !!store.user.username) // 判断用户是否已登录

  const toggleForm = () => {
    isLoginForm.value = !isLoginForm.value // 切换表单
    isAdminLoginForm.value = false // 确保管理员登录表单关闭
  }

  const showAdminLogin = () => {
    isAdminLoginForm.value = true // 显示管理员登录表单
    isLoginForm.value = false // 确保用户登录表单关闭
  }

  const login = async () => {
    try {
      const response = await axios.post('/auth/login', loginData.value)
      const token = response.token // 确保从响应中获取 token
      store.setToken(token)
      const userInfo = await getUserInfo()
      store.setUser(userInfo)
      ElMessage.success('登录成功')
      router.push('/')
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message || '登录失败'
      ElMessage.error(message)
    }
  }

  const adminLogin = async () => {
    try {
      const response = await axios.post('/admin/login', adminLoginData.value) // 管理员登录接口
      const admin = response.admin // 确保从响应中获取 token
      store.setUser(admin)
      // 将管理员信息保存到 localStorage
      localStorage.setItem('admin', JSON.stringify(admin)) // 保存管理员信息到 localStorage
      ElMessage.success('管理员登录成功')
      router.push('/musicList') // 管理员登录后跳转到管理员页面
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message || '管理员登录失败'
      ElMessage.error(message)
    }
  }

  const register = async () => {
    if (registerData.value.password !== registerData.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致！')
      return
    }

    try {
      await axios.post('/auth/register', {
        username: registerData.value.username,
        password: registerData.value.password
      })
      ElMessage.success('注册成功')
      toggleForm() // 注册成功后切换到登录表单
    } catch (error) {
      const message = error.response?.data?.message || '注册失败'
      ElMessage.error(message)
    }
  }
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .highlight {
    background-color: #ffeb3b; /* 高亮背景颜色 */
    font-weight: bold; /* 加粗 */
    padding: 2px 4px; /* 添加内边距 */
    border-radius: 4px; /* 圆角 */
  }

  .content {
    display: flex;
    flex: 1;
  }

  .main-content {
    flex: 2;
    padding: 20px;
  }

  .form-container {
    flex: 1;
    padding: 20px;
    border-left: 1px solid #e0e0e0; /* 添加分隔线 */
  }
  /* 音乐跳动动画 */
  .music-animation {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 20px;
  }
  .note {
    width: 15px;
    height: 100px;
    margin: 0 5px;
    background-color: #007bff; /* 音符颜色 */
    border-radius: 5px;
    animation: bounce 0.5s infinite alternate; /* 应用跳动动画 */
  }

  .note:nth-child(2) {
    animation-delay: 0.1s; /* 延迟 */
  }

  .note:nth-child(3) {
    animation-delay: 0.2s; /* 延迟 */
  }

  .note:nth-child(4) {
    animation-delay: 0.3s; /* 延迟 */
  }

  @keyframes bounce {
    0% {
      height: 100px; /* 初始高度 */
    }
    100% {
      height: 150px; /* 跳动后的高度 */
    }
  }
</style>
