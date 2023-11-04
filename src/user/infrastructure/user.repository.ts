import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { UserViewModels } from '../models/user.view.models';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async findUserByLogin(login: string): Promise<User | null> {
    return this.UserModel.findOne({ login }, { _id: 0 });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.UserModel.findOne({ email }, { _id: 0 });
  }

  async createUser(newUser: UserViewModels): Promise<UserViewModels | null> {
    await this.UserModel.create(newUser);
    return this._findUserId(newUser.id);
  }

  async _findUserId(userId: string): Promise<UserViewModels | null> {
    return this.UserModel.findOne(
      { id: userId },
      { _id: 0, __v: 0, passwordHash: 0, emailConfirmation: 0 },
    );
  }

  async deleteUserId(userId: string): Promise<boolean> {
    try {
      await this.UserModel.deleteOne({ id: userId });
      return true;
    } catch (e) {
      return false;
    }
  }
}