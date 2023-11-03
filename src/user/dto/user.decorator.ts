import { registerDecorator, ValidationOptions } from 'class-validator';
import { EmailValidator, LoginValidator } from './user.validator';

export function UserFindForLogin(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserFindForLogin',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: LoginValidator,
    });
  };
}

export function UserFindForEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserFindForEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailValidator,
    });
  };
}
