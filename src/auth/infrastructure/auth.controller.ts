import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginDto } from '../dto/login.dto';
import { DeviceName } from '../../decorators/deviceName.decorator';
import { Response, Request } from 'express';
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

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @User() user: UserEntity,
    @RefreshTokenDecorator() deviceDto: DeviceDto,
    //@CurrentUserIdAndDeviceId() dto : {userId: string, deviceId: string}
  ) {
    const refreshToken = req.user;
    if (!refreshToken) throw new UnauthorizedException();
    const result = await this.authService.logout(deviceDto.deviceId, user.id);
    if (!result) throw new UnauthorizedException();
    res.clearCookie('refreshToken');
    return;
  }

  // @Post('/logout')
  // @HttpCode(204)
  // async logout(
  //   @RefreshToken() token: string,
  //   @User() user: UserEntity,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const dataToken = await this.jwtService.verifyRefreshToken(token);
  //   console.log('dataToken', dataToken);
  //   if (!dataToken) throw new UnauthorizedException();
  //   await this.authService.logout(dataToken.deviceId, dataToken.userId);
  //   return res.clearCookie('refreshToken');
  // }

  @Post('refresh-token')
  async refresh_Token(
    @RefreshToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshToken(token);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken: accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('registration')
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
  @HttpCode(204)
  async registrationConfirmation(
    @Body() registrationConfirmationDto: RegistrationConfirmationDto,
  ) {
    return this.authService.registrationConfirmation(
      registrationConfirmationDto.code,
    );
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() registrationEmailResending: RegistrationEmailResending,
  ) {
    return this.authService.registrationEmailResending(
      registrationEmailResending.email,
    );
  }
}

// @Post('refresh-token')
// async refreshToken(@RefreshToken() token: string) {
//   const dataToken = await this.jwtService.verifyRefreshToken(token);
//   if (!dataToken) throw new UnauthorizedException();
//   await this.securityDevicesService.deleteDeviceId(
//     dataToken.deviceId,
//     dataToken.userId,
//   );
// }
