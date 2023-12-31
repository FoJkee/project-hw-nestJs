import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServicess } from '../auth/jwt/jwt';
import { UserService } from '../user/infrastructure/user.service';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtServicess,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();
    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    const jwtPayload = await this.jwtService.verifyAccessToken(token);
    if (!jwtPayload) throw new UnauthorizedException();
    const user = await this.userService.findUserId(jwtPayload.userId);
    if (!user) throw new UnauthorizedException();
    request.user = user;
    return true;
  }
}
