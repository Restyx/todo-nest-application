import { NestFactory } from '@nestjs/core';
import { ProjectsModule } from './projects.module';
import { ConfigService } from '@nestjs/config';
import { ServiceExceptionFilter, SharedService } from '@app/shared';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProjectsModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const projectsWtireQueue = configService.get<string>(
    'RABBITMQ_QUEUE_PROJECTS_WRITE',
  );
  const projectsReadQueue = configService.get<string>(
    'RABBITMQ_QUEUE_PROJECTS_READ',
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServiceExceptionFilter());

  app.connectMicroservice(sharedService.getRmqOptions(projectsWtireQueue), {
    inheritAppConfig: true,
  });
  app.connectMicroservice(sharedService.getRmqOptions(projectsReadQueue), {
    inheritAppConfig: true,
  });


  await app.startAllMicroservices();
}
bootstrap();
