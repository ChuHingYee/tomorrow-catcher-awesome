declare module '@midwayjs/koa/dist/interface' {
  interface Context {
    req: {
      user: string;
    };
  }
}
