import {
  Inject,
  Controller,
  Post,
  Get,
  Put,
  Del,
  Fields,
  Provide,
  Body,
  Query,
  Param,
  ALL,
} from '@midwayjs/decorator';
import { HttpStatus } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { LogTypeService } from '../service/logType.service';
import { FilesService } from '../service/files.service';
import {
  TypeDTO,
  UpdateTypeDTO,
  DelTypeFileDTO,
  UploadFileDTO,
  PageDTO,
} from '../dto/logType';
import { JwtPassportMiddleware } from '../middleware/jwt.middleware';
import { GetUserInfoMiddleware } from '../middleware/getUserInfo.middleware';
import { CustomHttpError } from '../error/custom.error';

@Provide()
@Controller('/api')
export class ErrorsController {
  @Inject()
  ctx: Context;

  @Inject()
  logTypeService: LogTypeService;

  @Inject()
  fileService: FilesService;

  @Post('/type', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async add(@Body(ALL) body: TypeDTO) {
    const isAdmin = this.ctx.state.userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const _id = await this.logTypeService.save({ ...body, status: 1 });
    if (_id) {
      return { success: true, message: '新增成功', data: true };
    }
  }

  @Put('/type', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async update(@Body(ALL) body: UpdateTypeDTO) {
    const isAdmin = this.ctx.state.userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    console.log(body, 'body');
    const result = await this.logTypeService.update(body);
    if (result) {
      return { success: true, message: '更改成功', data: true };
    }
  }

  @Get('/type/page', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async getTypePage(@Query(ALL) query: PageDTO) {
    const { logTypeService } = this;
    const result = await Promise.all([
      logTypeService.getPage(query),
      logTypeService.getTotalCount(query),
    ]);
    return {
      success: true,
      message: 'OK',
      data: {
        data: result[0],
        total: result[1],
      },
    };
  }

  @Get('/type/:id', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async getDetail(@Param('id') _id: string) {
    const result = await this.logTypeService.detail({ _id });
    if (result) {
      return { success: true, message: 'OK', data: result };
    }
  }

  @Post('/type/file', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async uploadFile(@Fields() fields: UploadFileDTO) {
    const isAdmin = this.ctx.state.userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const logType = await this.logTypeService.detail({ _id: fields.appId });
    if (logType) {
      const files = await this.fileService.upload(fields);
      await this.logTypeService.update({
        _id: fields.appId,
        files: [...logType.files, ...files],
      });
      return { success: true, message: '上传成功', data: true };
    } else {
      throw new CustomHttpError('此应用不存在');
    }
  }

  @Del('/type/file', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async delFile(@Body(ALL) body: DelTypeFileDTO) {
    const isAdmin = this.ctx.state.userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const typeDetail = await this.logTypeService.detail({ _id: body.typeId });
    if (typeDetail) {
      await this.fileService.del({
        _id: body.fileId,
      });
      const files = typeDetail.files.filter(item => {
        return item._id !== body.fileId;
      });
      await this.logTypeService.update({
        _id: body.typeId,
        files,
      });
      return { success: true, message: '删除成功', data: true };
    }
  }

  @Get('/type/report', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async getReport(): Promise<any> {
    const result = await this.logTypeService.getReport();
    return { success: true, message: 'OK', data: result };
  }
}
