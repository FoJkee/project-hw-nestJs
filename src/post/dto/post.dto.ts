import { IsString, IsUUID, Length } from 'class-validator';

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
  // @BlogDecoratorExist()
  blogId: string;
}
export class CreatePostDto {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
}
