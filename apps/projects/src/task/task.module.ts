import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SharedModule, Task } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListModule } from '../list/list.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), SharedModule, ListModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
