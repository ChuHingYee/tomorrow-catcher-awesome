import type * as echarts from 'echarts/core'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

export type ECOption = echarts.ComposeOption<
  | PieSeriesOption
  | DatasetComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | LegendComponentOption
>
