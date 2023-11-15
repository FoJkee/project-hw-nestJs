import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
