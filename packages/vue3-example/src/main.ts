import { createApp } from 'vue'
import App from './App.vue'
import { init } from '@tomorrow-catcher/vue'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
  console.log('i am custom')
}

init({
  key: '624021e9a47d22513c1dc75f',
  expireDate: 0,
  reportUrl: 'http://127.0.0.1:7001/api/logs',
  vue: app,
  beforeUpload (err, from, vm, info) {
    console.log(err, vm, info)
    return {
      err,
      customForm: `i am from ${from}`
    }
  },
  trackDepth: 1,
  handlersList: ['sourceLoad', 'unhandledrejection', 'lag']
})

app.mount('#app')
