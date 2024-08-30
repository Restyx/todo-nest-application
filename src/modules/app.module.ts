import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/lib/entities/user.entity';
import { BoardEntity } from 'src/lib/entities/board.entity';
import { ListEntity } from 'src/lib/entities/list.entity';
import { CardEntity } from 'src/lib/entities/card.entity';
import { CommentEntity } from 'src/lib/entities/comment.entity';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        UserEntity,
        BoardEntity,
        ListEntity,
        CardEntity,
        CommentEntity,
      ],
      synchronize: true, // turn off after development
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    BoardModule,
    ListModule,
    CardModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
