import { prop } from '@typegoose/typegoose';
// modelOptions
import { EntityModel } from '@midwayjs/typegoose';

@EntityModel()
export class User {
  @prop({ required: true })
  public name?: string;

  @prop({ required: true })
  public account!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public status!: number;

  @prop({ required: true })
  public lastLoginTime?: number;

  @prop({ required: true })
  public createdAt!: number;

  @prop({ required: true })
  public updatedAt?: number;

  @prop({ type: () => [String], required: true })
  public roles?: string[];
}
