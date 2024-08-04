import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { ProjectModule } from './project/project.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule.registerTypeORM('PROJECTS_SERVICE', []),
    SharedModule,
    ProjectModule,
    ListModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class ProjectsModule {}
