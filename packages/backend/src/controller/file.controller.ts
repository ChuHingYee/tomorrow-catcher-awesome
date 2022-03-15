import {
  Inject,
  Controller,
  Post,
  Del,
  Provide,
  Body,
  ALL,
  Fields,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { FilesService } from '../service/files.service';
import { LogTypeService } from '../service/logType.service';
import { DelFileDTO } from '../dto/files';

@Provide()
@Controller('/api')
export class FilesController {
  @Inject()
  ctx: Context;

  @Inject()
  fileService: FilesService;

  @Inject()
  logTypeService: LogTypeService;

  @Post('/files')
  async upload(@Fields() fields) {
    await this.fileService.upload(fields);
    return { success: true, message: '上传成功', data: true };
  }

  @Del('/files')
  async del(@Body(ALL) body: DelFileDTO) {
    await this.fileService.del(body);
    return { success: true, message: '删除成功', data: true };
  }
}
