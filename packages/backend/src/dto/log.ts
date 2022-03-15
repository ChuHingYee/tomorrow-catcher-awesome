import { Rule, RuleType } from '@midwayjs/validate';

export class UploadDTO {
  @Rule(RuleType.string().required())
  log: string;
}

export class DetailDTO {
  @Rule(RuleType.string().required())
  id: string;
}

export class ReportDTO {
  @Rule(RuleType.number().required())
  year: number;

  @Rule(RuleType.string())
  appKey: string;
}

export class MonthReportDTO {
  @Rule(RuleType.number().required())
  date: number;

  @Rule(RuleType.string())
  appKey: string;
}

export class PageDTO {
  @Rule(RuleType.number().required())
  page: number;

  @Rule(RuleType.number().required())
  size: number;

  @Rule(RuleType.string())
  appKey: string;
}
