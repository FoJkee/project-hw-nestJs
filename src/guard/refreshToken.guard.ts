import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServices } from '../auth/jwt/jwt';
import { UserRepository } from '../user/infrastructure/user.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    console.log('refreshToken', refreshToken);
    if (!refreshToken) throw new UnauthorizedException();
    const dataToken = await this.jwtService.verifyRefreshToken(refreshToken);
    console.log('dataToken', dataToken);
    if (!dataToken) throw new UnauthorizedException();
    const user = await this.userRepository.findUserId(dataToken.userId);
    if (!user) throw new UnauthorizedException();
    request.RefreshTokenDecoratorJwt = dataToken;
    request.user = user;
    return true;
  }
}
