import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginDto } from '../dto/login.dto';
import { DeviceName } from '../../decorators/deviceName.decorator';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from '../../guard/refreshToken.guard';
import { UserEntity } from '../../user/models/user.schema';
import { User } from '../../decorators/user.decorator';
import {
  RefreshToken,
  RefreshTokenDecorator,
} from '../../decorators/refreshtoken.decorator';
import { DeviceDto } from '../../security-devices/dto/device.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { NewPasswordDto } from '../dto/newpassword.dto';
import { RegistrationConfirmationDto } from '../dto/registration.confirmation.dto';
import { RegistrationEmailResending } from '../dto/registration.email.resending';
import { BearerAuthGuard } from '../../guard/bearer.auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
    @DeviceName() deviceName: string,
  ) {
    try {
      const newLogin = await this.authService.login(loginDto, ip, deviceName);
      if (!newLogin) return null;
      const { accessToken, refreshToken } = newLogin;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return { accessToken: accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/me')
  @UseGuards(BearerAuthGuard)
  @HttpCode(200)
  async aboutMe(@User() user: UserEntity) {
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }

  @Post('/logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logout(
    @RefreshTokenDecorator() deviceDto: DeviceDto,
    @User() user: UserEntity,
  ) {
    const result = await this.authService.logout(deviceDto, user.id);
    if (!result) throw new UnauthorizedException();
    return;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async refreshToken(
    @RefreshToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) throw new UnauthorizedException();
    try {
      const { accessTokenNew, refreshTokenNew } =
        await this.authService.refreshToken(token);

      res.cookie('refreshToken', refreshTokenNew, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken: accessTokenNew };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  @Post('registration')
  // @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(passwordRecoveryDto.email);
  }

  @Post('new-password')
  @HttpCode(204)
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.authService.newPassword(newPasswordDto);
  }
  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationConfirmation(
    @Body() registrationConfirmationDto: RegistrationConfirmationDto,
  ) {
    return this.authService.registrationConfirmation(
      registrationConfirmationDto.code,
    );
  }
  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationEmailResending(
    @Body() registrationEmailResending: RegistrationEmailResending,
  ) {
    return this.authService.registrationEmailResending(
      registrationEmailResending.email,
    );
  }
}
