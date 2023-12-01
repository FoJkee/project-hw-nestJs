import { IsString, IsUUID, MaxLength, Validate } from 'class-validator';
import { BlogDecoratorExist } from '../../decorators/blog.decorator';
import { BlogValidator } from '../../validators/blog.validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(30)
  title: string;
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @IsString()
  @MaxLength(1000)
  content: string;
  @IsString()
  @IsUUID()
  // @BlogDecoratorExist()
  @Validate(BlogValidator)
  blogId: string;
}
