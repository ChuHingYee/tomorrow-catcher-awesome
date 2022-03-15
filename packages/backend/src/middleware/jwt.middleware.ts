import { IMiddleware } from '@midwayjs/core';
import { Middleware, Config } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
const jwt = require('koa-jwt');

@Middleware()
export class JwtPassportMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('jwt')
  jwtConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      console.log(this.jwtConfig);
      await jwt({
        secret: this.jwtConfig.secret,
        getToken: ctx => {
          if (
            ctx.headers.authorization &&
            ctx.headers.authorization.split(' ')[0] === 'Bearer'
          ) {
            console.log(ctx.headers.authorization.split(' ')[1]);
            return ctx.headers.authorization.split(' ')[1];
          } else if (ctx.query && ctx.query.token) {
            return ctx.query.token;
          }
          return null;
        },
      })(ctx, next);
    };
  }

  static getName(): string {
    return 'jwt';
  }
}
