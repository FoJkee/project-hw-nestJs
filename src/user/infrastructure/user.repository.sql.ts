import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewModels } from '../models/user.view.models';

@Injectable()
export class UserRepositorySql {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findUserByLogin(login: string): Promise<UserEntity> {
    return this.dataSource.query(`
    select * from "users"
    where login = ${login}
    `);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.dataSource.query(`
    select * from "users"
    where email = '${email}'
   `);
  }
  // async _findUserId(userId: string): Promise<UserViewModels | null> {
  //   return this.UserModel.findOne(
  //     { id: userId },
  //     { _id: 0, __v: 0, passwordHash: 0, emailConfirmation: 0 },
  //   );
  // }
  //
  async findUserId(userId: string): Promise<UserViewModels | null> {
    return await this.dataSource.query(`
    select * from public."users"
    where id = '${userId}'
    `);
  }
  //
  async deleteUserId(userId: string): Promise<boolean> {
    await this.dataSource.query(`
     delete from "users"
    where id = '${userId}'
    `);
    return true;
  }
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserEntity | null> {
    return this.dataSource.query(`
    select * from "users" 
    where email = '${loginOrEmail}' or login = '${loginOrEmail}'
    `);
  }

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

  async updateUserByConfirmationCode(
    userId: string,
    newCodeConfirmation: string,
  ) {
    return this.dataSource.query(`
    update users
    set codeConfirmation = '${newCodeConfirmation}'
    where id = '${userId}'
    `);
  }

  async findUserByConfirmationCode(code: string) {
    return this.dataSource.query(`
    select * from "users"
    where codeConfirmation = '${code}'
    `);
  }

  async updateUserPassword(userId: string, password: string) {
    return this.dataSource.query(`
    update "users"
    set "password" = '${password}' and "isConfirmed" = true
        where "id" = '${userId}'
        `);
  }

  async findUserAndUpdateByConfirmationCode(userId: string) {
    return await this.dataSource.query(`
      update "users" 
      set "isConfirmed" = true
          where "id" = ${userId}
    
      `);
  }
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
    await this.dataSource.query(`
        INSERT INTO "users"("login", "email", "createdAt", "password", "codeConfirmation", "expirationDate", "isConfirmed")
        VALUES ('${newUser.login}', '${newUser.email}', '${newUser.createdAt}', '${newUser.password}',
                '${newUser.emailConfirmation.codeConfirmation}',
                '${newUser.emailConfirmation.expirationDate}', '${newUser.emailConfirmation.isConfirmed}')`);

    const res = await this.dataSource.query(`
     select "id", "email", "login", "createdAt" from "users" 
     order by "createdAt" desc 
     `);

    return res[0];

    // return {
    //   id: result.id,
    //   login: result.login,
    //   email: result.email,
    //   createdAt: result.createdAt,
    // } as UserEntity;
  }
}
