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

</script>

<style>
/* 添加一些样式 */
</style>