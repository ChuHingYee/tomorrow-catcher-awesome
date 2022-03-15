import { Rule, RuleType } from '@midwayjs/validate';

export class LoginDTO {
  @Rule(RuleType.string().required())
  account: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class refreshTokenDTO {
  @Rule(RuleType.string().required())
  _id: string;

  @Rule(RuleType.string().required())
  token: string;
}

export class PageDTO {
  @Rule(RuleType.number().required())
  page: number;

  @Rule(RuleType.number().required())
  size: number;

  @Rule(RuleType.string())
  name: string;
}

export class UserDTO {
  @Rule(RuleType.string().required())
  name: string;

  @Rule(RuleType.string().required())
  account: string;

  @Rule(RuleType.array().items(0, 1).required())
  type: (0 | 1)[];
}

export class UpdatePasswordDTO {
  @Rule(RuleType.string().required())
  oldPassword: string;

  @Rule(RuleType.string().required())
  newPassword: string;
}

export class UpdatePasswordByAdminDTO {
  @Rule(RuleType.string().required())
  _id: string;
}

export class StatusDTO {
  @Rule(RuleType.string().required())
  _id: string;

  @Rule(RuleType.number().required())
  status: 0 | 1;
}

export class ManyStatusDTO {
  @Rule(RuleType.array().items().required())
  ids: string[];

  @Rule(RuleType.number().required())
  status: 0 | 1;
}

export class InfoDTO {
  @Rule(RuleType.string().required())
  _id: string;

  @Rule(RuleType.string().required())
  name: string;
}

export class GetUserDTO {
  @Rule(RuleType.string().required())
  id: string;
}
