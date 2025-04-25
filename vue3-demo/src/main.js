import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/base.css' // 引入全局样式
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { register } from 'swiper/element/bundle'
register()

const app = createApp(App);
app.use(router); // 👈 挂载 Vue Router
app.use(ElementPlus)
app.mount('#app');
