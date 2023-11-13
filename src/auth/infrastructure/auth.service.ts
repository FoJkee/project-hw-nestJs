import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../../user/infrastructure/user.service';
import { randomUUID } from 'crypto';
import { JwtService } from '../jwt/jwt';
import { Device } from '../../security-devices/models/device.schema';
import { SecurityDevicesService } from '../../security-devices/infractructure/security-devices.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  async login(loginDto: LoginDto, ip: string, deviceName: string) {
    const user = await this.userService.validateUserAndPass(
      loginDto.loginOrEmail,
      loginDto.password,
    );
    if (!user) return null;
    const deviceId = randomUUID();

    const accessToken = await this.jwtService.createAccessToken(user.id);
    const refreshToken = await this.jwtService.createRefreshToken(
      deviceId,
      user.id,
    );

    const lastActiveDate =
      await this.jwtService.getLastActiveDateFromToken(refreshToken);

    const newDevice: Device = {
      ip,
      userId: user.id,
      deviceId,
      title: deviceName,
      lastActiveDate,
    };
    await this.securityDevicesService.createNewDevice(newDevice);
    return { accessToken, refreshToken };
  }
}
