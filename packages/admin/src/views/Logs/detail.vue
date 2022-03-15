<template>
  <container title="日志详情" @back="go2Back">
    <el-skeleton :rows="5" animated :loading="isLoading">
      <el-descriptions :border="true" :column="2" class="detail-info">
        <el-descriptions-item label="错误名称">
          {{ detail.name }}
        </el-descriptions-item>
        <el-descriptions-item label="错误消息">
          {{ message }}
        </el-descriptions-item>
        <el-descriptions-item label="错误位置">
          <span v-if="detail.result">
            line：{{ detail.result.line }}，column：{{ detail.result.column }}
          </span>
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="错误文件">
          {{ detail.result ? detail.result.source : '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="浏览器类型">{{
          detail.systemInfo.userAgent
        }}</el-descriptions-item>
        <el-descriptions-item label="系统">
          {{ detail.systemInfo.platform }}
        </el-descriptions-item>
        <el-descriptions-item label="语言">
          {{ detail.systemInfo.language }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDateClock(detail.time)
        }}</el-descriptions-item>
        <el-descriptions-item label="上传时间">{{
          formatDateClock(detail.createdAt)
        }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="detail.codes && detail.codes.length" class="detail-code">
        <el-alert title="错误代码：" type="error" :closable="false" />
        <div class="detail-code__rows">
          <div
            v-for="code in detail.codes"
            :key="code.number"
            class="rows-item"
            :class="code.highlight && 'rows-error'"
          >
            <div>{{ code.code }}</div>
          </div>
        </div>
      </div>
    </el-skeleton>
  </container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../components/Container/index.vue'
import { GetLogDetail } from '../../apis/logs'
import { formatDateClock } from '../../utils/index'

const route = useRoute()
const router = useRouter()
const detailId = ref('')
const isLoading = ref(false)
const detail = ref<API.LogDetail>({
  name: '',
  message: [],
  createdAt: 0,
  time: 0,
  systemInfo: {
    _id: '',
    platform: '',
    userAgent: '',
    language: '',
    baseVersion: '',
    sdkVersion: '',
  },
  result: {
    source: '',
    line: 0,
    column: 0,
    name: '',
  },
  codes: [],
})
const message = computed(() => {
  return detail.value.message.join('/')
})
function getDetail() {
  isLoading.value = true
  GetLogDetail({
    id: detailId.value,
  }).then((res) => {
    detail.value = res
    isLoading.value = false
  })
}
function go2Back() {
  router.back()
}
onMounted(() => {
  if (route.query.id) {
    detailId.value = route.query.id as string
    getDetail()
  }
})
</script>

<style lang="scss" scoped>
.detail {
  &-info {
    margin-bottom: 24px;
  }
  &-code {
    &__rows {
      background: #fff;
      padding: 24px;
      .rows {
        &-item {
          white-space: pre-wrap;
          color: var(--el-text-color-regular);
        }
        &-error {
          color: var(--el-color-danger);
        }
      }
    }
  }
}
</style>
