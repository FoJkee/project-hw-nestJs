import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private accessJwtSecret = this.configService.get('jwt_access_secret');
  private refreshJwtToken = this.configService.get('jwt_refresh_secret');

  async createAccessToken(userId: string) {
    const accessToken: string = jwt.sign({ userId }, this.accessJwtSecret, {
      expiresIn: '30m',
    });
    return accessToken;
  }
  async createRefreshToken(deviceId: string, userId: string) {
    const refreshToken: string = jwt.sign(
      { userId, deviceId },
      this.refreshJwtToken,
      {
        expiresIn: '30m',
      },
    );
    return refreshToken;
  }

  async getLastActiveDateFromToken(token: string) {
    const result: any = await jwt.decode(token);
    return new Date(result.iat * 1000).toISOString();
  }
}
