import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private accessJwtSecret = this.configService.get('jwt_access_secret');
  private refreshJwtToken = this.configService.get('jwt_refresh_secret');

  async createAccessAndRefreshToken(deviceId: string, userId: string) {
    const accessToken = jwt.sign({ userId }, this.accessJwtSecret, {
      expiresIn: '30m',
    });

    const refreshToken = jwt.sign({ userId, deviceId }, this.refreshJwtToken, {
      expiresIn: '30m',
    });
    return { accessToken, refreshToken };
  }

  async getLastActiveDateFromToken(token: string) {
    const result: any = await jwt.decode(token);
    return new Date(result.iat * 1000).toISOString();
  }

  async verifyRefreshToken(token: string) {
    try {
      const res: any = await jwt.verify(token, this.refreshJwtToken);
      return { userId: res.userId, deviceId: res.deviceId };
    } catch (e) {
      return null;
    }
  }
}
