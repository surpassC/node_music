import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式
import { createPinia } from 'pinia'; // 引入 Pinia

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(createPinia()); // 使用 Pinia
app.mount('#app');