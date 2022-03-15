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
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import type { PropType } from 'vue'
import type { XAXisOption, YAXisOption } from 'echarts/types/dist/shared'
import type { ECOption } from './barChart.type'

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
      return {}
    },
  },
  tooltip: {
    type: Object,
    default: () => {
      return {
        trigger: 'axis',
      }
    },
  },
  xAxis: {
    type: [Array, Object] as PropType<XAXisOption[] | XAXisOption>,
    default: () => {
      return {}
    },
  },
  yAxis: {
    type: [Array, Object] as PropType<YAXisOption[] | YAXisOption>,
    default: () => {
      return {}
    },
  },
  series: {
    type: Array as PropType<ECOption['series']>,
    default: () => [],
  },
  grid: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const chartRef = ref()
let chartInstance: echarts.ECharts
const options = computed(() => {
  const { legend, tooltip, dataset, xAxis, yAxis, series, grid } = props
  const options: ECOption = {
    legend,
    tooltip,
    dataset,
    xAxis,
    yAxis,
    series,
    grid,
  }
  options.series = series
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
    BarChart,
    LineChart,
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
