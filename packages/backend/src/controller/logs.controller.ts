import {
  Inject,
  Controller,
  Post,
  Get,
  Param,
  Provide,
  Fields,
  Query,
  ALL,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { basename } from 'path';
import { LogsService } from '../service/logs.service';
import { LogTypeService } from '../service/logType.service';
import { FilesService } from '../service/files.service';
import { PageDTO, ReportDTO, MonthReportDTO } from '../dto/log';
import { JwtPassportMiddleware } from '../middleware/jwt.middleware';
import { GetUserInfoMiddleware } from '../middleware/getUserInfo.middleware';
import { CustomHttpError } from '../error/custom.error';

@Provide()
@Controller('/api')
export class LogsController {
  @Inject()
  ctx: Context;

  @Inject()
  logsService: LogsService;

  @Inject()
  logTypeService: LogTypeService;

  @Inject()
  fileService: FilesService;

  @Post('/logs')
  async save(@Fields() fields): Promise<any> {
    const logType = await this.logTypeService.detail({ _id: fields.appKey });
    if (logType) {
      if (logType.status === 0) {
        throw new CustomHttpError('此应用已停用');
      }
      try {
        fields.list = JSON.parse(fields.list) || [];
      } catch (error) {
        console.log(error);
        throw new CustomHttpError('格式错误');
      }
      const result = await this.logsService.save(fields);
      return { success: true, message: 'OK', data: result };
    } else {
      throw new CustomHttpError('此应用不存在');
    }
  }

  @Get('/logs/:id', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async getLogDetail(@Param('id') id: string): Promise<any> {
    const logDetail = await this.logsService.getLog({
      id,
    });
    let errorDetail;
    if (logDetail) {
      console.log(logDetail);
      const { trace, createdAt, time, systemInfo, appInfo } = logDetail;
      if (trace.stack && trace.stack.length > 0) {
        const stack = trace.stack[0];
        const filename = basename(stack.url) + '.map';
        const sourceMap = await this.fileService.getFile({ filename });
        if (sourceMap) {
          errorDetail = await this.logsService.getOriginCode({
            sourceMap,
            info: { line: stack.line, column: stack.column },
          });
        }
      }
      return {
        success: true,
        message: 'OK',
        data: {
          appInfo,
          name: trace.name,
          message: trace.message,
          createdAt,
          time,
          systemInfo,
          ...errorDetail,
        },
      };
    }
  }

  @Get('/logs/page', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async getLogs(@Query(ALL) query: PageDTO): Promise<any> {
    console.log(this.ctx.req);
    const result = await this.logsService.getPage(query);
    return { success: true, message: 'OK', data: result };
  }

  @Get('/logs/report/year', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async getReportByYear(@Query(ALL) query: ReportDTO): Promise<any> {
    const result = await this.logsService.getReportByYear(query);
    return { success: true, message: 'OK', data: result };
  }

  @Get('/logs/report/month', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async getReportByMonth(@Query(ALL) query: MonthReportDTO): Promise<any> {
    const result = await this.logsService.getReportByMonth(query);
    return { success: true, message: 'OK', data: result };
  }

  @Get('/logs/report/type', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async getReportByType() {
    const task = [
      this.logTypeService.getPage({ page: -1, size: 1 }),
      this.logsService.getReportForType(),
    ];
    const results = await Promise.all(task);
    const list = results[0].map(item => {
      const _id = String(item._id as string);
      const current = results[1].find(data => {
        return String(data.id as string) === _id;
      });
      return {
        name: item.name,
        id: _id,
        count: current ? current.count : 0,
      };
    });
    return { success: true, message: 'OK', data: list };
  }
}
