import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';

@ValidatorConstraint({ name: 'UserFindForLogin', async: true })
@Injectable()
export class LoginValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(login: string): Promise<boolean> {
    try {
      const res = await this.userRepository.findUserByLogin(login);
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
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string): Promise<boolean> {
    try {
      const res = await this.userRepository.findUserByEmail(email);
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
