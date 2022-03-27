import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/element/index.scss'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import './permission' // 路由守卫
import './assets/fonts/iconfont'

import './styles/reset.css'
// import './styles/theme.css'
import './styles/custom.css'

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app')
