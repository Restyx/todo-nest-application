import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queue: string): RmqOptions {
    const USER = this.configService.get<string>('RABBITMQ_USER');
    const PASSWORD = this.configService.get<string>('RABBITMQ_PASS');
    const HOST = this.configService.get<string>('RABBITMQ_HOST');
    const PORT = this.configService.get<string>('RABBITMQ_PORT');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}:${PORT}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  getUserFromHeader(context: RmqContext) {
    const {
      properties: {
        headers: { user },
      },
    } = context.getMessage();

    return user;
  }

  acknowledgeMessage(context: RmqContext): void {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
