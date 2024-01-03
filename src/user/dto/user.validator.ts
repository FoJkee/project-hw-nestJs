import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { UserRepositorySql } from '../infrastructure/user.repository.sql';

@ValidatorConstraint({ name: 'UserFindForLogin', async: true })
@Injectable()
export class LoginValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRepositorySql: UserRepositorySql,
  ) {}

  async validate(login: string): Promise<boolean> {
    try {
      const res = await this.userRepositorySql.findUserByLogin(login);
      if (res) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Login exist`;
  }
}

@ValidatorConstraint({ name: 'UserFindForEmail', async: true })
@Injectable()
export class EmailValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRepositorySql: UserRepositorySql,
  ) {}

  async validate(email: string): Promise<boolean> {
    try {
      const res = await this.userRepositorySql.findUserByEmail(email);
      if (res) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Email exist`;
  }
}
