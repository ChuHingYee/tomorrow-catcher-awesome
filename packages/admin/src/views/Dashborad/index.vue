<template>
  <div class="container">
    <el-row :gutter="12">
      <el-col :span="12" class="card">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>当月日志统计</span>
            </div>
          </template>
          <div class="card-body">
            <bar-chart
              :loading="dateChartLoading"
              :dataset="dateChartDataset"
              :legend="dateChartLegend"
              :series="dateChartSeries"
              :x-axis="chartOptions.xAxis"
              :y-axis="chartOptions.yAxis"
              :grid="chartOptions.grid"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="crad">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>每月日志统计</span>
            </div>
          </template>
          <div class="card-body">
            <bar-chart
              :loading="monthlyChartLoading"
              :dataset="monthlyChartDataset"
              :legend="monthlyChartLegend"
              :series="monthlyChartSeries"
              :x-axis="chartOptions.xAxis"
              :y-axis="chartOptions.yAxis"
              :grid="chartOptions.grid"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="crad">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>应用统计</span>
            </div>
          </template>
          <div class="card-body">
            <pie-chart
              :loading="typeChartLoading"
              :dataset="typeChartDataset"
              :series="pieChartOptions.series"
              :legend="pieChartOptions.legend"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import BarChart from '@/components/BarChart/barChart.vue'
import PieChart from '@/components/PieChart/pieChart.vue'
import {
  GetLogReportByMonth,
  GetLogReportByYear,
  GetLogReportForType,
} from '@/apis/logs'
import type { ECOption as PieChartECOption } from '@/components/PieChart/pieChart.type'
import type { ECOption as BarChartECOption } from '@/components/BarChart/barChart.type'
const chartOptions = ref({
  xAxis: { type: 'category' } as BarChartECOption['xAxis'],
  yAxis: {
    min: 0,
    minInterval: 1,
  },
  grid: {
    containLabel: true,
    top: 40,
    bottom: 5,
    left: 5,
    right: 5,
  },
  tooltip: {},
})
const pieChartOptions = ref({
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 'center',
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          rich: {
            title: {
              lineHeight: 18,
              color: '#fff',
              fontSize: 14,
            },
            value: {
              lineHeight: 24,
              color: '#fff',
              fontSize: 18,
            },
            percent: {
              lineHeight: 30,
              color: '#fff',
              fontWeight: 600,
              fontSize: 20,
            },
            icon: {
              lineHeight: 30,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
            },
          },
        },
      },
      labelLine: {
        show: false,
      },
    },
  ] as PieChartECOption['series'],
  tooltip: {
    show: false,
  },
})
const typeChartLoading = ref(false)
const typeChartDataset = ref({})
const dateChartLoading = ref(false)
const dateChartDataset = ref({})
const monthlyChartLoading = ref(false)
const monthlyChartDataset = ref({})
const monthlyChartLegend = ref({
  data: [] as string[],
  type: 'scroll',
})
const dateChartLegend = ref({
  data: [] as string[],
  type: 'scroll',
})
const monthlyChartSeries = ref<BarChartECOption['series']>([])
const dateChartSeries = ref<BarChartECOption['series']>([])

function getTypeReport() {
  typeChartLoading.value = true
  GetLogReportForType().then((res) => {
    const result: Array<Array<number | string>> = [['应用名称', '日志数量']]
    res.forEach((item) => {
      result.push([item.name, item.count])
    })
    typeChartDataset.value = {
      source: result,
    }
    typeChartLoading.value = false
  })
}
function getReportForMonth() {
  dateChartLoading.value = true
  GetLogReportByMonth({
    date: Date.now(),
  }).then((res) => {
    const result: Array<Array<number | string>> = [['日期']]
    const series: any[] = []
    res.forEach((item, index) => {
      result[0].push(item.name)
      dateChartLegend.value.data.push(item.name)
      series.push({ type: 'line', smooth: true })
      if (index === 0) {
        item.list.forEach((citem) => {
          result.push([`${citem.label}日`, citem.count])
        })
      } else {
        item.list.forEach((citem, cindex) => {
          result[cindex + 1].push(citem.count)
        })
      }
    })
    dateChartSeries.value = series as BarChartECOption['series']
    dateChartDataset.value = {
      source: result,
    }
    dateChartLoading.value = false
  })
}
function getLogReportByYear() {
  monthlyChartLoading.value = true
  GetLogReportByYear({
    year: new Date().getFullYear(),
  }).then((res) => {
    const result: Array<Array<number | string>> = [['月份']]
    const series: any[] = []
    res.forEach((item, index) => {
      result[0].push(item.name)
      monthlyChartLegend.value.data.push(item.name)
      series.push({ type: 'line', smooth: true })
      if (index === 0) {
        item.list.forEach((citem) => {
          result.push([`${citem.label}月`, citem.count])
        })
      } else {
        item.list.forEach((citem, cindex) => {
          result[cindex + 1].push(citem.count)
        })
      }
    })
    monthlyChartSeries.value = series as BarChartECOption['series']
    monthlyChartDataset.value = {
      source: result,
    }
    monthlyChartLoading.value = false
  })
}
onMounted(() => {
  getTypeReport()
  getLogReportByYear()
  getReportForMonth()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
  .card {
    margin-bottom: 12px;
    &-body {
      height: 300px;
    }
  }
}
</style>
