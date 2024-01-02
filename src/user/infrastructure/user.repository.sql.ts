import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user.schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewModels } from '../models/user.view.models';
import { pagination, PaginationView } from '../../pagination/pagination';
import { UserQueryDto } from '../dto/user.query.dto';

@Injectable()
export class UserRepositorySql {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findUserByLogin(login: string): Promise<UserEntity> {
    const user = await this.dataSource.query(
      `
    select u.id
    from "users" u
    where login = $1
    `,
      [login],
    );
    return user[0] ? user[0] : null;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.dataSource.query(
      `
    select u.*
    from "users" u
    where email = $1
   `,
      [email],
    );
    return user[0] ? user[0] : null;
  }

  async findUserId(userId: string) {
    const user = await this.dataSource.query(
      `
    select *
    from "users"
    where id = $1
    `,
      [userId],
    );
    if (user[0]) {
      return {
        id: user[0].id,
      };
    } else {
      return null;
    }
  }

  async deleteUserId(userId: string): Promise<boolean> {
    await this.dataSource.query(
      `
     delete
     from "users"
     where id = $1
    `,
      [userId],
    );
    return true;
  }
  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = await this.dataSource.query(
      `
    select u.id, u.login, u.email, u.password
    from "users" u
    where login = $1 or email = $1
    `,
      [loginOrEmail],
    );
    if (user[0]) {
      return {
        id: user[0].id,
        login: user[0].login,
        password: user[0].password,
      } as UserEntity;
    } else {
      return null;
    }
  }

  async updateUserByConfirmationCode(
    userId: string,
    newCodeConfirmation: string,
  ): Promise<UserEntity | null> {
    const user = await this.dataSource.query(
      `
    update public."users"
    set "codeConfirmation" = $1 
    where "id" = $2
    returning *
    `,
      [newCodeConfirmation, userId],
    );
    return user[0][0];
  }

  async findUserByConfirmationCode(code: string) {
    const user = await this.dataSource.query(
      `
    select *
    from "users" 
    where codeConfirmation = $1
    `,
      [code],
    );
    return user[0] && user[0].isConfirmed !== true ? user[0] : null;
  }

  async updateUserPassword(userId: string, password: string) {
    return this.dataSource.query(`
    update "users"
    set "password" = '${password}' and "isConfirmed" = true
        where "id" = '${userId}'
        `);
  }

  async findUserAndUpdateByConfirmationCode(userId: string) {
    return await this.dataSource.query(
      `
      update "users" 
      set "isConfirmed" = true
          where "id" = $1
    
      `,
      [userId],
    );
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

  async createUser(newUser: UserEntity) {
    return await this.dataSource.query(
      `
        INSERT INTO public."users"("login", "email", "createdAt", "password", "codeConfirmation", "isConfirmed")
        VALUES ($1, $2, $3, $4, $5, $6)
        returning "id", "login", "email", "createdAt"
      `,
      [
        newUser.login,
        newUser.email,
        newUser.createdAt,
        newUser.password,
        newUser.emailConfirmation.codeConfirmation,
        newUser.emailConfirmation.expirationDate,
        newUser.emailConfirmation.isConfirmed,
      ],
    );
    // return {
    //   id: createUser[0].id.toString(),
    //   login: createUser[0].login,
    //   email: createUser[0].email,
    //   createdAt: createUser[0].createdAt,
    // };
  }
}
