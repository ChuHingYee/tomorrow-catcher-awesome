<template>
  <div ref="chartRef" :class="$style.chart"></div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts/core'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { PropType } from 'vue'
import type { ECOption } from './pieChart.type'

const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  dataset: {
    type: Object,
    default: () => {
      return {
        source: [],
      }
    },
  },
  legend: {
    type: Object,
    default: () => {
      return {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
      }
    },
  },
  tooltip: {
    type: Object,
    default: () => {
      return {
        trigger: 'item',
        formatter: '{a} <br/>{c} ({d}%)',
      }
    },
  },
  series: {
    type: Array as PropType<ECOption['series']>,
    default: () => [
      {
        type: 'pie',
        radius: '70%',
        center: ['40%', '50%'],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  },
  grid: {
    type: Object,
    default: () => {
      return {}
    },
  },
  title: {
    type: Array,
    default: () => [],
  },
})
const chartRef = ref()
let chartInstance: echarts.ECharts
const options = computed(() => {
  const { legend, tooltip, dataset, series, grid } = props
  const options: ECOption = {
    legend,
    tooltip,
    dataset,
    series,
    grid,
  }
  return options
})
const setOption = () => {
  setTimeout(() => {
    chartInstance.setOption(options.value, true)
  }, 200)
}

watch(
  () => {
    return props.loading
  },
  (val) => {
    if (chartInstance) {
      if (val) {
        chartInstance.showLoading()
      } else {
        chartInstance.hideLoading()
        setOption()
      }
    }
  }
)

useResizeObserver(chartRef, () => {
  nextTick(() => {
    chartInstance.resize()
  })
})

onMounted(() => {
  echarts.use([
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    GridComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
  ])
  nextTick(() => {
    chartInstance = echarts.init(chartRef.value)
    if (props.loading) {
      chartInstance.showLoading()
    } else {
      setOption()
    }
  })
})
</script>

<style lang="scss" module>
.chart {
  height: 100%;
}
</style>
