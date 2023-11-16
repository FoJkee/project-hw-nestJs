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

  async createUser(userDto: UserDto): Promise<UserViewModels | null> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userDto.password, salt);
    const code = randomUUID();

    const newUser: UserEntity = {
      id: randomUUID(),
      login: userDto.login,
      email: userDto.email,
      createdAt: new Date().toISOString(),
      passwordHash,
      emailConfirmation: {
        codeConfirmation: code,
        expirationDate: new Date().toISOString(),
        isConfirmed: false,
      },
    };
    const result = await this.userRepository.createUser({ ...newUser });
    if (!result) throw new NotFoundException();
    return result;
  }

  async deleteUserId(userId: string) {
    const result = await this.userRepository.deleteUserId(userId);
    if (!result) throw new NotFoundException();
    return result;
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

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async updateUserByConfirmationCode(userId: string) {
    return this.userRepository.updateUserByConfirmationCode(userId);
  }

  async findUserByConfirmationCode(code: string) {
    return this.userRepository.findUserByConfirmationCode(code);
  }
  async findUserAndUpdateByConfirmationCode(code: string) {
    const user = await this.userRepository.findUserByConfirmationCode(code);
    if (!user) throw new BadRequestException();
    if (user.emailConfirmation.isConfirmed) throw new BadRequestException();
    await this.userRepository.findUserAndUpdateByConfirmationCode(user.id);
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    return this.userRepository.updateUserPassword(userId, passwordHash);
  }
}
