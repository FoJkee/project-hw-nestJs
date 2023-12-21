import { IsEmail, IsString, Length } from 'class-validator';
import { UserFindForEmail, UserFindForLogin } from './user.decorator';

export class UserDto {
  @IsString()
  @Length(3, 10)
  @UserFindForLogin()
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  @UserFindForEmail()
  email: string;
}
