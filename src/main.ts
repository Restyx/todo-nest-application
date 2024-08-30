import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('TODO app')
    .setDescription("api for managing user's todo lists similar to trello")
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'for authentication purposes')
    .addTag('users', 'for users managment and CRUD operations')
    .addTag('boards', 'for boards managment and CRUD operations')
    .addTag('lists', 'for lists managment and CRUD operations')
    .addTag('cards', 'for cards managment and CRUD operations')
    .addTag('comments', 'for comments managment and CRUD operations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(port);
}
bootstrap();
