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
import { JwtService } from '../jwt/jwt';
import { SecurityDevicesService } from '../../security-devices/infractructure/security-devices.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

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
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
    @RefreshTokenDecorator() deviceDto: DeviceDto,
  ) {
    try {
      await this.authService.logout(deviceDto, user.id);
      return res.clearCookie('refreshToken');
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('me')
  async me(@User() user: UserEntity) {
    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }

  @Post('refresh-token')
  async refreshToken(
    @RefreshToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) throw new UnauthorizedException();
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshToken(token);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

// @Post('logout')
// async refreshToken(@RefreshToken() token: string) {
//   const dataToken = await this.jwtService.verifyRefreshToken(token);
//   if (!dataToken) throw new UnauthorizedException();
//   await this.securityDevicesService.deleteDeviceId(
//     dataToken.deviceId,
//     dataToken.userId,
//   );
// }
