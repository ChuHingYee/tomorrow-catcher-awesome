const express = require('express')
// 创建web服务器
const app = express()
// 文件操作
const fs = require('fs')
const path = require('path')

// 托管静态资源
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('/', function (req, res) {
  const html = fs.readFileSync(
    path.resolve(__dirname, './dist/index.html'),
    'utf-8'
  )
  res.send(html)
})

// 启动web服务器
app.listen(8062, (res) => {
  console.log('Start Service On 8062')
})
