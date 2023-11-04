import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { User } from '../models/user.schema';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import bcrypt from 'bcrypt';
import { UserViewModels } from '../models/user.view.models';
import { UserRepository } from './user.repository';
import { UserQueryRepository } from './user.query.repository';
import { UserQueryDto } from '../dto/user.query.dto';
import { PaginationView } from '../../pagination/pagination';

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
    const code = randomStringGenerator();

    const newUser: User = {
      id: randomStringGenerator(),
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
    return this.userRepository.createUser({ ...newUser });
  }

  async deleteUserId(userId: string): Promise<boolean> {
    return this.userRepository.deleteUserId(userId);
  }
}