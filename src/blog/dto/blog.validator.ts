import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogService } from '../infrastructure/blog.service';

@ValidatorConstraint({ name: 'BlogValidatorExist', async: true })
@Injectable()
export class BlogValidator implements ValidatorConstraintInterface {
  constructor(private blogService: BlogService) {}

  async validate(id: string) {
    try {
      const blogData = await this.blogService.findBlogId(id);
      if (!blogData) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}

// customBlogIdValidator = body('blogId').custom(async (name) => {
//   const blogData = await this.blogService.getBlogId(name)
//   if (!blogData) throw new Error()
//   return true

// @ValidatorConstraint({ name: 'UserExists', async: true })
// @Injectable()
// export class UserExistsRule implements ValidatorConstraintInterface {
//   constructor(private usersRepository: UsersRepository) {}
//
//   async validate(value: number) {
//     try {
//       await this.usersRepository.getOneOrFail(value);
//     } catch (e) {
//       return false;
//     }
//
//     return true;
//   }
//
//   defaultMessage(args: ValidationArguments) {
//     return `User doesn't exist`;
//   }
// }
