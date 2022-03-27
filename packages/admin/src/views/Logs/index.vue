<template>
  <container title="日志列表" :has-arror="false">
    <div class="home">
      <adv-table :headers="headers" :source="getList" :has-refresh-btn="true">
        <template #name>
          <el-table-column label="应用名称" width="120">
            <template #default="{ row }">
              <router-link
                :to="{ path: '/types/detail', query: { id: row.appInfo._id } }"
                class="link"
                >{{ row.appInfo.name }}</router-link
              >
            </template>
          </el-table-column>
        </template>
        <template #platform>
          <el-table-column label="应用平台" width="100">
            <template #default="{ row }">
              {{ row.systemInfo.platform }}
            </template>
          </el-table-column>
        </template>
        <template #sdk>
          <el-table-column label="SDK">
            <template #default="{ row }">
              {{ row.systemInfo.baseVersion }}/
              {{ row.systemInfo.sdkVersion }}
            </template>
          </el-table-column>
        </template>
        <template #time>
          <el-table-column label="报错时间" width="200px">
            <template #default="{ row }">
              {{ formatDateClock(row.time) }}
            </template>
          </el-table-column>
        </template>
        <template #uploadTime>
          <el-table-column label="上传时间" width="200px">
            <template #default="{ row }">
              {{ formatDateClock(row.createdAt) }}
            </template>
          </el-table-column>
        </template>
        <template #btns>
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button type="text" @click="go2Detail(row._id)"
                >详情</el-button
              >
              <router-link
                :to="{ path: '/list/detail', query: { id: row._id } }"
                class="link"
              ></router-link>
            </template>
          </el-table-column>
        </template>
      </adv-table>
    </div>
  </container>
</template>

<script lang="ts" setup>
import { AdvTable } from '@advanced-elements/table'
import { useRouter } from 'vue-router'
import Container from '../../components/Container/index.vue'
import { GetLogsList } from '../../apis/logs'
import { formatDateClock } from '../../utils/index'

interface TableQuery {
  page: number
  size: number
}

const router = useRouter()

const headers = [
  {
    prop: 'name',
    label: '应用名称',
  },
  {
    prop: 'platform',
    label: '应用平台',
  },
  {
    prop: 'sdk',
    label: 'SDK',
  },
  {
    prop: 'time',
    label: '报错时间',
  },
  {
    prop: 'uploadTime',
    label: '上传时间',
  },
  {
    prop: 'btns',
    label: '操作',
  },
]

function getList(params: TableQuery) {
  return new Promise((resolve) => {
    GetLogsList({
      ...params,
    }).then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
      resolve(res)
    })
  })
}
function go2Detail(id: string) {
  router.push({
    path: '/list/detail',
    query: {
      id,
    },
  })
}
</script>
