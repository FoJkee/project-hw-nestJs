import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServicess {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private accessJwtSecret = this.configService.get<string>('jwt_access_secret');
  private refreshJwtToken =
    this.configService.get<string>('jwt_refresh_secret');

  async createAccessAndRefreshToken(deviceId: string, userId: string) {
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: this.accessJwtSecret, expiresIn: '2h' },
    );
    const refreshToken = this.jwtService.sign(
      { userId, deviceId },

      { secret: this.refreshJwtToken, expiresIn: '2h' },
    );
    return { accessToken, refreshToken };
  }

  async getLastActiveDateFromToken(token: string) {
    const result: any = this.jwtService.decode(token);
    return new Date(result.iat * 1000).toISOString();
  }

  async verifyRefreshToken(token: string) {
    try {
      const res: any = await this.jwtService.verifyAsync(token, {
        secret: this.refreshJwtToken,
      });
      return {
        userId: res.userId,
        deviceId: res.deviceId,
      };
    } catch (e) {
      return null;
    }
  }

  async verifyAccessToken(token: string) {
    try {
      const res: any = await this.jwtService.verifyAsync(token, {
        secret: this.accessJwtSecret,
      });
      return { userId: res.userId };
    } catch (e) {
      return null;
    }
  }
}

// type TokenPayload = {
//   userId: string;
//   deviceId: string;
// };
