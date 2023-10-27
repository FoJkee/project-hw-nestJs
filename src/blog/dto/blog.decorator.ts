import { registerDecorator, ValidationOptions } from 'class-validator';

import { BlogValidator } from './blog.validator';

export function BlogDecoratorExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'BlogValidatorExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogValidator,
    });
  };
}
