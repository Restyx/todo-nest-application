import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), AuthModule, ProjectModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
