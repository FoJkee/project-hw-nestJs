import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { UserViewModels } from '../models/user.view.models';
import { randomUUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    return this.UserModel.findOne({ login }, { _id: 0 });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.UserModel.findOne({ email }, { _id: 0 });
  }

  async createUser(newUser: UserEntity): Promise<UserEntity | null> {
    await this.UserModel.create(newUser);
    return this._findUserId(newUser.id);
  }

  async _findUserId(userId: string): Promise<UserViewModels | null> {
    return this.UserModel.findOne(
      { id: userId },
      { _id: 0, __v: 0, passwordHash: 0, emailConfirmation: 0 },
    );
  }

  async findUserId(userId: string): Promise<UserViewModels | null> {
    return this.UserModel.findOne({ id: userId });
  }

  async deleteUserId(userId: string): Promise<boolean> {
    try {
      await this.UserModel.deleteOne({ id: userId });
      return true;
    } catch (e) {
      return false;
    }
  }
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserEntity | null> {
    return this.UserModel.findOne(
      {
        $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      },
      { _id: 0, __v: 0 },
    );
  }
  async updateUserByConfirmationCode(
    userId: string,
    newCodeConfirmation: string,
  ) {
    return this.UserModel.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          'emailConfirmation.codeConfirmation': newCodeConfirmation,
          // 'emailConfirmation.isConfirmed': false,
        },
      },
      { returnDocument: 'after' },
    );
  }

  async findUserByConfirmationCode(code: string) {
    return this.UserModel.findOne({
      'emailConfirmation.codeConfirmation': code,
    });
  }
  async updateUserPassword(userId: string, passwordHash: string) {
    return this.UserModel.updateOne(
      { id: userId },
      { $set: { passwordHash, 'emailConfirmation.isConfirmed': true } },
    );
  }

  async findUserAndUpdateByConfirmationCode(userId: string) {
    return this.UserModel.updateOne(
      { id: userId },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
  }
}
