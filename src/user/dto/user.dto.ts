import { IsEmail, IsString, Length } from 'class-validator';
import { UserFindForEmail, UserFindForLogin } from './user.decorator';

export class UserDto {
  @Length(3, 10)
  @IsString()
  @UserFindForLogin()
  login: string;
  @IsEmail()
  @UserFindForEmail()
  email: string;
  @IsString()
  @Length(6, 20)
  password: string;
}
