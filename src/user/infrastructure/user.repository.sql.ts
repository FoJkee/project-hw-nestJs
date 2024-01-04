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

  async findUserByLogin(login: string) {
    const user = await this.dataSource.query(
      `
    select u.id, u.login
    from "users" u
    where login = $1
    `,
      [login],
    );
    return user[0];
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.dataSource.query(
      `
    select u."id" ,u."email", u."isConfirmed"
    from "users" u
    where "email" = $1
   `,
      [email],
    );
    return user[0];
  }

  async findUserId(userId: string) {
    const user = await this.dataSource.query(
      `
    select u.id
    from "users" u
    where id = $1
    `,
      [userId],
    );
    return user[0];
  }

  async deleteUserId(userId: string) {
    const user = await this.dataSource.query(
      `
     delete
     from "users"
     where "id" = $1
     
    `,
      [userId],
    );

    return user[0] ? user[0] : null;
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
  ): Promise<UserEntity> {
    const user = await this.dataSource.query(
      `
    update public."users"
    set "codeConfirmation" = $1 
    where "id" = $2
    returning "codeConfirmation", "id"
    `,
      [newCodeConfirmation, userId],
    );
    return user[0][0];
  }

  async findUserByConfirmationCode(code: string): Promise<UserEntity> {
    const user = await this.dataSource.query(
      `
    select *
    from "users" 
    where "codeConfirmation" = $1
    `,
      [code],
    );
    return user[0];
  }

  async updateUserPassword(userId: string, password: string) {
    return this.dataSource.query(`
    update "users"
    set "password" = '${password}' and "isConfirmed" = true
        where "id" = '${userId}'
        `);
  }

  async findUserAndUpdateByConfirmationCode(userId: string) {
    const user = await this.dataSource.query(
      `
      update "users" 
      set "isConfirmed" = true
    where "id" = $1
    returning "isConfirmed", "id"
      `,
      [userId],
    );
    return user[0];
  }
  async getUsers(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    const { sortBy, pageSize, pageNumber, sortDirection } =
      pagination(userQueryDto);

    const searchEmailTerm = userQueryDto.searchEmailTerm;

    const searchLoginTerm = userQueryDto.searchLoginTerm;

    const userCount = await this.dataSource.query(
      `
        select count(*)
      from public."users" u
      where u."email" LIKE $1 OR u."login" LIKE $2
    `,
      [`%${searchEmailTerm}%`, `%${searchLoginTerm}%`],
    );
    const count = +userCount[0].count;
    const pageSkip = pageSize * (pageNumber - 1);
    const orderBy = `"${sortBy}" ${sortDirection}`;

    const users = await this.dataSource.query(
      `
        select u."id", u."login", u."email", u."createdAt"
        from "users" u
        where u."login" LIKE $1 OR u."email" LIKE $2
        ORDER BY $5
        LIMIT $3 OFFSET $4 
    `,
      [
        `%${searchEmailTerm}%`,
        `%${searchLoginTerm}%`,
        pageSize,
        pageSkip,
        orderBy,
      ],
    );

    return {
      pagesCount: Math.ceil(count / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: count,
      items: users,
    };
  }

  async createUser(newUser: UserEntity) {
    const createUser = await this.dataSource.query(
      `
        INSERT INTO public."users"("login", "email", "password", "codeConfirmation", "isConfirmed")
        VALUES ($1, $2, $3, $4, $5)
        Returning "id", "login", "email", "createdAt"
      `,
      [
        newUser.login,
        newUser.email,
        newUser.password,
        newUser.codeConfirmation,
        newUser.isConfirmed,
      ],
    );
    return {
      id: createUser[0].id,
      login: createUser[0].login,
      email: createUser[0].email,
      createdAt: createUser[0].createdAt,
    };
  }
}
