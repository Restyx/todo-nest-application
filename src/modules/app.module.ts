import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from 'src/config/debug.config';
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
    ConfigModule.forRoot({ load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('database.postgres.host'),
          port: configService.get<number>('database.postgres.port'),
          username: configService.get<string>('database.postgres.user'),
          password: configService.get<string>('database.postgres.password'),
          database: configService.get<string>('database.postgres.database'),
          entities: [
            UserEntity,
            BoardEntity,
            ListEntity,
            CardEntity,
            CommentEntity,
          ],
          synchronize: configService.get<boolean>('database.postgres.synchronize'), // turn off after development
          autoLoadEntities: true,
        };
      },
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
