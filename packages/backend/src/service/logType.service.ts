import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { LogType } from '../entity/logType';
import { ReturnModelType } from '@typegoose/typegoose';
import { CustomHttpError } from '../error/custom.error';
const mongoose = require('mongoose');
import type {
  PageParams,
  TypeParams,
  UpdateParams,
  DetailParams,
} from './logType.type';

@Provide()
export class LogTypeService {
  @InjectEntityModel(LogType)
  logTypeModel: ReturnModelType<typeof LogType>;

  async getPage(params: PageParams) {
    const { page, size, name, id } = params;
    if (page === -1) {
      const list = await this.logTypeModel.find().sort({ _id: -1 }).exec();
      return list;
    } else {
      const options: any = {};
      if (name) {
        options.name = { $regex: name || '', $options: '$i' };
      }
      if (id) {
        options.id = mongoose.Types.ObjectId(id);
      }
      const list = await this.logTypeModel
        .find(options)
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 })
        .exec();
      return list;
    }
  }
  async getTotalCount(params: PageParams) {
    const { name, id } = params;
    const options: any = {};
    if (name) {
      options.name = { $regex: name || '', $options: '$i' };
    }
    if (id) {
      options.id = mongoose.Types.ObjectId(id);
    }
    const total = await this.logTypeModel.countDocuments(options);
    return total;
  }
  async save(body: TypeParams) {
    const type = await this.logTypeModel.findOne({ name: body.name }).exec();
    if (type) {
      throw new CustomHttpError('此应用key已经存在');
    } else {
      const { _id: id } = await this.logTypeModel.create({
        ...body,
        files: [],
        createdAt: Date.now(),
        updatedAt: null,
      });
      return id;
    }
  }
  async update(body: UpdateParams) {
    const { _id, ...rest } = body;
    console.log(body, 'body');
    const result = await this.logTypeModel.findByIdAndUpdate(_id, {
      ...rest,
      updatedAt: Date.now(),
    });
    return result;
  }
  async del(body: DetailParams) {
    const result = await this.logTypeModel.findByIdAndDelete(body._id);
    return result;
  }
  async detail(params: DetailParams) {
    const result = await this.logTypeModel
      .findOne({ _id: mongoose.Types.ObjectId(params._id) })
      .exec();
    return result;
  }
  async getReport() {
    return await this.logTypeModel.aggregate([
      {
        $group: {
          _id: {
            id: '$_id',
            name: '$name',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id.name',
          id: '$_id.id',
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
}
