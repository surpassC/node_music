<template>
  <div>
    <Navbar /> <!-- 引入导航栏 -->
  <el-container>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</div>

</template>

<script setup>
import Navbar from './components/Navbar.vue'; // 引入导航栏组件
import { onMounted } from 'vue';
import { useStore } from './stores/useStore';
import { getUserInfo } from './utils/axios'; // 引入封装的 Axios 和获取用户信息的方法

const store = useStore();

onMounted(async () => {
  if (store.token) { // 如果用户已登录
    try {
      const userInfo = await getUserInfo(); // 获取用户信息
      store.setUser(userInfo); // 存储用户信息
    } catch (error) {
      store.clearUser(); // 如果获取失败，清除用户信息
    }
  } else {
    // console.log('用户未登录，跳过获取用户信息。');
  }
});
</script>

<style>
/* 添加一些样式 */
</style>