import type * as echarts from 'echarts/core'
import type { BarSeriesOption, LinesSeriesOption } from 'echarts/charts'
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LinesSeriesOption
  | DatasetComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | LegendComponentOption
>
