import { Provide, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { createReadStream } from 'fs';
import { UplpadParams, FileInfo, DelParams, GetFileParams } from './files.type';
const mongoose = require('mongoose');

@Provide()
export class FilesService {
  @Inject()
  ctx: Context;

  async upload(params: UplpadParams) {
    const { ctx } = this;
    const files = ctx.files;
    const conn = mongoose.connections.find(item => {
      return item.name === 'local';
    });
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'fs',
    });
    console.log(files);
    const results: FileInfo[] = [];
    console.log(files);
    try {
      for (const file of files) {
        const filename = file.filename.toLowerCase();
        const uploadStream = bucket.openUploadStream(filename, {
          metadata: {
            typeId: params.appId,
          },
        });
        await createReadStream(file.data).pipe(uploadStream);
        results.push({
          _id: uploadStream.id,
          name: filename,
        });
      }
    } catch (e) {
      console.log(e);
    }
    return results;
  }
  async del(params: DelParams) {
    const conn = mongoose.connections.find(item => {
      return item.name === 'local';
    });
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'fs',
    });
    await bucket.delete(mongoose.Types.ObjectId(params._id));
  }
  getFile(params: GetFileParams) {
    return new Promise(resolve => {
      const conn = mongoose.connections.find(item => {
        return item.name === 'local';
      });
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs',
      });
      const readStream = bucket.openDownloadStreamByName(params.filename);
      if (readStream) {
        const data = [];
        readStream.on('data', chunk => {
          data.push(chunk);
        });
        readStream.on('end', () => {
          const result = Buffer.concat(data);
          resolve(result);
        });
        readStream.on('error', () => {
          resolve(null);
        });
      } else {
        resolve(null);
      }
    });
  }
}
