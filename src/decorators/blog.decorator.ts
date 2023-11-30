import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { BlogService } from '../blog/infrastructure/blog.service';

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

@ValidatorConstraint({ name: 'BlogValidatorExist', async: true })
@Injectable()
export class BlogValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogService: BlogService) {}

  async validate(blogId: string): Promise<boolean> {
    try {
      const res = await this.blogService.findBlogId(blogId);
      if (res) return true;
      return true;
    } catch (e) {
      return false;
    }
  }
  defaultMessage() {
    return `Blog doesn't exist`;
  }
}
