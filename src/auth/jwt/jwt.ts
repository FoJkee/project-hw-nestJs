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
      { userId, deviceId },
      { secret: this.accessJwtSecret, expiresIn: '1000000' },
    );
    const refreshToken = this.jwtService.sign(
      { userId, deviceId },

      { secret: this.refreshJwtToken, expiresIn: '2000000' },
    );
    return { accessToken, refreshToken };
  }

  // async createAccessToken(userId: string, deviceId: string) {
  //   const accessToken = this.jwtService.sign(
  //     { userId, deviceId },
  //     { secret: this.accessJwtSecret, expiresIn: '100000' },
  //   );
  //   return accessToken;
  // }
  //
  // async createRefreshToken(userId: string, deviceId: string) {
  //   const refreshToken = this.jwtService.sign(
  //     { userId, deviceId },
  //
  //     { secret: this.refreshJwtToken, expiresIn: '200000' },
  //   );
  //   return refreshToken;
  // }

  async getLastActiveDateFromToken(token: string) {
    const result: any = this.jwtService.decode(token);
    return new Date(result.iat * 1000).toISOString();
  }

  // async verifyRefreshToken(token: string) {
  //   try {
  //     const res: any = await this.jwtService.verifyAsync(token, {
  //       secret: this.refreshJwtToken,
  //     });
  //     return {
  //       userId: res.userId,
  //       deviceId: res.deviceId,
  //     };
  //   } catch (e) {
  //     return null;
  //   }
  // }
  async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshJwtToken,
      });
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
