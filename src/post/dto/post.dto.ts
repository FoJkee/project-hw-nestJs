import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { BlogDecoratorExist } from '../../decorators/blog.decorator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  @Type(() => String)
  // @BlogDecoratorExist()
  blogId: string;
}
