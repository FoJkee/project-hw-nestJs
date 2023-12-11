import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DeviceDto } from '../security-devices/dto/device.dto';

export const RefreshTokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): DeviceDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.refreshTokenDecoratorJwt;
  },
);

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies.refreshToken;
    // const refreshToken = request.cookies.refreshToken;
    // if (!refreshToken) throw new UnauthorizedException();
    // return true;
  },
);
