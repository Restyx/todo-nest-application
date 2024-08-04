import { Module } from '@nestjs/common';
import { AppAuthController } from './app-auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, SharedModule } from '@app/shared';
import { AppProjectsController } from './app-projects.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_QUEUE_AUTH),
    SharedModule.registerRMQ(
      'PROJECT_READ_SERVICE',
      process.env.RABBITMQ_QUEUE_PROJECTS_READ,
    ),
    SharedModule.registerRMQ(
      'PROJECT_WRITE_SERVICE',
      process.env.RABBITMQ_QUEUE_PROJECTS_WRITE,
    ),
  ],
  controllers: [AppAuthController, AppProjectsController],
  providers: [AuthGuard],
})
export class AppModule {}
