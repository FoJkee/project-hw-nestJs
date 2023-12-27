import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  // async findUserByLogin(login: string): Promise<UserEntity | null> {
  //   return this.UserModel.findOne({ login }, { _id: 0 });
  // }
  //
  // async findUserByEmail(email: string): Promise<UserEntity | null> {
  //   return this.UserModel.findOne({ email }, { _id: 0 });
  // }
  // async _findUserId(userId: string): Promise<UserViewModels | null> {
  //   return this.UserModel.findOne(
  //     { id: userId },
  //     { _id: 0, __v: 0, passwordHash: 0, emailConfirmation: 0 },
  //   );
  // }
  //
  // async findUserId(userId: string): Promise<UserViewModels | null> {
  //   return this.UserModel.findOne({ id: userId });
  // }
  //
  // async deleteUserId(userId: string): Promise<boolean> {
  //   try {
  //     await this.UserModel.deleteOne({ id: userId });
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }
  // async findUserByLoginOrEmail(
  //   loginOrEmail: string,
  // ): Promise<UserEntity | null> {
  //   return this.UserModel.findOne(
  //     {
  //       $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
  //     },
  //     { _id: 0, __v: 0 },
  //   );
  // }
  // async updateUserByConfirmationCode(
  //   userId: string,
  //   newCodeConfirmation: string,
  // ) {
  //   return this.UserModel.findOneAndUpdate(
  //     { id: userId },
  //     {
  //       $set: {
  //         'emailConfirmation.codeConfirmation': newCodeConfirmation,
  //       },
  //     },
  //     { returnDocument: 'after' },
  //   );
  // }
  //
  // async findUserByConfirmationCode(code: string) {
  //   return this.UserModel.findOne({
  //     'emailConfirmation.codeConfirmation': code,
  //   });
  // }
  // async updateUserPassword(userId: string, passwordHash: string) {
  //   return this.UserModel.updateOne(
  //     { id: userId },
  //     { $set: { passwordHash, 'emailConfirmation.isConfirmed': true } },
  //   );
  // }
  //
  // async findUserAndUpdateByConfirmationCode(userId: string) {
  //   return this.UserModel.updateOne(
  //     { id: userId },
  //     { $set: { 'emailConfirmation.isConfirmed': true } },
  //   );
  // }
  async getUsers() {
    // userQueryDto: UserQueryDto
    // const { sortBy, pageSize, pageNumber, sortDirection } =
    //   pagination(userQueryDto);
    //
    // const searchEmailTerm = userQueryDto.searchEmailTerm
    //   ? userQueryDto.searchEmailTerm.toString()
    //   : '';
    // const searchLoginTerm = userQueryDto.searchLoginTerm
    //   ? userQueryDto.searchLoginTerm.toString()
    //   : '';
    //
    // const filter: any = {
    //   $and: [
    //     { email: { $regex: searchEmailTerm ?? '', $options: 'i' } },
    //
    //     { login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
    //   ],
    // };
    // const users = await this.UserModel.find(filter, {
    //   _id: 0,
    //   __v: 0,
    //   passwordHash: 0,
    //   emailConfirmation: 0,
    // })
    //   .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
    //   .skip(pageSize * (pageNumber - 1))
    //   .limit(pageSize);
    // const userCountDocument: number =
    //   await this.UserModel.countDocuments(filter);
    // return {
    //   pagesCount: Math.ceil(userCountDocument / pageSize),
    //   page: pageNumber,
    //   pageSize: pageSize,
    //   totalCount: userCountDocument,
    //   items: users,
    // return this.dataSource.query(SELECT *  FROM public."newUsers"),
  }

  async createUser(newUser: UserEntity): Promise<UserEntity | null> {
    return await this.dataSource.query(`
        INSERT INTO public."users"("login", "email", "createdAt", "passwordHash", "codeConfirmation", "expirationDate", "isConfirmed")
        VALUES ('${newUser.login}', '${newUser.email}', '${newUser.createdAt}', '${newUser.passwordHash}',
                '${newUser.emailConfirmation.codeConfirmation}',
                '${newUser.emailConfirmation.expirationDate}', '${newUser.emailConfirmation.isConfirmed}')`);
  }
}
