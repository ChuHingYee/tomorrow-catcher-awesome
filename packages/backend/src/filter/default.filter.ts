import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { MidwayHttpError } from '@midwayjs/core';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error | MidwayHttpError, ctx: Context) {
    ctx.status = (err as MidwayHttpError).status || 400;
    return {
      success: false,
      message:
        err.message === 'Authentication Error'
          ? '登录超时，请重新登陆'
          : err.message,
    };
  }
}
