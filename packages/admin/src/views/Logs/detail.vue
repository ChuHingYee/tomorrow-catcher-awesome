<template>
  <container title="日志详情" @back="go2Back">
    <el-skeleton :rows="5" animated :loading="isLoading">
      <el-descriptions :border="true" :column="2" class="detail-info">
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="应用名称"
        >
          {{ detail.appInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="应用名称Key"
        >
          {{ detail.appInfo._id }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="错误类型"
        >
          {{ errorType }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="网络状态"
        >
          {{ detail.systemInfo.connection.effectiveType }}/
          {{ detail.systemInfo.connection.type }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="错误地址"
        >
          {{ detail.href }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="detail.message"
          label-class-name="detail-info__label"
          label="错误消息"
        >
          {{ detail.message }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="detail.stack"
          label-class-name="detail-info__label"
          label="错误消息"
        >
          {{ detail.stack }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="detail.result"
          label-class-name="detail-info__label"
          label="错误位置"
        >
          <span>
            line：{{ detail.result.line }}，column：{{ detail.result.column }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="错误文件"
        >
          {{ detail.result ? detail.result.source : '无' }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="浏览器类型"
          >{{ detail.systemInfo.userAgent }}</el-descriptions-item
        >
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="系统"
        >
          {{ detail.systemInfo.platform }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="语言"
        >
          {{ detail.systemInfo.language }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="额外信息"
        >
          {{ formatCustomInfo }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="创建时间"
          >{{ formatDateClock(detail.time) }}</el-descriptions-item
        >
        <el-descriptions-item
          label-class-name="detail-info__label"
          label="上传时间"
          >{{ formatDateClock(detail.createdAt) }}</el-descriptions-item
        >
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
  message: '',
  createdAt: 0,
  time: 0,
  systemInfo: {
    _id: '',
    platform: '',
    userAgent: '',
    language: '',
    baseVersion: '',
    sdkVersion: '',
    connection: {
      effectiveType: '',
      type: '',
    },
  },
  href: '',
  result: {
    source: '',
    line: 0,
    column: 0,
    name: '',
  },
  codes: [],
  type: 'unknow',
  customInfo: '',
  appInfo: {
    createdAt: 0,
    name: '',
    status: 0,
    updatedAt: 0,
    _id: '',
  },
})
const errorType = computed(() => {
  const map = {
    network: '网络请求',
    lag: '渲染卡顿',
    sourceLoad: '资源加载错误',
    unhandledrejection: 'promise',
    unknow: '未知',
  }
  return map[detail.value.type]
})
const formatCustomInfo = computed(() => {
  if (detail.value.customInfo) {
    try {
      return JSON.parse(detail.value.customInfo)
    } catch (error) {
      return '-'
    }
  } else {
    return '-'
  }
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
::v-deep .detail-info__label {
  width: 120px;
}
</style>
