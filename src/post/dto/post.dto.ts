import { IsString, MaxLength } from 'class-validator';
import { BlogDecoratorExist } from '../../blog/dto/blog.decorator';

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
  @BlogDecoratorExist()
  blogId: string;
}
