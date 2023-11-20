import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport';
import { PassportStrategy } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();

    const code = Buffer.from('admin:qwerty', 'utf-8').toString('base64');

    if (auth !== `Basic ${code}`) throw new UnauthorizedException();
    return true;
  }
}

// @Injectable()
// export class BasicStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       passReqToCallback: true,
//     });
//   }
//
//   public validate = async (req, username, password): Promise<boolean> => {
//     if (
//       this.configService.get<string>('basic_user') === username &&
//       this.configService.get<string>('basic_pass') === password
//     ) {
//       return true;
//     }
//     throw new UnauthorizedException();
//   };
// }
