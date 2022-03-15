import { Rule, RuleType } from '@midwayjs/validate';

class FileInfo {
  @Rule(RuleType.string().required())
  _id: string;

  @Rule(RuleType.string().required())
  name: string;
}

export class TypeDTO {
  @Rule(RuleType.string().required())
  name: string;

  @Rule(RuleType.number())
  status: 0 | 1;
}

export class UpdateTypeDTO {
  @Rule(RuleType.string().required())
  _id: string;

  @Rule(RuleType.number())
  status: 0 | 1;

  @Rule(FileInfo, { required: false })
  files: FileInfo[];

  @Rule(RuleType.string())
  name: string;
}

export class DelTypeFileDTO {
  @Rule(RuleType.string().required())
  typeId: string;

  @Rule(RuleType.string().required())
  fileId: string;
}

export class UploadFileDTO {
  @Rule(RuleType.string().required())
  appId: string;
}

export class PageDTO {
  @Rule(RuleType.number().required())
  page: number;

  @Rule(RuleType.number().required())
  size: number;

  @Rule(RuleType.string())
  id: string;

  @Rule(RuleType.string())
  name: string;
}
