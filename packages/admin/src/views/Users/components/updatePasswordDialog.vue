<template>
  <el-dialog v-model="localVisilbe" title="更改用户密码" width="480px">
    <div class="import">
      <el-form ref="form" label-width="140px" :model="formData" :rules="rules">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="formData.oldPassword"
            placeholder="原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            placeholder="新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="newPassword2">
          <el-input
            v-model="formData.newPassword2"
            placeholder="再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button plain @click="localVisilbe = false"> 取消 </el-button>
      <el-button type="primary" plain @click="handleConfirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useVModel } from '@vueuse/core'
import type { RuleItem } from 'async-validator'
import { checkPassword } from '@/utils/validators'
import { UpdateUserPassword } from '@/apis/users'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: '',
  },
})
const emits = defineEmits<{
  (e: 'success'): void
}>()

const localVisilbe = useVModel(props, 'visible')
//   emits: ['update:visible', 'success'],

const form = ref<any>()
const formData = ref({
  oldPassword: '',
  newPassword: '',
  newPassword2: '',
})

const checkPasswordAgain: RuleItem['validator'] = (rule, value, callback) => {
  if (value && value !== formData.value.newPassword) {
    // eslint-disable-next-line n/no-callback-literal
    callback('两次输入的新密码不一致，请重新输入～')
  } else {
    callback()
  }
}
const rules = ref({
  oldPassword: [
    {
      validator: checkPassword,
      required: true,
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      validator: checkPassword,
      required: true,
      trigger: 'blur',
    },
  ],
  newPassword2: [
    {
      validator: checkPassword,
      required: true,
      trigger: 'blur',
    },
    {
      validator: checkPasswordAgain,
      required: true,
      trigger: 'blur',
    },
  ],
})
watch(
  () => props.visible,
  (val: boolean) => {
    if (val) {
      nextTick(() => {
        form.value.resetFields()
      })
    }
  }
)
function handleConfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      UpdateUserPassword({
        oldPassword: formData.value.oldPassword,
        newPassword: formData.value.newPassword,
      }).then(() => {
        emits('success')
      })
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped></style>
