<template>
  <el-header>
    <div class="navbar">
      <el-menu :default-active="activeMenu" class="menu" mode="horizontal">
        <el-menu-item index="1" @click="navigateTo('/')">首页</el-menu-item>
        <el-menu-item index="8" @click="navigateTo('/analysis')">各流派作曲家可视化</el-menu-item>
        <el-menu-item index="7" @click="navigateTo('/d3chart')">流派可视化</el-menu-item>
        <el-menu-item index="5" @click="navigateTo('/musicList')">音乐列表</el-menu-item>
        <el-menu-item v-if=" isAdmin" index="2" @click="navigateTo('/music')">音乐管理</el-menu-item>
        <el-menu-item v-if="isAdmin" index="3" @click="navigateTo('/genres')">流派管理</el-menu-item>
        <el-menu-item v-if="isAdmin" index="4" @click="navigateTo('/composers')">作曲家管理</el-menu-item>
        <el-menu-item v-if="isAuthenticated || isAdmin" index="6" @click="logout">登出</el-menu-item>
      </el-menu>
      <div class="user-info" v-if="isAuthenticated">
        <b>{{ user.username }}</b> <!-- 显示用户名 -->
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '../stores/useStore';

const store = useStore();
const router = useRouter();
const route = useRoute(); // 获取当前路由
const activeMenu = ref('1'); // 默认选中的菜单项

const isAdmin = computed(() => store.user?.role === 'admin'); // 判断是否为管理员

const user = computed(() => store.user); // 获取用户信息
const isAuthenticated = computed(() => !!store.token); // 判断用户是否已登录

// 监听路由变化，更新 activeMenu
watch(route, (newRoute) => {
  switch (newRoute.path) {
    case '/':
      activeMenu.value = '1';
      break;
    case '/music':
      activeMenu.value = '2';
      break;
    case '/genres':
      activeMenu.value = '3';
      break;
    case '/composers':
      activeMenu.value = '4';
      break;
    case '/musicList':
      activeMenu.value = '5';
      break;
    case '/d3chart':
      activeMenu.value = '7';
      break;
    case '/analysis':
      activeMenu.value = '8';
      break;
    default:
      activeMenu.value = '1'; // 默认选中首页
  }
});

const navigateTo = (path) => {
  router.push(path);
};

const logout = () => {
  store.clearUser();
  router.push('/'); // 跳转到首页
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  flex: 1;
}

.menu .el-menu-item {
  transition: color 0.3s; /* 添加过渡效果 */
}

.menu .el-menu-item:hover {
  color: #1abc9c; /* 悬停时的颜色 */
}

.user-info {
  margin-left: 20px;
  font-weight: bold; /* 加粗用户名 */
}
</style>