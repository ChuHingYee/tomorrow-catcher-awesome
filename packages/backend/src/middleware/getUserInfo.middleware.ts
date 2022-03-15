import { IMiddleware } from '@midwayjs/core';
import { Middleware, Inject } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { CustomHttpError } from '../error/custom.error';

@Middleware()
export class GetUserInfoMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Inject()
  userService: UserService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const userInfo = await this.userService.getUser({
        _id: ctx.state.user.id,
      });
      if (userInfo) {
        ctx.state.userInfo = userInfo;
      } else {
        throw new CustomHttpError('登录超时，请重新登陆', 401);
      }
      const result = await next();
      return result;
    };
  }

  static getName(): string {
    return 'check-user';
  }
}
