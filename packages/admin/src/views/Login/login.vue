<template>
  <div class="login">
    <div class="login-container">
      <h1 class="login-container__header">欢迎回来!</h1>
      <el-form
        ref="form"
        class="login-container__form"
        :model="formData"
        :rules="rules"
        :disabled="isLogining"
      >
        <el-form-item prop="account">
          <el-input
            v-model="formData.account"
            placeholder="账号"
            :clearable="true"
          >
            <template #prepend>
              <el-icon>
                <user-filled></user-filled>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="密码"
            :clearable="true"
            :show-password="true"
          >
            <template #prepend>
              <el-icon>
                <unlock></unlock>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="isRemerber">
          <el-checkbox v-model="formData.isRemerber">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="form-button" type="primary" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Unlock, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { checkAccount, checkPassword } from '@/utils/validators'
const router = useRouter()
const store = useUserStore()
const form = ref()
const isLogining = ref(false)
const formData = ref({
  account: '',
  password: '',
  isRemerber: false,
})
const rules = {
  account: [{ required: true, validator: checkAccount, trigger: 'blur' }],
  password: [{ required: true, validator: checkPassword, trigger: 'blur' }],
}
function login() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      isLogining.value = true
      store
        .login(formData.value)
        .then(() => {
          router.push({
            path: '/',
          })
        })
        .finally(() => {
          isLogining.value = false
        })
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &-container {
    width: 350px;
    padding: 24px;
    background: #fff;
    border-radius: 6px;
    &__header {
      line-height: 48px;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    &__form {
      width: 100%;
      .form {
        &-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
