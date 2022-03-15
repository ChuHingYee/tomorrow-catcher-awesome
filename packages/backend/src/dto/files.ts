import { Rule, RuleType } from '@midwayjs/validate';

export class DelFileDTO {
  @Rule(RuleType.string().required())
  _id: string;
}
