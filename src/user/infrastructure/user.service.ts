import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../models/user.schema';
import bcrypt from 'bcrypt';
import { UserViewModels } from '../models/user.view.models';
import { UserRepository } from './user.repository';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { randomUUID } from 'crypto';
import { UserRepositorySql } from './user.repository.sql';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRepositorySql: UserRepositorySql,
  ) {}
  async getUser(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return this.userRepositorySql.getUsers(userQueryDto);
  }

  async createUser(userDto: UserDto) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userDto.password, salt);

    const newUser: UserEntity = {
      id: randomUUID(),
      login: userDto.login,
      email: userDto.email,
      password: password,
      createdAt: new Date().toISOString(),
      codeConfirmation: randomUUID(),
      isConfirmed: false,
    };
    const result = await this.userRepositorySql.createUser(newUser);

    if (!result) throw new BadRequestException();
    return newUser;
  }

  async deleteUserId(userId: string) {
    const user = await this.userRepositorySql.findUserId(userId);
    if (!user) throw new NotFoundException();
    return await this.userRepositorySql.deleteUserId(userId);
  }

  async validateUserAndPass(
    loginOrEmail: string,
    password: string,
  ): Promise<UserViewModels | null> {
    const user =
      await this.userRepositorySql.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return null;
    return user;
  }

  async findUserId(userId: string) {
    return await this.userRepositorySql.findUserId(userId);
  }

  async updateUserByConfirmationCode(
    userId: string,
    newCodeConfirmation: string,
  ) {
    return await this.userRepositorySql.updateUserByConfirmationCode(
      userId,
      newCodeConfirmation,
    );
  }

  async findUserByConfirmationCode(code: string) {
    return this.userRepositorySql.findUserByConfirmationCode(code);
  }

  async findUserAndUpdateByConfirmationCode(code: string) {
    const user = await this.userRepositorySql.findUserByConfirmationCode(code);
    console.log('user', user);
    if (!user) throw new BadRequestException();
    if (user.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message: 'invalid code',
          field: 'code',
        },
      ]);
    await this.userRepositorySql.findUserAndUpdateByConfirmationCode(user.id);
    return;
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    return this.userRepository.updateUserPassword(userId, passwordHash);
  }
}
