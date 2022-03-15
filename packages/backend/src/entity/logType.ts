import { prop, modelOptions } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';

class FileInfo {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public name!: string;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@EntityModel()
export class LogType {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public status!: 0 | 1;

  @prop({ required: true, type: () => [FileInfo] })
  public files?: FileInfo[];

  @prop({ required: true })
  public createdAt!: number;

  @prop()
  public updatedAt?: number;
}
