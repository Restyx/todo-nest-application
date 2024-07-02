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
      host: process.env.POSTGRESQL_HOST,
      port: +(process.env.POSTGRESQL_PORT || '5432'),
      username: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE,
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
    //       host: configService.get<string>('POSTGRESQL_HOST'),
    //       port: configService.get<number>('POSTGRESQL_PORT'),
    //       username: configService.get<string>('POSTGRESQL_USER'),
    //       password: configService.get<string>('POSTGRESQL_PASSWORD'),
    //       database: configService.get<string>('POSTGRESQL_DATABASE'),
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
