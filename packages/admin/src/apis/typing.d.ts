declare namespace API {
  interface CustomPageQuery {
    page: number
    size: number
  }

  interface CustomPageResponse<T> {
    total: number
    data: T[]
  }

  interface LoginParams {
    account: string
    password: string
  }

  interface LoginResponse {
    name: string
    account: string
    roles: string[]
    token: string
    refreshToken: string
    id: string
    lastLoginTime: number
  }

  interface RefreshTokenParams {
    _id: string
    token: string
  }

  interface RefreshTokenResponse {
    token: string
    refreshToken: string
  }

  interface LogDetailCode {
    highlight: boolean
    number: number
    code: string
  }

  interface LogDetail {
    message: string
    createdAt: number
    time: number
    systemInfo: {
      _id: string
      platform: string
      userAgent: string
      language: string
      baseVersion: string
      sdkVersion: string
      connection: {
        effectiveType: string
        type: string
      }
    }
    result: {
      source: string
      line: number
      column: number
      name: null | string
    }
    codes: LogDetailCode[]
    stack?: string
    type: 'network' | 'lag' | 'sourceLoad' | 'unhandledrejection' | 'unknow'
    href: string
    customInfo?: string
    appInfo: TypeInfo
  }

  interface LogDetailParams {
    id: string
  }

  interface TypesReport {
    count: number
    name: string
    id: string
  }

  type TypesReportResponse = TypesReport[]

  interface YearlyReportParams {
    year: number
  }

  interface MonthlyReportParams {
    date: number
  }

  interface ReportInfo {
    id: string
    name: string
    list: { label: string; count: number }[]
  }

  type ReportResponse = ReportInfo[]

  interface UserRolesParams {
    userId: string
  }

  type TypeStatus = 0 | 1

  interface TypeInfo {
    createdAt: number
    name: string
    status: TypeStatus
    updatedAt: number
    _id: string
  }

  interface AddTypeParams {
    name: string
    status: TypeStatus
  }

  interface UpdateTypeParams {
    _id: string
    name?: string
    status: TypeStatus
  }

  interface ChangeTypeSatusParams {
    _id: string
    status: TypeStatus
  }

  interface TypeDetailParams {
    id: string
  }

  interface DelFileParams {
    typeId: string
    fileId: string
  }

  interface TypeDetailResponse {
    createdAt: string
    files: { _id: string; name: string }[]
    name: string
    status: TypeStatus
    updatedAt: string
    _id: string
  }

  interface TypesReport {
    count: number
    name: string
    id: string
  }

  type TypesReportResponse = TypesReport[]

  interface UsersListPageQuery extends CustomPageQuery {
    name: string
  }

  interface UpdateUserStatusParams {
    _id: string
    status: 0 | 1
  }

  interface GetUserInfoParams {
    id: string
  }

  interface UpdateUserInfoParams {
    _id: string
    name: string
  }

  interface UpdateUserPasswordParams {
    oldPassword: string
    newPassword: string
  }

  interface UpdateUserPasswordByAdminParams {
    _id: string
  }

  interface UserInfo {
    account: string
    lastLoginTime: number
    name: string
    roles: string[]
    status: 0 | 1
    _id: string
    createdAt: number
    updatedAt: number
  }

  interface AddUserParams {
    name: string
    account: string
    type: number[]
  }
}
