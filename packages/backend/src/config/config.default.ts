import { MidwayConfig } from '@midwayjs/core';
import { readFileSync } from 'fs';
import { jwtSecretPath, appSecretPath } from '../paths';
const appKey = readFileSync(appSecretPath).toString();
const jwtKey = readFileSync(jwtSecretPath).toString();

export default {
  keys: appKey,
  koa: {
    port: 7001,
  },
  jwt: {
    secret: jwtKey,
    expiresIn: '2d', // https://github.com/vercel/ms
  },
  mongoose: {
    client: {
      uri: 'mongodb://127.0.0.1:27017/',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'local',
        useFindAndModify: false,
      },
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '50mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: ['map', '.map'],
    // tmpdir: join(__dirname, 'midway-upload-files'),
  },
  crossDomain: {
    origin: '*',
    allowHeaders: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },
} as MidwayConfig;
