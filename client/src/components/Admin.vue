<template>
  <div>
    <h2>管理员登录</h2>
    <el-form @submit.native.prevent="adminLogin" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="adminData.username" placeholder="请输入用户名" required />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="adminData.password" type="password" placeholder="请输入密码" required />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="adminLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      adminData: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async adminLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/admin/login', this.adminData);
        localStorage.setItem('adminToken', response.data.token);
        this.$message.success('管理员登录成功');
        // 这里可以添加管理员功能的跳转
      } catch (error) {
        this.$message.error('管理员登录失败: ' + error.response.data.message);
      }
    },
  },
};
</script>