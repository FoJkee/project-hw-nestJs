import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalValidationPipe } from './validation.pipe';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  // app.useGlobalPipes(GlobalValidationPipe);
  // app.useGlobalFilters();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
};
