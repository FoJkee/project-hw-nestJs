import { IsString, Length } from 'class-validator';
import {
  UserFindForEmail,
  UserFindForLogin,
} from '../../user/dto/user.decorator';

export class RegistrationDto {
  @IsString()
  @Length(3, 10)
  @UserFindForLogin()
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @UserFindForEmail()
  email: string;
}
