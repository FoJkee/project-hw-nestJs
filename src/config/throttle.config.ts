import { ThrottlerOptionsFactory } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  // private ttl: number = this.configService?.get('throttler_ttl', 10);
  // private limit: number = this.configService?.get('throttler_limit', 5);

  private ttl: number = parseInt('throttler_ttl', 10);
  private limit: number = parseInt('throttler_limit', 10);

  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      throttlers: [{ limit: this.limit, ttl: this.ttl }],
    };
  }
}
