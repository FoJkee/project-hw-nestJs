import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServicess } from '../auth/jwt/jwt';
import { UserRepository } from '../user/infrastructure/user.repository';
import { SecurityDevicesService } from '../security-devices/infractructure/security-devices.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtServicess,
    private readonly userRepository: UserRepository,
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();
    const dataToken = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!dataToken) throw new UnauthorizedException();

    const device = await this.securityDevicesService.findDeviceUserId(
      dataToken.deviceId,
      dataToken.userId,
    );

    const iatDataToken = new Date(dataToken.iat * 1000).toISOString();

    if (!device || (device && device.lastActiveDate !== iatDataToken))
      throw new UnauthorizedException();

    const user = await this.userRepository.findUserId(dataToken.userId);
    if (!user) throw new UnauthorizedException();

    if (device.userId !== dataToken.userId) throw new UnauthorizedException();

    request.user = user;
    request.refreshTokenDecoratorJwt = dataToken;
    return true;
  }
}

//const device = findDeviceById(dataToken.deviceId)
//device.lastActiveDate !== dataToken.iat -> 401
//device.userId !== dataToken.userId -> 401
