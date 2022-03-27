import { Provide, Inject } from '@midwayjs/decorator';
import { LogType } from '../entity/logType';
import { Log } from '../entity/log';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { SourceMapConsumer } from 'source-map';
import { normalize } from 'path';
import {
  getYearStartAndEnd,
  getMonthStartAndEnd,
  getDaysInMonth,
} from '../libs/utils';
const mongoose = require('mongoose');

import type {
  SaveParams,
  PageParams,
  GetLogParams,
  OriginCodeParams,
  Code,
  PageResult,
  ReportParams,
  ReportByMonthParams,
} from './logs.type';

interface PageMatchParams {
  appKey?: string;
}

@Provide()
export class LogsService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(LogType)
  logTypeModel: ReturnModelType<typeof LogType>;

  @InjectEntityModel(Log)
  logModel: ReturnModelType<typeof Log>;

  async save(params: SaveParams): Promise<boolean> {
    const formatList = [];
    params.list.forEach(item => {
      formatList.push({
        appKey: mongoose.Types.ObjectId(params.appKey),
        systemInfo: item.systemInfo,
        trace: item.trace,
        customInfo: JSON.stringify(item.customInfo),
        time: item.time,
        createdAt: Date.now(),
        type: item.type || '',
        href: item.href || '',
        message: item.message || '',
        stack: item.stack || '',
      });
    });
    await this.logModel.insertMany(formatList);
    return true;
  }
  async getPage(params: PageParams) {
    const { page, size, appKey } = params;
    const matchParams: PageMatchParams = {};
    if (appKey) {
      matchParams.appKey = appKey;
    }
    const result: PageResult[] = await this.logModel.aggregate([
      {
        $match: { ...matchParams },
      },
      {
        $facet: {
          data: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $lookup: {
                from: 'logtypes',
                localField: 'appKey',
                foreignField: '_id',
                as: 'appInfo',
              },
            },
            {
              $unwind: {
                path: '$appInfo',
              },
            },
            {
              $project: {
                appKey: 0,
                trace: 0,
                __v: 0,
              },
            },
            { $skip: (page - 1) * size },
            { $limit: size },
          ],
          total: [
            {
              $count: 'totalCount',
            },
          ],
        },
      },
    ]);
    if (result[0].data.length > 0) {
      return {
        data: result[0].data || [],
        total: result[0].total[0].totalCount || 0,
      };
    } else {
      return {
        data: [],
        total: 0,
      };
    }
  }
  async getLog(params: GetLogParams): Promise<any> {
    const logDetail = await this.logModel.findOne({ _id: params.id }).exec();
    const {
      appKey,
      _id,
      systemInfo,
      type,
      href,
      message,
      stack,
      trace,
      customInfo,
      time,
      createdAt,
    } = logDetail;
    const appInfo = await this.logTypeModel.findOne({ _id: appKey }).exec();
    console.log(appInfo);
    return {
      _id,
      systemInfo,
      trace,
      customInfo,
      time,
      createdAt,
      type,
      href,
      message,
      stack,
      appInfo: {
        createdAt: appInfo.createdAt,
        name: appInfo.name,
        status: appInfo.status,
        updatedAt: appInfo.updatedAt,
        _id: appInfo._id,
      },
    };
  }
  async getOriginCode(params: OriginCodeParams): Promise<any> {
    const { sourceMap, info } = params;
    const rawSourceMap = JSON.parse(sourceMap.toString('utf8', 0.5));
    const result = await SourceMapConsumer.with(
      rawSourceMap,
      null,
      async consumer => {
        // 得到压缩前的源码位置
        return consumer.originalPositionFor({
          line: info.line,
          column: info.column,
        });
      }
    );
    if (!result.source || !result.line) {
      throw new Error('没有此错误源码');
    }
    const {
      // 所有压缩前的源码 是一个数组
      sourcesContent,
      // 所有压缩前的源码文件名 是一个数组 且与 sourcesContent 数组位置一一对应
      sources,
    } = rawSourceMap;
    // 根据 parsed 的 source 找到在 fileContent.sources 的位置
    const sourcesContentIndex = sources
      .map(normalize)
      .indexOf(normalize(result.source));
    if (sourcesContentIndex > -1) {
      // 根据二者数组位置一一对应 可得到压缩前的源码
      const sourceCode = sourcesContent[sourcesContentIndex];
      const lines = sourceCode.split('\n');
      const length = lines.length;
      // 取 stack 位置 6 行内的 code
      const start = result.line >= 3 ? result.line - 3 : 0;
      const end = start + 5 >= length ? length : start + 5;

      const codes: Code[] = [];
      for (let i = start; i <= end; i++) {
        codes.push({
          highlight: i + 1 === result.line,
          number: i + 1,
          code: lines[i],
        });
      }
      return { result, codes };
    }
  }
  async getReportForType() {
    return await this.logModel.aggregate([
      {
        $lookup: {
          from: 'logtypes',
          localField: 'appKey',
          foreignField: '_id',
          as: 'appInfo',
        },
      },
      {
        $unwind: {
          path: '$appInfo',
        },
      },
      {
        $group: {
          _id: {
            id: '$appKey',
            name: '$appInfo.name',
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
  async getReportByYear(params: ReportParams) {
    const matchParams: PageMatchParams = {};
    if (params.appKey) {
      matchParams.appKey = params.appKey;
    }
    const range = getYearStartAndEnd(params.year);
    const months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const dbDatas = await this.logModel.aggregate([
      {
        $match: {
          time: {
            $gte: range.start,
            $lte: range.end,
          },
          ...matchParams,
        },
      },
      {
        $lookup: {
          from: 'logtypes',
          localField: 'appKey',
          foreignField: '_id',
          as: 'appInfo',
        },
      },
      {
        $unwind: {
          path: '$appInfo',
        },
      },
      {
        $project: {
          time: {
            $dateToString: {
              format: '%m',
              date: {
                $add: [new Date('Thu, 01 Jan 1970 00:00:00 GMT'), '$time'],
              },
            },
          },
          appKey: 1,
          appInfo: 1,
        },
      },
      {
        $group: {
          _id: {
            appKey: '$appKey',
            time: '$time',
            appName: '$appInfo.name',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $group: {
          _id: {
            appKey: '$_id.appKey',
            name: '$_id.appName',
          },
          list: {
            $push: {
              time: '$_id.time',
              count: '$count',
            },
          },
        },
      },
    ]);
    return dbDatas.map(item => {
      const { _id, list } = item;
      return {
        name: _id.name,
        id: _id.appKey,
        list: months.map(month => {
          const _data = list.find(citem => {
            return citem.time === month;
          });
          return {
            label: month,
            count: _data ? _data.count : 0,
          };
        }),
      };
    });
  }
  async getReportByMonth(params: ReportByMonthParams) {
    const matchParams: PageMatchParams = {};
    if (params.appKey) {
      matchParams.appKey = params.appKey;
    }
    const range = getMonthStartAndEnd(new Date(Number(params.date)));
    const days = Array.from(new Array(getDaysInMonth(range.start)).keys());
    const dbDatas = await this.logModel.aggregate([
      {
        $match: {
          time: {
            $gte: Number(range.start),
            $lte: Number(range.end),
          },
          ...matchParams,
        },
      },
      {
        $lookup: {
          from: 'logtypes',
          localField: 'appKey',
          foreignField: '_id',
          as: 'appInfo',
        },
      },
      {
        $unwind: {
          path: '$appInfo',
        },
      },
      {
        $project: {
          time: {
            $dateToString: {
              format: '%d',
              date: {
                $add: [new Date('Thu, 01 Jan 1970 00:00:00 GMT'), '$time'],
              },
            },
          },
          appKey: 1,
          appInfo: 1,
        },
      },
      {
        $group: {
          _id: {
            appKey: '$appKey',
            time: '$time',
            appName: '$appInfo.name',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $group: {
          _id: {
            appKey: '$_id.appKey',
            name: '$_id.appName',
          },
          list: {
            $push: {
              time: '$_id.time',
              count: '$count',
            },
          },
        },
      },
    ]);
    return dbDatas.map(item => {
      const { _id, list } = item;
      return {
        name: _id.name,
        id: _id.appKey,
        list: days.map(day => {
          const _data = list.find(citem => {
            return Number(citem.time) === day + 1;
          });
          return {
            label: String(day + 1),
            count: _data ? _data.count : 0,
          };
        }),
      };
    });
  }
}
