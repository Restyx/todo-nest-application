import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ServiceExceptionFilter, SharedService } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const authQueue = configService.get<string>('RABBITMQ_QUEUE_AUTH');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServiceExceptionFilter());

  app.connectMicroservice(sharedService.getRmqOptions(authQueue), {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();
}
bootstrap();
