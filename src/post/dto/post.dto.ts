import { IsString, IsUUID, Length } from 'class-validator';
import { BlogDecoratorExist } from '../../decorators/blog.decorator';
import { Transform } from 'class-transformer';
import { TransformFnParams } from 'class-transformer/types/interfaces';

export class CreatePostForBlogDto {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
  @IsString()
  @IsUUID()
  @BlogDecoratorExist()
  blogId: string;
}
export class CreatePostDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 30)
  title: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  @Length(1, 1000)
  content: string;
}
