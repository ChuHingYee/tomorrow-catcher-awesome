import {
  Inject,
  Controller,
  Post,
  Put,
  Get,
  Provide,
  Body,
  Query,
  ALL,
} from '@midwayjs/decorator';
import { HttpStatus } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';
import { UserService } from '../service/user.service';
import {
  PageDTO,
  UpdatePasswordDTO,
  UpdatePasswordByAdminDTO,
  ManyStatusDTO,
  InfoDTO,
  UserDTO,
  GetUserDTO,
  LoginDTO,
  refreshTokenDTO,
} from '../dto/user';
import { CustomHttpError } from '../error/custom.error';
import { JwtPassportMiddleware } from '../middleware/jwt.middleware';
import { GetUserInfoMiddleware } from '../middleware/getUserInfo.middleware';

@Provide()
@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/user/login')
  @Validate()
  async login(@Body(ALL) body: LoginDTO) {
    const user = await this.userService.login(body);
    return { success: true, message: 'OK', data: user };
  }

  @Post('/user/refresh')
  @Validate()
  async refreshToken(@Body(ALL) body: refreshTokenDTO) {
    const result = await this.userService.refreshToken(body);
    return { success: true, message: 'OK', data: result };
  }

  @Post('/user', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async add(@Body(ALL) body: UserDTO) {
    console.log(body);
    const userInfo = this.ctx.state.userInfo;
    console.log(this.ctx.state);
    console.log(userInfo);
    const isAdmin = userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const password = await this.userService.add(body);
    return { success: true, message: 'OK', data: password };
  }

  @Get('/user', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async getUser(@Query(ALL) query: GetUserDTO) {
    const userInfo = this.ctx.state.userInfo;
    const isAdmin = userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin && query.id !== userInfo.id) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.getUser({ _id: query.id });
    if (user) {
      return {
        success: true,
        message: 'OK',
        data: {
          _id: user._id,
          lastLoginTime: user.lastLoginTime,
          createdAt: (user as any).createdAt,
          updatedAt: (user as any).updatedAt,
          status: user.status,
          roles: user.roles,
          name: user.name,
          account: user.account,
        },
      };
    } else {
      throw new CustomHttpError('查询错误');
    }
  }

  @Put('/user/info', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  async rename(@Body(ALL) body: InfoDTO) {
    const userInfo = this.ctx.state.userInfo;
    const isAdmin = userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const result = await this.userService.uodateInfo(body);
    return { success: true, message: 'OK', data: result };
  }

  @Put('/user/password', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async updatePassword(@Body(ALL) body: UpdatePasswordDTO) {
    const userInfo = this.ctx.state.userInfo;
    const result = await this.userService.updatePassword({
      ...body,
      _id: userInfo._id,
    });
    return { success: true, message: '更改成功', data: result };
  }

  @Put('/user/admin/password', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async updatePasswordByAdmin(@Body(ALL) body: UpdatePasswordByAdminDTO) {
    const userInfo = this.ctx.state.userInfo;
    const isAdmin = userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const result = await this.userService.updatePasswordByAdmin({
      ...body,
    });
    return { success: true, message: '更改成功', data: result };
  }

  @Put('/user/status', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async updateStatus(@Body(ALL) body: ManyStatusDTO) {
    const userInfo = this.ctx.state.userInfo;
    const isAdmin = userInfo.roles.some(item => {
      return item === 'admin';
    });
    if (!isAdmin) {
      throw new CustomHttpError('您的账号没有权利～', HttpStatus.FORBIDDEN);
    }
    const result = await this.userService.updateStatus(body);
    return { success: true, message: '更改成功', data: result };
  }

  @Get('/user/page', {
    middleware: [JwtPassportMiddleware, GetUserInfoMiddleware],
  })
  @Validate()
  async page(@Query(ALL) query: PageDTO) {
    const result = await this.userService.getPage(query);
    return { success: true, message: 'OK', data: result };
  }
}
