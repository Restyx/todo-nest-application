import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   name: 'postgres-connection',
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       host: configService.get<string>('POSTGRES_HOST'),
    //       port: configService.get<number>('POSTGRES_PORT'),
    //       username: configService.get<string>('POSTGRES_USER'),
    //       password: configService.get<string>('POSTGRES_PASSWORD'),
    //       database: configService.get<string>('POSTGRES_DB'),
    //       entities: [],
    //       synchronize: true,
    //       autoLoadEntities: true,
    //     };
    //   },
    //   inject: [ConfigService]
    // }),
    UserModule,
    AuthModule,
    ProjectModule,
    ListModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
