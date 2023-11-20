import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { createApp } from './config/create-app';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  createApp(app);
  await app.listen(port);
}
bootstrap();
