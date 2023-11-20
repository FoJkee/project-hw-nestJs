import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('mongo_uri'),
    };
  }
}
