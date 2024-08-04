import { DynamicModule, Module } from '@nestjs/common';
import { SharedService } from '../services/shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRMQ(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const USER = configService.get<string>('RABBITMQ_USER');
          const PASSWORD = configService.get<string>('RABBITMQ_PASS');
          const HOST = configService.get<string>('RABBITMQ_HOST');
          const PORT = configService.get<string>('RABBITMQ_PORT');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}`],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }

  static registerTypeORM(
    serviceName: string,
    entities: EntityClassOrSchema[] = [],
  ): DynamicModule {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(`POSTGRES_${serviceName}_HOST`),
        port: +configService.get<number>(`POSTGRES_${serviceName}_PORT`),
        username: configService.get<string>(`POSTGRES_${serviceName}_USER`),
        password: configService.get<string>(`POSTGRES_${serviceName}_PASSWORD`),
        database: configService.get<string>(`POSTGRES_${serviceName}_DB`),
        entities: entities,
        synchronize: true,
        autoLoadEntities: true,
      }),
    });
  }
}
