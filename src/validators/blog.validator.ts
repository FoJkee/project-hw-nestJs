import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../blog/infrastructure/blog.repository';

@ValidatorConstraint({ name: 'BlogValidatorExist', async: true })
@Injectable()
export class BlogValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogRepository: BlogRepository) {}

  async validate(blogId: string): Promise<boolean> {
    const blog = await this.blogRepository.findBlogId(blogId);
    if (!blog) return false;
    return true;
  }

  defaultMessage() {
    return `Blog doesn't exist`;
  }
}
