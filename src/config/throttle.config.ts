import { ThrottlerOptionsFactory } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';
import * as process from 'process';

export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  //
  private ttl = this.configService?.get<number>('throttler_ttl');
  private limit = this.configService?.get<number>('throttler_limit');

  // private ttl = process.env.THROTTLE_TTL;
  // private limit: number = parseInt('throttler_limit', 10);

  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      throttlers: [{ limit: this.limit!, ttl: this.ttl! }],
    };
  }
}
