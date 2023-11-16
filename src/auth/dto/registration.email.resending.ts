import { IsEmail, IsString } from 'class-validator';

export class RegistrationEmailResending {
  @IsString()
  @IsEmail()
  email: string;
}
