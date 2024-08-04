import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List, SharedModule } from '@app/shared';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), SharedModule, ProjectModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
