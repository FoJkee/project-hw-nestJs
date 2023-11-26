import { IsEmail } from 'class-validator';
import { UserFindForEmail } from '../../user/dto/user.decorator';

export class RegistrationEmailResending {
  @IsEmail()
  @UserFindForEmail()
  email: string;
}
