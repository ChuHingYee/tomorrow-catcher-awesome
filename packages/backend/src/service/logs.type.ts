export interface StackFrame {
  url: string;
  func: string;
  args: string[];
  line: number;
  column: number;
  context: string[];
}

export interface StackTrace {
  mode: string;
  name: string;
  message: string;
  url: string;
  stack: StackFrame[];
  useragent: string;
}

export interface CustomInfo {
  [key: string]: any;
}

export interface SystemInfo {
  platform: string;
  userAgent: string;
  language: string;
}

export interface LogItem {
  time: number;
  customInfo: {
    [key: string]: any;
  };
  expireTime: number;
  systemInfo: {
    platform: string;
    userAgent: string;
    language: string;
  };
  sdkInfo: {
    version: string;
    type: string;
    [key: string]: any;
  };
  key: string;
  trace?: StackTrace;
}

export interface SaveParams {
  list: LogItem[];
  appKey: string;
}

// export interface ReportParams {
//   startTime: number;
//   endTime: number;
//   type: 'hour' | 'day' | 'month' | 'year';
// }

export interface OriginCodeParams {
  sourceMap: any;
  info: {
    line: number;
    column: number;
  };
}

export interface GetLogParams {
  id: string;
}

export interface ReportResult {
  name: string;
  value: number;
  list: {
    name: string;
    value: number;
    time: number;
  }[];
}

export interface ReportFromTimeResult extends ReportResult {
  list: {
    name: string;
    value: number;
    time: number;
  }[];
}

export interface LogDetail {
  type: string;
  msg: string;
  url: string;
  trace: StackTrace;
  customInfo: CustomInfo;
  systemInfo: SystemInfo;
  createdAt: Date;
  uploadedAt: Date;
  typeKey: string;
  typeName: string;
  id: string;
}

export interface Code {
  highlight: boolean;
  number: number;
  code: string;
}

export interface PageParams {
  page: number;
  size: number;
  appKey?: string;
}

export interface PageResult {
  data: LogDetail[];
  total: { totalCount: number }[];
}

export interface ReportParams {
  year: number;
  appKey?: string;
}

export interface ReportByMonthParams {
  date: number;
  appKey?: string;
}
