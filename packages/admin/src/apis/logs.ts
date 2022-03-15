import { request } from '../utils/request'

/**
 * 获取应用列表
 * @param params
 * @returns
 */
export const GetLogsList = (params: API.CustomPageQuery) => {
  return request<API.CustomPageResponse<API.LogDetail>>({
    url: '/api/logs/page',
    method: 'get',
    params,
  })
}

/**
 * 获取应用详情
 * @param params
 * @returns
 */
export const GetLogDetail = (params: API.LogDetailParams) => {
  return request<API.LogDetail>({
    url: `/api/logs/${params.id}`,
    method: 'get',
  })
}

/**
 * 获取类型日志统计
 * @param params
 * @returns
 */
export const GetLogReportForType = () => {
  return request<API.TypesReportResponse>({
    url: 'api/logs/report/type',
    method: 'get',
  })
}

/**
 * 获取年日志统计
 * @param params
 * @returns
 */
export const GetLogReportByYear = (params: API.YearlyReportParams) => {
  return request<API.ReportResponse>({
    url: '/api/logs/report/year',
    method: 'get',
    params,
  })
}

/**
 * 获取月日志统计
 * @param params
 * @returns
 */
export const GetLogReportByMonth = (params: API.MonthlyReportParams) => {
  return request<API.ReportResponse>({
    url: '/api/logs/report/month',
    method: 'get',
    params,
  })
}
