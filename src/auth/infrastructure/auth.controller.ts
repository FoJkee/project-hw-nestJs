import {
  Body,
  Controller,
  Ip,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from '../dto/login.dto';
import { DeviceName } from '../../decorators/deviceName.decorator';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
