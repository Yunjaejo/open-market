import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
  dotenv.config({ path: envFile });
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
