import axios from 'axios';
import { useStore } from '../stores/useStore';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const store = useStore();
    const token = store.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 获取用户信息
export const getUserInfo = async () => {
  const response = await instance.get('/auth/userinfo'); // 假设这是获取用户信息的接口
  return response;
};

export default instance;