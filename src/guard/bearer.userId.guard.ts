import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtServicess } from '../auth/jwt/jwt';

@Injectable()
export class BearerUserIdGuard implements CanActivate {
  constructor(private readonly jwtService: JwtServicess) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) {
      request.userId = null;
      return true;
    }
    const token = auth.split(' ')[1];
    if (!token) {
      request.userId = null;
      return true;
    }
    const payload = await this.jwtService.verifyAccessToken(token);
    if (!payload) {
      request.userId = null;
      return true;
    }
    request.userId = payload.userId;
    return true;
  }
}
