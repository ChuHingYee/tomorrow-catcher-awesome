import { createApp } from 'vue'
import App from './App.vue'
import { init } from '@tomorrow-catcher/vue'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
  console.log('i am custom')
}

init({
  key: '6230a0810a7301158ec52574',
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
  trackDepth: 1
})

app.mount('#app')
