import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { createApp } from './config/create-app';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  createApp(app);
  await app.listen(port || 7000);
}
bootstrap();
