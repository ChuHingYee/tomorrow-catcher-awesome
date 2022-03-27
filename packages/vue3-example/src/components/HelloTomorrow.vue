<template>
  <div>
    <button @click="throwError">throw normal error</button>
  </div>
  <div>
    <button @click="throwPromiseError">throw promise error</button>
  </div>
  <div>
    <button @click="throwImgError">throw image load error</button>
    <img
      v-show="false"
      :src="item"
      v-for="(item, index) in imgList"
      :key="index"
    />
  </div>
  <div>
    <button @click="throwScriptError">throw script load error</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const imgList = ref<string[]>([])
const throwError = () => {
  throw new Error('i am from vue3')
}
const throwPromiseError = () => {
  Promise.reject(new Error('i am from vue3 promise'))
}
const throwImgError = () => {
  imgList.value.push('iamvue3pic.png')
}
const throwScriptError = () => {
  const src = './iamvue3Script.js'
  const _script = document.createElement('script')
  _script.src = src
  _script.type = 'text/javascript'
  const head = document.getElementsByTagName('head').item(0) // 这个是往本页面动态加载js脚本
  head!.appendChild(_script)
}
</script>
