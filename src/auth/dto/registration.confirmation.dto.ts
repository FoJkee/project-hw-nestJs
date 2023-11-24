import { IsString } from 'class-validator';

export class RegistrationConfirmationDto {
  @IsString()
  code: string;
}
