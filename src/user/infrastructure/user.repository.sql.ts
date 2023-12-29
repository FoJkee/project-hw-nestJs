import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewModels } from '../models/user.view.models';
import { pagination, PaginationView } from '../../pagination/pagination';
import { UserQueryDto } from '../dto/user.query.dto';

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
  async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(userQueryDto);

    const searchEmailTerm = userQueryDto.searchEmailTerm
      ? userQueryDto.searchEmailTerm.toString()
      : '';
    const searchLoginTerm = userQueryDto.searchLoginTerm
      ? userQueryDto.searchLoginTerm.toString()
      : '';

    const userCount = await this.dataSource.query(`
        select count(*) as "total"
      from public."users" u
      where u."email" LIKE '%${searchEmailTerm}%' OR u."login" LIKE '%${searchLoginTerm}%'
    `);

    const count = +userCount[0].total;
    const pageSkip = pageSize * (pageNumber - 1);

    const users = await this.dataSource.query(`
        select u."id", u."login", u."email", u."createdAt"
        from "users" u
        where u."login" LIKE '${searchEmailTerm}%' OR u."email" LIKE '%${searchLoginTerm}%'
        ORDER BY "${sortBy}" ${sortDirection}
        OFFSET ${pageSkip} LIMIT ${pageSize}
    `);

    return {
      pagesCount: Math.ceil(count / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: count,
      items: users,
    };
  }

  async createUser(newUser: UserEntity): Promise<UserEntity | null> {
    await this.dataSource.query(`
        INSERT INTO public."users"("login", "email", "createdAt", "password", "codeConfirmation", "expirationDate", "isConfirmed")
        VALUES ('${newUser.login}', '${newUser.email}', '${newUser.createdAt}', '${newUser.password}',
                '${newUser.emailConfirmation.codeConfirmation}',
                '${newUser.emailConfirmation.expirationDate}', '${newUser.emailConfirmation.isConfirmed}')`);

    const result = await this.dataSource.query(`
        select u."id", u."login", u."email", u."createdAt"
        from public."users" u
        order by u."createdAt" desc 
        OFFSET 0 LIMIT 1
    `);
    return result[0];
    // return {
    //   id: result.id,
    //   login: result.login,
    //   email: result.email,
    //   createdAt: result.createdAt,
    // } as UserEntity;
  }
}
