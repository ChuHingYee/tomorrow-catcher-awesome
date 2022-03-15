<template>
  <div :class="$style.login">
    <div :class="$style.loginContainer">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" module>
.login {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-color-primary);
  &Container {
    width: 800px;
    height: 100%;
    padding-top: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>
