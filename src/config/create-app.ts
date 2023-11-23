import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { GlobalValidationPipe } from './validation.pipe';
import { GlobalHttpExceptionFilter } from './exeption.filter';

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(GlobalHttpExceptionFilter);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app;
};
