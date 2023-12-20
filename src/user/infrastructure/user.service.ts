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
import { UserQueryRepository } from './user.query.repository';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}
  async getUser(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationView<UserViewModels[]>> {
    return this.userQueryRepository.getUsers(userQueryDto);
  }

  async createUser(userDto: UserDto): Promise<UserEntity | null> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userDto.password, salt);

    const newUser: UserEntity = {
      id: randomUUID(),
      login: userDto.login,
      email: userDto.email,
      createdAt: new Date().toISOString(),
      passwordHash,
      emailConfirmation: {
        codeConfirmation: randomUUID(),
        expirationDate: new Date().toISOString(),
        isConfirmed: false,
      },
    };
    const result = await this.userRepository.createUser({ ...newUser });
    if (!result) throw new BadRequestException();
    return newUser;
  }

  async deleteUserId(userId: string) {
    const user = await this.userRepository.findUserId(userId);
    if (!user) throw new NotFoundException();
    return this.userRepository.deleteUserId(userId);
  }

  async validateUserAndPass(
    loginOrEmail: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const comparePassword = await bcrypt.compare(password, user.passwordHash);
    if (!comparePassword) return null;
    return user;
  }

  async findUserId(userId: string): Promise<UserViewModels | null> {
    return this.userRepository.findUserId(userId);
  }

  async updateUserByConfirmationCode(
    userId: string,
    newCodeConfirmation: string,
  ) {
    return this.userRepository.updateUserByConfirmationCode(
      userId,
      newCodeConfirmation,
    );
  }

  async findUserByConfirmationCode(code: string) {
    return this.userRepository.findUserByConfirmationCode(code);
  }
  async findUserAndUpdateByConfirmationCode(code: string) {
    const user = await this.userRepository.findUserByConfirmationCode(code);
    if (!user)
      throw new BadRequestException([
        // {
        //   message: 'invalid code',
        //   field: 'code',
        // },
      ]);
    if (user.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message: 'invalid code',
          field: 'code',
        },
      ]);
    await this.userRepository.findUserAndUpdateByConfirmationCode(user.id);
    return;
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    return this.userRepository.updateUserPassword(userId, passwordHash);
  }
}
