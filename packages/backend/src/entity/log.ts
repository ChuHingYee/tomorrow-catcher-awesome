import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { EntityModel } from '@midwayjs/typegoose';
import { LogType } from './logType';

class SystemInfo {
  @prop({ required: true })
  public platform!: string;

  @prop({ required: true })
  public userAgent!: string;

  @prop({ required: true })
  public language!: string;

  @prop({ required: true })
  public baseVersion!: string;

  @prop({ required: true })
  public sdkVersion!: string;
}

export class StackFrame {
  @prop({ required: true })
  public url!: string;

  @prop({ required: true })
  public func!: string;

  @prop({ required: true, type: () => [String] })
  public args!: string[];

  @prop({ required: true })
  public line!: number;

  @prop({ required: true })
  public column!: number;

  @prop({ type: () => [String] })
  public context?: string[];
}

class StackTrace {
  @prop({ required: true })
  public mode!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, type: () => [String] })
  public message!: string[];

  @prop()
  public url: string;

  @prop()
  public useragent: string;

  @prop({ type: () => StackFrame })
  public stack?: StackFrame[];
}

@EntityModel()
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Log {
  @prop({ required: true })
  public time!: number;

  @prop({ required: true, ref: () => LogType })
  public appKey!: Ref<LogType>;

  @prop({ required: true })
  public customInfo!: string;

  @prop({ required: true })
  public systemInfo?: SystemInfo;

  @prop({ type: () => StackTrace })
  public trace?: StackTrace;

  @prop({ required: true })
  public createdAt?: number;
}
