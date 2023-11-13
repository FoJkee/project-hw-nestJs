import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DeviceName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { deviceName: string } => {
    const request = ctx.switchToHttp().getRequest();
    return request.get('User-Agent');
  },
);
