import { Provide, Scope, ScopeEnum, Config } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../entity/user';
import { CustomHttpError } from '../error/custom.error';
import { HttpStatus } from '@midwayjs/core';
import {
  initRandomString,
  bhash,
  bcompare,
  generateToken,
  verifyToken,
} from '../libs/utils';
const mongoose = require('mongoose');
import type { JwtPayload } from 'jsonwebtoken';
import type {
  GetUserParams,
  AddUserParams,
  UpdateInfoParams,
  UpdatePasswordParams,
  UpdatePasswordByAdminParams,
  UpdateStatusParams,
  PageParams,
  LoginParams,
  RefreshTokenParams,
} from './user.type';

@Provide()
@Scope(ScopeEnum.Singleton)
export class UserService {
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  @Config('jwt')
  jwtConfig;

  async getUser(params: GetUserParams) {
    const user = await this.userModel.findOne({ _id: params._id }).exec();
    return user;
  }

  async getPage(params: PageParams) {
    const { page, size, name } = params;
    const task: any[] = [
      this.userModel.countDocuments({
        name: { $regex: name || '', $options: '$i' },
      }),
      await this.userModel
        .find(
          {
            name: { $regex: name || '', $options: '$i' },
          },
          {
            password: 0,
            __v: 0,
          }
        )
        .skip((page - 1) * size)
        .limit(size)
        .sort({ _id: -1 })
        .exec(),
    ];
    const result = await Promise.all(task);
    return {
      total: result[0],
      data: result[1],
    };
  }

  async add(params: AddUserParams): Promise<string> {
    const user = await this.userModel
      .findOne({ account: params.account })
      .exec();
    if (user) {
      throw new CustomHttpError('此账号已存在～');
    }
    const _password = initRandomString(6);
    const _hashPassword = bhash(_password);
    const _roles = ['vistor'];
    const hasAdmin = params.type.some(item => {
      return item === 0;
    });
    if (hasAdmin) {
      _roles.push('admin');
    }
    await this.userModel.create({
      name: params.name,
      account: params.account,
      password: _hashPassword,
      roles: _roles,
      lastLoginTime: -1,
      status: 1,
      createdAt: Date.now(),
      updatedAt: 0,
    } as User);
    return _password;
  }
  async uodateInfo(params: UpdateInfoParams) {
    const result = await this.userModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(params._id),
      {
        name: params.name,
      }
    );
    return !!result;
  }
  async updatePassword(params: UpdatePasswordParams) {
    const user = await this.userModel
      .findOne({
        _id: mongoose.Types.ObjectId(params._id),
      })
      .exec();
    if (user) {
      const flag = bcompare(params.oldPassword, user.password);
      if (flag) {
        const _password = bhash(params.newPassword);
        const result = await this.userModel.findByIdAndUpdate(
          mongoose.Types.ObjectId(params._id),
          {
            password: _password,
          }
        );
        return !!result;
      } else {
        throw new CustomHttpError('原密码不正确，请重新输入');
      }
    } else {
      throw new CustomHttpError('此账号不存在～');
    }
  }
  async updatePasswordByAdmin(params: UpdatePasswordByAdminParams) {
    const user = await this.userModel
      .findOne({
        _id: mongoose.Types.ObjectId(params._id),
      })
      .exec();
    if (user) {
      const _password = initRandomString(6);
      const _hashPassword = bhash(_password);
      await this.userModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(params._id),
        {
          password: _hashPassword,
        }
      );
      return _password;
    } else {
      throw new CustomHttpError('此账号不存在～');
    }
  }
  async updateStatus(params: UpdateStatusParams) {
    console.log(params.status);
    const result = await this.userModel.updateMany(
      { _id: { $in: params.ids } },
      { $set: { status: params.status } }
    );
    return !!result;
  }

  async login(body: LoginParams) {
    const { account, password } = body;
    console.log(body, 'oooo');
    console.log(account, 'account');
    console.log(password, 'password');
    const user = await this.userModel.findOne({ account }).exec();
    // find data
    console.log(user);
    console.log(password);
    console.log(user.password);
    if (user) {
      const flag = bcompare(password, user.password);
      console.log(flag);
      if (flag) {
        const token = generateToken({ id: user.id }, 1, this.jwtConfig.secret);
        const refreshToken = generateToken(
          { id: user.id },
          2,
          this.jwtConfig.secret
        );
        const result = await this.userModel
          .findByIdAndUpdate(
            user.id,
            { lastLoginTime: Date.now() },
            { new: true }
          )
          .exec();
        const { name, account, roles, lastLoginTime, createdAt, updatedAt } =
          result;
        const userInfo = {
          name,
          account,
          roles,
          token,
          refreshToken,
          lastLoginTime,
          id: user.id,
          createdAt,
          updatedAt,
        };
        return userInfo;
      } else {
        throw new CustomHttpError('密码错误');
      }
    } else {
      throw new CustomHttpError('没有此用户');
    }
  }
  async refreshToken(body: RefreshTokenParams) {
    const { _id, token } = body;
    const code = verifyToken(token, this.jwtConfig.secret);
    if (code) {
      if (_id === (code as JwtPayload).id) {
        const user = await this.userModel
          .findOne({
            _id: mongoose.Types.ObjectId((code as JwtPayload).id),
          })
          .exec();
        if (user) {
          const token = generateToken(
            { id: user.id },
            1,
            this.jwtConfig.secret
          );
          const refreshToken = generateToken(
            { id: user.id },
            2,
            this.jwtConfig.secret
          );
          console.log({
            token,
            refreshToken,
          });
          return {
            token,
            refreshToken,
          };
        }
      }
    }
    throw new CustomHttpError(
      '登陆已过期，请重新登陆',
      HttpStatus.UNAUTHORIZED
    );
  }
}
